import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const provinceId = request.nextUrl.searchParams.get('provinceId');
    
    if (!provinceId) {
      return NextResponse.json({ success: false, message: 'Province ID required' }, { status: 400 });
    }

    const [districts] = await pool.execute(
      'SELECT id, name, code FROM districts WHERE province_id = ? ORDER BY name',
      [provinceId]
    );
    
    return NextResponse.json({ success: true, districts });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch districts' }, { status: 500 });
  }
}