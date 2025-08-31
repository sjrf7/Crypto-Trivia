
// This file is no longer needed with the @farcaster/miniapp-sdk
// The MiniApp SDK communicates directly with the Farcaster client, so a custom RPC proxy is not required.
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'RPC is handled by the Farcaster MiniApp SDK.' }, { status: 404 });
}

export async function POST() {
    return NextResponse.json({ message: 'RPC is handled by the Farcaster MiniApp SDK.' }, { status: 404 });
}
