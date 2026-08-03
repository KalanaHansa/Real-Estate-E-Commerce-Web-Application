import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const districtId = request.nextUrl.searchParams.get('districtId');
    
    if (!districtId) {
      return NextResponse.json({ success: false, message: 'District ID required' }, { status: 400 });
    }

    const [cities] = await pool.execute(
      'SELECT id, name, code FROM cities WHERE district_id = ? ORDER BY name',
      [districtId]
    );
    
    return NextResponse.json({ success: true, cities });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch cities' }, { status: 500 });
  }
}