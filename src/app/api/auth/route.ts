
import { getFarcasterUser, session } from '@farcaster/auth-kit';
import { type NextRequest, NextResponse } from 'next/server';
import { JWTPayload, SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : null;
const APP_DOMAIN = process.env.NEXT_PUBLIC_URL || 'farcaster-trivia.vercel.app';

if (!JWT_SECRET) {
  // In development, it's okay to not have a JWT_SECRET, but we should warn the user.
  // In production, this should be an error.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set. Authentication will not be secure. Please set a secret in your .env file.');
  } else {
    console.warn('JWT_SECRET is not set. Authentication will not be secure.');
  }
}

export async function POST(req: NextRequest) {
  const { message, signature, nonce } = await req.json();

  try {
    const {
      success,
      error,
      user: farcasterUser,
    } = await getFarcasterUser({
      message,
      signature,
      domain: APP_DOMAIN,
      nonce,
    });

    if (success && farcasterUser && JWT_SECRET) {
      const token = await new SignJWT(farcasterUser as unknown as JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
      
      const response = NextResponse.json({
        ...farcasterUser,
        token,
      });

      // Set cookie
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;

    } else if (error) {
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.statusCode }
      );
    } else {
      // Fallback for missing JWT_SECRET
      return NextResponse.json({ ...farcasterUser });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { code: 'server_error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (token && JWT_SECRET) {
    // Return the user's session if they have a valid token
    try {
      const user = await session({
        token,
        secret: JWT_SECRET as Uint8Array,
      });
      return NextResponse.json(user);
    } catch (e) {
       console.error('Session verification failed', e);
       // Clear invalid cookie
       const response = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
       response.cookies.delete('token');
       return response;
    }
  } else {
    // Generate a nonce for the user to sign
    const { nonce, ...siwe } = await getFarcasterUser({ domain: APP_DOMAIN });
    return NextResponse.json({ ...siwe, nonce });
  }
}
