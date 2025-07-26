// src/app/api/leads/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDB from '@/lib/db';
import Lead from '@/models/Lead';

// This new approach avoids the complex second argument that was causing the build error.
// We will get the 'id' directly from the request url.

// PUT (update) a specific lead
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Get the ID from the URL path
  const id = request.url.split('/').pop();

  try {
    await connectToDB();
    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    if (session.user.role === 'salesperson' && lead.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updatedLead = await Lead.findByIdAndUpdate(id, body, { new: true });
    
    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error updating lead', error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE a specific lead
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Get the ID from the URL path
  const id = request.url.split('/').pop();
  
  try {
    await connectToDB();
    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    if (session.user.role === 'salesperson' && lead.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    await Lead.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Lead deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error deleting lead', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}