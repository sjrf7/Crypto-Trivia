
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const NEYNAR_API_KEY = 'E529EF9F-06BD-4E56-BEE4-6B8496352854';
const QUICK_AUTH_PEM_URL = 'https://docs.farcaster.xyz/auth-kit/jwt.pem';

// Cache for the public key to avoid refetching it on every request.
let cachedKey: CryptoKey | null = null;
async function getPublicKey() {
  if (cachedKey) return cachedKey;
  const response = await fetch(QUICK_AUTH_PEM_URL);
  const pem = await response.text();
  const base64 = pem.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\n/g, '');
  const keyBuffer = Buffer.from(base64, 'base64');
  cachedKey = await crypto.subtle.importKey(
    'spki',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    true,
    ['verify']
  );
  return cachedKey;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header is missing.' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Bearer token is missing.' }, { status: 401 });
  }

  try {
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ['RS256'],
    });

    const fid = payload.sub;
    if (!fid) {
      return NextResponse.json({ error: 'Invalid token payload, FID is missing.' }, { status: 401 });
    }
    
    // If Neynar API key is missing, we can still return a basic profile with the FID.
    // The app can function in a degraded mode.
    if (!NEYNAR_API_KEY) {
      console.warn('NEYNAR_API_KEY is not set. Returning basic profile.');
      return NextResponse.json({
        fid: fid,
        username: `fid-${fid}`,
        display_name: `User ${fid}`,
        pfp_url: '',
      }, { status: 200 });
    }

    // Now that we have the FID, let's get the user's profile from Neynar
    const neynarResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
        headers: {
            'api_key': NEYNAR_API_KEY,
            'Content-Type': 'application/json'
        }
    });

    if (!neynarResponse.ok) {
        const errorBody = await neynarResponse.json();
        console.error('Neynar API error:', errorBody);
        // Even if Neynar fails, we can return the basic profile.
        return NextResponse.json({
            fid: fid,
            username: `fid-${fid}`,
            display_name: `User ${fid}`,
            pfp_url: '',
        }, { status: 200 });
    }
    
    const neynarData = await neynarResponse.json();
    const userProfile = neynarData.users[0];

    if (!userProfile) {
        return NextResponse.json({ error: 'User profile not found for FID.' }, { status: 404 });
    }

    // Return a structured profile object
    return NextResponse.json({
      fid: userProfile.fid,
      username: userProfile.username,
      display_name: userProfile.display_name,
      pfp_url: userProfile.pfp_url,
      bio: userProfile.profile?.bio?.text,
      follower_count: userProfile.follower_count,
      following_count: userProfile.following_count,
      custody_address: userProfile.custody_address,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API/AUTH/ME] Verification Error:', error);
    return NextResponse.json({ error: `An unexpected error occurred: ${error.message}` }, { status: 500 });
  }
}
