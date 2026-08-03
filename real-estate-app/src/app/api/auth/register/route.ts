import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, phone } = await request.json();

    // Validation
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { success: false, message: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    
    const [result] = await pool.execute(
      `INSERT INTO users (email, password_hash, full_name, phone, auth_provider) 
       VALUES (?, ?, ?, ?, 'local')`,
      [email, passwordHash, full_name, phone || null]
    );

    const userId = (result as any).insertId;

    // Fetch created user
    const [users] = await pool.execute(
      'SELECT id, email, full_name, phone, avatar_url, auth_provider, role, is_active, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as User[])[0];

    // Generate token
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });

    response.headers.set('Set-Cookie', setAuthCookie(token));
    
    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}