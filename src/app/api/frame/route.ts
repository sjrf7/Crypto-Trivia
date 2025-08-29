
import { NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://crypto-trivia.vercel.app';

// This function handles the POST request from a Farcaster frame
export async function POST(req: NextRequest) {
  try {
    // When a user clicks the "Start Game" button on the frame,
    // Farcaster sends a POST request to this endpoint.
    // We want to redirect the user to the main play page of the app.
    
    // The response needs to be a 302 redirect to the desired URL.
    return NextResponse.redirect(`${APP_URL}/play`, { status: 302 });

  } catch (error) {
    console.error('Error handling frame action:', error);
    // If something goes wrong, we can redirect to the home page as a fallback.
    return NextResponse.redirect(APP_URL, { status: 302 });
  }
}

// A GET request to this endpoint can be used for debugging or direct access.
// It will simply redirect to the main app URL.
export async function GET(req: NextRequest) {
    return NextResponse.redirect(APP_URL, { status: 302 });
}
