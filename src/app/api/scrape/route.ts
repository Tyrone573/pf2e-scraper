export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { triggerScrapeAllTraits } from '../../../backend/api/traits';

export async function POST(req: NextRequest) {
  const result = await triggerScrapeAllTraits();
  return NextResponse.json(result);
}

export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
} 