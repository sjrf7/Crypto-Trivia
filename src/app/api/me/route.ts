
import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

// This endpoint uses the Neynar API to validate the SIWF message.
async function validateMessageWithNeynar(message: string, signature: string, nonce: string) {
    try {
        const response = await fetch("https://api.neynar.com/v2/farcaster/frame/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api_key": NEYNAR_API_KEY,
            },
            body: JSON.stringify({
                message_bytes_in_hex: message,
                cast_reaction_context: false,
                follow_context: false,
            }),
        });

        const validationData = await response.json();
        
        // Basic check for valid response structure
        if (validationData && validationData.valid) {
            const user = validationData.action.interactor;
            return {
                success: true,
                fid: user.fid,
                user: {
                  fid: user.fid,
                  username: user.username,
                  display_name: user.display_name,
                  pfp_url: user.pfp_url,
                  bio: user.profile?.bio?.text,
                }
            };
        }
    } catch (e) {
        console.error("Neynar validation failed", e);
    }

    return { success: false, fid: null, user: null };
}

// Farcaster's SIWF message structure has changed. We use Neynar's validation
// which abstracts this away, but we need to pass the correct parameters.
// This new endpoint structure is simpler and relies on Neynar's validation endpoint.
export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();

    if (!message || !signature) {
      return NextResponse.json({ message: 'Missing required SIWF parameters: message and signature' }, { status: 400 });
    }

    // Neynar's /frame/validate endpoint can be used for SIWF messages as well.
    // It's a versatile endpoint. We pass `message_bytes_in_hex`.
    const neynarResponse = await fetch('https://api.neynar.com/v2/farcaster/message/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api_key': NEYNAR_API_KEY,
        },
        body: JSON.stringify({ message_bytes_in_hex: message }),
    });

    const data = await neynarResponse.json();

    if (!data.valid) {
        return NextResponse.json({ message: 'Invalid signature', details: data }, { status: 401 });
    }
    
    // Once validated, we can use the fid to get the user's profile from the response
    const user = data.action.interactor;
    const resolvedUser = {
      fid: user.fid,
      username: user.username,
      display_name: user.display_name,
      pfp_url: user.pfp_url,
      bio: user.profile?.bio?.text,
    };

    return NextResponse.json(resolvedUser, { status: 200 });

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
