import { NextRequest, NextResponse } from 'next/server';
import { supabase, Trait } from '../../../backend/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  const { data: traits, error, count } = await supabase
    .from('traits')
    .select('*', { count: 'exact' })
    .order('name')
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return NextResponse.json({
    traits: traits as Trait[],
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore,
    },
  });
}

export function POST() {
  return new NextResponse('Method Not Allowed', { status: 405 });
} 