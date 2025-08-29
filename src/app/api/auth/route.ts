
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-development');
const ALGORITHM = 'HS256';

const getJwt = (fid: number, username: string, connectedAddress?: string) => {
  const now = Math.floor(Date.now() / 1000);
  const iat = now;
  const exp = now + 60 * 60 * 24 * 30; // 30 days

  const payload: { fid: number; username: string; connectedAddress?: string } = { fid, username };
  if (connectedAddress) {
    payload.connectedAddress = connectedAddress;
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .setExpirationTime(exp)
    .sign(JWT_SECRET);
}

export async function POST(req: NextRequest) {
  try {
    const { fid, username, bio, displayName, pfpUrl, connectedAddress } = await req.json();
    
    if (!fid) {
      return NextResponse.json({ error: 'fid is required' }, { status: 400 });
    }

    const token = await getJwt(fid, username, connectedAddress);
    const response = NextResponse.json({
        message: 'Signed in',
        fid,
        username,
        bio,
        displayName,
        pfpUrl,
        connectedAddress,
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Signed out' }, { status: 200 });
    response.cookies.set('token', '', { expires: new Date(0) });
    return response;
  } catch (error) {
    console.error('Sign-out error:', error);
    return NextResponse.json({ error: 'Sign-out failed.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json({ isAuthenticated: false }, { status: 200 });
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return NextResponse.json({ 
            isAuthenticated: true, 
            fid: payload.fid, 
            username: payload.username,
            connectedAddress: payload.connectedAddress,
        }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ isAuthenticated: false, error: "Invalid token" }, { status: 401 });
    }
}
