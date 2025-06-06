import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../backend/lib/supabase';

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
  }
  const { data, error } = await supabase
    .from('traits')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('name');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
} 