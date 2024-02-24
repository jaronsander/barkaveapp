import { clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
  const { params } = request;
  try {
    const users = await clerkClient.users.getUserList();
    users.forEach(user => console.log(user.publicMetadata));
    const usr = users.filter(user => user.publicMetadata.role.includes('user'));
    return NextResponse.json(usr);
    } catch (error) {
    console.error('Error fetching users:', error.message);
    return NextResponse.json([]);
    }
}