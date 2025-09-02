
import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

if (!NEYNAR_API_KEY) {
  // This will be caught by the build process if the variable is not set.
  // We can log a warning and continue, as the key might be available at runtime.
  console.warn('NEYNAR_API_KEY is not set. API calls will likely fail.');
}

const getClient = () => {
    // Initialize the client only when the function is called, not at the module level.
    // This avoids throwing an error during build time if the key is not present.
    if (!NEYNAR_API_KEY) {
        throw new Error('NEYNAR_API_KEY is not set. Cannot initialize Neynar client.');
    }
    return new NeynarAPIClient(NEYNAR_API_KEY);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const signer_uuid = searchParams.get('signer_uuid');

  if (!signer_uuid) {
    return NextResponse.json({ message: 'signer_uuid is required' }, { status: 400 });
  }

  try {
    const neynarClient = getClient();
    const { user } = await neynarClient.lookupUserBySignerUuid(signer_uuid);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        fid: user.fid,
        username: user.username,
        display_name: user.displayName,
        pfp_url: user.pfpUrl,
        bio: user.profile?.bio?.text,
    }, { status: 200 });

  } catch (e: any) {
    console.error('Neynar lookup failed', e);
    const message = e.message || 'An unexpected error occurred.';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
