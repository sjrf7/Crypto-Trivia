
import { type NextRequest, NextResponse } from 'next/server';
import { JWTPayload, SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : null;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not set. Authentication will not be secure. Please set a secret in your .env file.');
  } else {
    console.warn('JWT_SECRET is not set. Authentication will not be secure.');
  }
}

// This endpoint is called by the Farcaster AuthKit after a user signs in.
// It receives the user's profile information and creates a session token.
export async function POST(req: NextRequest) {
  try {
    const {
      pfpUrl,
      username,
      displayName,
      fid,
      custody,
      verifications
    } = await req.json();

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

  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { code: 'server_error', message: e.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
