
import { NextRequest, NextResponse } from 'next/server';
import { createClient, Errors } from '@farcaster/quick-auth';

const NEYNAR_API_KEY = 'E529EF9F-06BD-4E56-BEE4-6B8496352854';

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
    const client = createClient();
    const payload = await client.verifyJwt({ token });
    const { sub: fid } = payload;


    if (!fid) {
      return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
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
    if (error instanceof Errors.InvalidTokenError) {
        console.info('Invalid token:', error.message)
        return NextResponse.json({ error: `Token verification failed: ${error.message}` }, { status: 401 });
    }
    console.error('[API/AUTH/ME] Verification Error:', error);
    return NextResponse.json({ error: `An unexpected error occurred.` }, { status: 500 });
  }
}
