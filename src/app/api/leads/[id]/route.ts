// src/app/api/leads/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDB from '@/lib/db';
import Lead from '@/models/Lead';

// PUT (update) a specific lead
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDB();
    const lead = await Lead.findById(params.id);

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    // A salesperson can only edit their own leads. An admin can edit any lead.
    if (session.user.role === 'salesperson' && lead.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updatedLead = await Lead.findByIdAndUpdate(params.id, body, { new: true });
    
    return NextResponse.json(updatedLead, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating lead:', error.message);
      return NextResponse.json({ message: 'Error updating lead', error: error.message }, { status: 400 });
    }
    
    // Handle cases where the thrown value is not an Error object
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}

// DELETE a specific lead
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDB();
    const lead = await Lead.findById(params.id);

    if (!lead) {
      return NextResponse.json({ message: 'Lead not found' }, { status: 404 });
    }

    // A salesperson can only delete their own leads.
    if (session.user.role === 'salesperson' && lead.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Admins can also delete any lead.
    await Lead.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Lead deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    //   return NextResponse.json({ message: 'Error deleting lead', error: error.message }, { status: 500 });
      if (error instanceof Error) {
      console.error('Error deleting lead:', error.message);
      return NextResponse.json({ message: 'Error deleting lead', error: error.message }, { status: 400 });
    }
    
    // Handle cases where the thrown value is not an Error object
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}