import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { auth as firebaseAuth } from '@/lib/firebase-admin';
import { generateToken, setAuthCookie } from '@/lib/auth';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email not available from Google' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id, email, full_name, phone, avatar_url, auth_provider, role, is_active, created_at, firebase_uid FROM users WHERE email = ? OR firebase_uid = ?',
      [email, uid]
    );

    let user: User;

    if ((existingUsers as any[]).length === 0) {
      // Create new user with Google auth
      const [result] = await pool.execute(
        `INSERT INTO users (email, full_name, avatar_url, auth_provider, firebase_uid) 
         VALUES (?, ?, ?, 'google', ?)`,
        [email, name || 'Google User', picture || null, uid]
      );

      const userId = (result as any).insertId;
      
      const [newUsers] = await pool.execute(
        'SELECT id, email, full_name, phone, avatar_url, auth_provider, role, is_active, created_at FROM users WHERE id = ?',
        [userId]
      );

      user = (newUsers as User[])[0];
    } else {
      // Update existing user with Google info if needed
      user = (existingUsers as User[])[0];
      
      if (user.firebase_uid !== uid) {
        await pool.execute(
          'UPDATE users SET firebase_uid = ?, avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
          [uid, picture || null, user.id]
        );
      }
    }

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Generate token
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      message: 'Google sign-in successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url || picture,
        role: user.role,
      },
    });

    response.headers.set('Set-Cookie', setAuthCookie(token));
    
    return response;

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}