import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [provinces] = await pool.execute('SELECT id, name, code FROM provinces ORDER BY name');
    return NextResponse.json({ success: true, provinces });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch provinces' }, { status: 500 });
  }
}