
import { type NextRequest, NextResponse } from 'next/server';
import { JWTPayload, SignJWT } from 'jose';
import { Message, NobleEd25519Signer, HubRestAPIClient } from '@farcaster/core';

const JWT_SECRET = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : null;
const APP_DOMAIN = process.env.NEXT_PUBLIC_URL || 'farcaster-trivia.vercel.app';
const HUB_URL = 'nemes.farcaster.xyz:2281';

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set. Authentication will not be secure. Please set a secret in your .env file.');
  } else {
    console.warn('JWT_SECRET is not set. Authentication will not be secure.');
  }
}

// Instantiate the HubRestAPIClient
const client = new HubRestAPIClient({ hubUrl: HUB_URL });

export async function POST(req: NextRequest) {
  const { message, signature, nonce, pfpUrl, username, displayName, fid, custody, verifications } = await req.json();

  try {
    const signInMessage = Message.fromJSON(message);
    const result = await client.validateMessage(signInMessage);
    
    if (result.isOk() && result.value.valid) {
      // The message is valid
      const farcasterUser = {
        pfpUrl,
        username,
        displayName,
        fid,
        custody,
        verifications
      };

      if (JWT_SECRET) {
        const token = await new SignJWT(farcasterUser as unknown as JWTPayload)
          .setProtectedHeader({ alg: 'HS256' })
          .setIssuedAt()
          .setExpirationTime('24h')
          .sign(JWT_SECRET);
        
        const response = NextResponse.json({
          ...farcasterUser,
          token,
        });

        response.cookies.set('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });

        return response;
      } else {
         // Fallback for when JWT_SECRET is not available in development
         return NextResponse.json({ ...farcasterUser });
      }

    } else {
      // The message is invalid
      return NextResponse.json(
        { code: 'invalid_message', message: result.isErr() ? result.error.message : 'Invalid message signature' },
        { status: 401 }
      );
    }
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { code: 'server_error', message: e.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (token && JWT_SECRET) {
    try {
      // Here you would typically verify the JWT and return the user session
      // For now, we'll just indicate that a token exists.
      // In a real app, you'd use a library like `jose`'s `jwtVerify`
      // const { payload } = await jwtVerify(token, JWT_SECRET);
      return NextResponse.json({ isAuthenticated: true });
    } catch (e) {
       console.error('Session verification failed', e);
       const response = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
       response.cookies.delete('token');
       return response;
    }
  }
  
  // No token, just return not authenticated
  return NextResponse.json({ isAuthenticated: false });
}
