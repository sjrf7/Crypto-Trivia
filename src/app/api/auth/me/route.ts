
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@farcaster/quick-auth';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

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
    const { fid, is_authenticated } = await verifyJwt(token);

    if (!is_authenticated || !fid) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Now that we have the FID, let's get the user's profile from Neynar
    // In a real app, you might want to cache this response.
    const neynarResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
        headers: {
            'api_key': NEYNAR_API_KEY,
            'Content-Type': 'application/json'
        }
    });

    if (!neynarResponse.ok) {
        const errorBody = await neynarResponse.json();
        console.error('Neynar API error:', errorBody);
        return NextResponse.json({ error: 'Failed to fetch user data from Farcaster.' }, { status: 500 });
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
    }, { status: 200 });

  } catch (error: any) {
    console.error('[API/AUTH/ME] Verification Error:', error);
    return NextResponse.json({ error: `Token verification failed: ${error.message}` }, { status: 401 });
  }
}
