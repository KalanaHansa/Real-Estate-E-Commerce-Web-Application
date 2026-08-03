import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    
    const type = searchParams.get('type') || 'sale';
    const provinceId = searchParams.get('provinceId');
    const districtId = searchParams.get('districtId');
    const cityId = searchParams.get('cityId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit') || '20');
    const recent = searchParams.get('recent') === 'true';

    let sql = `
      SELECT 
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
      WHERE p.property_type = ? AND p.status = 'available'
    `;
    
    const params: any[] = [type];

    if (provinceId) {
      sql += ' AND p.province_id = ?';
      params.push(provinceId);
    }
    if (districtId) {
      sql += ' AND p.district_id = ?';
      params.push(districtId);
    }
    if (cityId) {
      sql += ' AND p.city_id = ?';
      params.push(cityId);
    }
    if (minPrice) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    sql += recent ? ' ORDER BY p.created_at DESC' : ' ORDER BY p.is_featured DESC, p.created_at DESC';
    sql += ' LIMIT ?';
    params.push(limit);

    const [properties] = await pool.execute(sql, params);

    return NextResponse.json({ success: true, properties });
  } catch (error: any) {
    console.error('Properties fetch error:', {
      message: error?.message,
      code: error?.code,
      sqlMessage: error?.sqlMessage,
      sql: error?.sql,
    });
    return NextResponse.json({ success: false, message: 'Failed to fetch properties' }, { status: 500 });
  }
}