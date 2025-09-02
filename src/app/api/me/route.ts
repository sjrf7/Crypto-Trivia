
import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

async function validateFarcasterMessage(message: string, signature: string) {
    const url = 'https://api.neynar.com/v2/farcaster/frame/validate';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            message_bytes_in_hex: signature,
        }),
    });

    if (!response.ok) {
        console.error('Neynar API validation failed:', await response.text());
        throw new Error('Failed to validate Farcaster message.');
    }

    const validationData = await response.json();
    return validationData;
}


async function resolveUser(fid: number) {
  try {
    const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': process.env.NEYNAR_API_KEY || '',
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

  // Fallback if Neynar fails
  return { fid };
}


export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();

    if (!message || !signature) {
      return NextResponse.json({ message: 'Missing message or signature' }, { status: 400 });
    }

    // Neynar's validate-frame endpoint can be used to validate a SIWF message
    const validationResponse = await fetch('https://api.neynar.com/v2/farcaster/frame/validate', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api_key': NEYNAR_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
             // The signature is the 'message_bytes_in_hex' for this endpoint
            message_bytes_in_hex: signature,
        }),
    });
    
    const validationData = await validationResponse.json();

    if (!validationData.valid) {
       return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }
    
    // The FID is available in the validated data
    const fid = validationData.action?.interactor?.fid;
    if (!fid) {
         return NextResponse.json({ message: 'Could not extract FID from validated message' }, { status: 401 });
    }

    const user = await resolveUser(fid);
    
    return NextResponse.json(user, { status: 200 });

  } catch (e) {
    console.error('Unexpected error during auth validation:', e);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: 'This endpoint only accepts POST requests for Farcaster authentication.' }, { status: 405 });
}
