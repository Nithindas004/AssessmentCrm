// src/app/api/leads/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDB from '@/lib/db';
import Lead from '@/models/Lead';
import User from '@/models/User';


interface LeadQuery {
  createdBy?: string;
  status?: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: 'i' } }>;
}

// GET all leads (filtered by role)
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const searchQuery = searchParams.get('query');

  const query: LeadQuery = {};

  // If user is a salesperson, only show leads they created.
  if (session.user.role === 'salesperson') {
    query.createdBy = session.user.id;
  }

  if (status) {
    query.status = status;
  }
  
  if (searchQuery) {
    query.$or = [
      { fullName: { $regex: searchQuery, $options: 'i' } },
      { email: { $regex: searchQuery, $options: 'i' } },
      { phone: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  try {
    await connectToDB();
    const leads = await Lead.find(query)
      .populate({ path: 'createdBy', model: User, select: 'fullName' })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      leads,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

// POST a new lead
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  console.log("session", session)

  try {
    const body = await request.json();
    await connectToDB();

    // Automatically assign the logged-in user as the creator
    const newLead = await Lead.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error: unknown) {
    // console.error('Error creating lead:', error);
    // return NextResponse.json({ message: 'Error creating lead', error: error.message }, { status: 400 });
    if (error instanceof Error) {
      console.error('Error creating lead:', error.message);
      return NextResponse.json({ message: 'Error creating lead', error: error.message }, { status: 400 });
    }
    
    // Handle cases where the thrown value is not an Error object
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}