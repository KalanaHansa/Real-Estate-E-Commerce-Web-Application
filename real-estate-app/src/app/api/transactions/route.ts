import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type'); // 'buy', 'rent', 'sell', or null for all
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query based on filters
    let sql = `
      SELECT 
        t.*,
        p.title as property_title,
        p.property_type as property_listing_type,
        p.images as property_images,
        buyer.full_name as buyer_name,
        seller.full_name as seller_name
      FROM transactions t
      JOIN properties p ON t.property_id = p.id
      JOIN users buyer ON t.buyer_id = buyer.id
      JOIN users seller ON t.seller_id = seller.id
      WHERE (t.buyer_id = ? OR t.seller_id = ?)
    `;
    
    const params: any[] = [decoded.id, decoded.id];

    if (type) {
      sql += ' AND t.transaction_type = ?';
      params.push(type);
    }
    
    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }

    // Count total
    const countSql = sql.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM');
    const [countResult] = await pool.execute(countSql, params);
    const total = (countResult as any[])[0].total;

    sql += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [transactions] = await pool.execute(sql, params);

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Transactions error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}