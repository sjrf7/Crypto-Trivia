
import { NextRequest, NextResponse } from 'next/server';
import {NeynarAPIClient} from '@neynar/nodejs-sdk';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

// This endpoint now validates the Quick Auth JWT.
// It fetches the public key from the Quick Auth server and verifies the token.
async function validateQuickAuthToken(token: string) {
    try {
        // In a real app, you'd cache this to avoid fetching on every request
        const res = await fetch("https://auth.farcaster.xyz/jwks");
        if (!res.ok) throw new Error('Failed to fetch JWKS');
        const { keys } = await res.json();
        const jwk = keys[0];

        // Dynamically import 'jose' only in the server environment
        const { importJWK, jwtVerify } = await import('jose');
        const key = await importJWK(jwk, 'ES256K');

        const { payload } = await jwtVerify(token, key, {
            issuer: 'https://auth.farcaster.xyz',
        });
        
        // The 'sub' claim in the JWT payload is the user's FID
        return { success: true, fid: Number(payload.sub) };

    } catch (e) {
        console.error("Quick Auth token validation failed", e);
        return { success: false, fid: null };
    }
}

async function getUserProfile(fid: number) {
    if (!NEYNAR_API_KEY) {
        // Fallback if Neynar key is not set
        return {
            fid: fid,
            username: `fid-${fid}`,
            display_name: `User ${fid}`,
            pfp_url: '',
            bio: '',
        };
    }
    try {
        const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);
        const { users } = await neynarClient.fetchBulkUsers([fid]);
        const user = users[0];
        if (!user) return null;

        return {
          fid: user.fid,
          username: user.username,
          display_name: user.display_name,
          pfp_url: user.pfp_url,
          bio: user.profile?.bio?.text,
        };
    } catch(e) {
        console.error("Neynar lookup failed", e);
        return null;
    }
}


export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Missing or invalid Authorization header' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const { success, fid } = await validateQuickAuthToken(token);

    if (!success || !fid) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userProfile = await getUserProfile(fid);

    if (!userProfile) {
        return NextResponse.json({ message: 'Could not resolve user profile' }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });

  } catch (e: any) {
    console.error('Unexpected error during auth validation:', e);
    const message = e.message || 'An unexpected error occurred.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

// GET is not used for SIWF, but good to keep for any other potential checks
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'This endpoint uses POST for Farcaster Sign-In.' }, { status: 405 });
}
