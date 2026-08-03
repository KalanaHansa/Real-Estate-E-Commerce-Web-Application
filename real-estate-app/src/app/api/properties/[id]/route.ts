import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);

    if (isNaN(propertyId)) {
      return NextResponse.json({ success: false, message: 'Invalid property ID' }, { status: 400 });
    }

    const [rows] = await pool.execute(
      `SELECT 
        p.*,
        pr.name as province_name,
        d.name as district_name,
        c.name as city_name,
        u.full_name as owner_name
      FROM properties p
      JOIN provinces pr ON p.province_id = pr.id
      JOIN districts d ON p.district_id = d.id
      JOIN cities c ON p.city_id = c.id
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?`,
      [propertyId]
    ) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
    }

    // Increment view count (fire-and-forget)
    pool.execute('UPDATE properties SET view_count = view_count + 1 WHERE id = ?', [propertyId]).catch(() => {});

    return NextResponse.json({ success: true, property: rows[0] });
  } catch (error) {
    console.error('Property detail fetch error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch property' }, { status: 500 });
  }
}
