
import { NextRequest, NextResponse } from 'next/server';
import { createAppClient, viemConnector } from '@farcaster/sdk';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

const appClient = createAppClient({
  ethereum: viemConnector(),
});


async function resolveUser(fid: number) {
  try {
    const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': NEYNAR_API_KEY,
      }
    });

    if (res.ok) {
      const { users } = await res.json();
      if (users && users.length > 0) {
        const user = users[0];
        return {
          fid: user.fid,
          username: user.username,
          display_name: user.display_name,
          pfp_url: user.pfp_url,
          bio: user.profile?.bio?.text,
        };
      }
    }
  } catch (error) {
    console.error(`Failed to resolve user data for fid ${fid}:`, error);
  }
  return { fid }; // Fallback
}


export async function POST(req: NextRequest) {
  try {
    const { message, signature, nonce } = await req.json();

    if (!message || !signature || !nonce) {
      return NextResponse.json({ message: 'Missing required SIWF parameters' }, { status: 400 });
    }

    const { success, fid } = await appClient.verifySignInMessage({
      message,
      signature,
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000',
      nonce,
    });

    if (!success) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }
    
    // Once validated, we can use the fid to get the user's profile from Neynar
    const user = await resolveUser(fid);

    return NextResponse.json(user, { status: 200 });

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
