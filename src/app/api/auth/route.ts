
// This file is no longer needed with the @farcaster/miniapp-sdk
// The MiniApp SDK handles user authentication within the Farcaster client (e.g., Warpcast).
// We'll leave the file here for now, but its contents can be removed or the file deleted.
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Authentication is handled by the Farcaster MiniApp SDK.' }, { status: 200 });
}

export async function POST() {
    return NextResponse.json({ message: 'Authentication is handled by the Farcaster MiniApp SDK.' }, { status: 404 });
}

export async function DELETE() {
    return NextResponse.json({ message: 'Authentication is handled by the Farcaster MiniApp SDK.' }, { status: 404 });
}
