
import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
if (!NEYNAR_API_KEY) {
  throw new Error('NEYNAR_API_KEY is not set');
}
const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const signer_uuid = searchParams.get('signer_uuid');

  if (!signer_uuid) {
    return NextResponse.json({ message: 'signer_uuid is required' }, { status: 400 });
  }

  try {
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
