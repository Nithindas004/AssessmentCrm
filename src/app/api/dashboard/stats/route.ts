// src/app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectToDB();

    const total = Lead.countDocuments();
    const inProgress = Lead.countDocuments({ status: 'In Progress' });
    const won = Lead.countDocuments({ status: 'Won' });
    const lost = Lead.countDocuments({ status: 'Lost' });

    const [totalLeads, inProgressLeads, wonLeads, lostLeads] = await Promise.all([
      total,
      inProgress,
      won,
      lost,
    ]);

    return NextResponse.json({
      total: totalLeads,
      inProgress: inProgressLeads,
      won: wonLeads,
      lost: lostLeads,
    });
  } catch (error) {
      console.error("Error fetching stats:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}