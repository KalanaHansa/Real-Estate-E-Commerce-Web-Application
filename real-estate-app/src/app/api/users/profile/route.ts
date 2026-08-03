import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { verifyToken, hashPassword } from '@/lib/auth';

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

    const [users] = await pool.execute(
      'SELECT id, email, full_name, phone, avatar_url, auth_provider, role, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    const user = (users as any[])[0];
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const { full_name, phone, avatar_url, current_password, new_password } = await request.json();

    // Update basic info
    await pool.execute(
      'UPDATE users SET full_name = ?, phone = ?, avatar_url = ? WHERE id = ?',
      [full_name, phone || null, avatar_url || null, decoded.id]
    );

    // Update password if provided
    if (new_password && current_password) {
      const [users] = await pool.execute('SELECT password_hash FROM users WHERE id = ?', [decoded.id]);
      const user = (users as any[])[0];
      
      if (!user?.password_hash) {
        return NextResponse.json({ success: false, message: 'Cannot update password for Google auth users' }, { status: 400 });
      }

      const bcrypt = require('bcryptjs');
      const valid = await bcrypt.compare(current_password, user.password_hash);
      if (!valid) {
        return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await hashPassword(new_password);
      await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, decoded.id]);
    }

    const [updatedUsers] = await pool.execute(
      'SELECT id, email, full_name, phone, avatar_url, role FROM users WHERE id = ?',
      [decoded.id]
    );

    return NextResponse.json({ success: true, user: (updatedUsers as any[])[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}