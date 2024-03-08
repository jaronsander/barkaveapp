import { clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
  const { params } = request;
  try {
    const users = await clerkClient.users.getUserList();
    const walker = users.filter(user => user.publicMetadata.role.includes('walker'));
    console.log(walker);
    return NextResponse.json(walker);
    } catch (error) {
    console.error('Error fetching users:', error.message);
    return NextResponse.json([]);
    }
}