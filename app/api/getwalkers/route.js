import { clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
  const { params } = request;
  try {
    const users = await clerkClient.users.getUserList();
    const walker = users.filter(user => user.publicMetadata.role.includes('walker'));
    console.log(walker);
    return new NextResponse(JSON.stringify(walker), {
      headers: {
        'Cache-Control': 'no-store', // or 'no-cache' depending on your requirements
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'no-store', // or 'no-cache' depending on your requirements
      },
    });
  }
}