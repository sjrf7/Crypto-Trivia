
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { NextRequest, NextResponse } from "next/server";

const HUB_URL = "nemes.farcaster.xyz:2283";
const hubClient = getSSLHubRpcClient(HUB_URL);

// Function to handle GET requests for authentication
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    // Here you would typically validate the token and handle session management
    // For this example, we'll just return a success message
    if (token) {
      return NextResponse.json({ success: true, message: "Token received" });
    }
    
    return NextResponse.json({ success: false, message: "No token provided" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}

// Function to handle POST requests for authentication
export async function POST(req: NextRequest) {
  try {
    const {
      trustedData: { messageBytes },
    } = await req.json();

    const frameMessage = Message.decode(Buffer.from(messageBytes, "hex"));
    const validateResult = await hubClient.validateMessage(frameMessage);

    if (validateResult.isOk() && validateResult.value.valid) {
      const validMessage = validateResult.value.message;
      const fid = validMessage?.data?.fid;
      const action = validMessage?.data?.frameActionBody?.buttonIndex;
      const text = validMessage?.data?.frameActionBody?.inputText;

      // Here you can handle the validated message, e.g., create a session, etc.
      return NextResponse.json({ success: true, message: `User ${fid} clicked button ${action} with text ${text}` });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid message' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: `Something went wrong: ${error}` }, { status: 500 });
  }
}
