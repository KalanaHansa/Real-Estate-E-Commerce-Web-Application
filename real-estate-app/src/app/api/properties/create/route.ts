import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    const {
      title,
      description,
      property_type,
      price,
      bedrooms,
      bathrooms,
      area_sqft,
      address,
      province_id,
      district_id,
      city_id,
    } = body;

    // Validation
    if (!title || !description || !price || !address || !province_id || !district_id || !city_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `INSERT INTO properties (
        title, description, property_type, price, bedrooms, bathrooms,
        area_sqft, address, province_id, district_id, city_id, owner_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [
        title,
        description,
        property_type,
        price,
        bedrooms || null,
        bathrooms || null,
        area_sqft || null,
        address,
        province_id,
        district_id,
        city_id,
        decoded.id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Property listed successfully',
      propertyId: (result as any).insertId,
    });

  } catch (error) {
    console.error('Create property error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create property' },
      { status: 500 }
    );
  }
}