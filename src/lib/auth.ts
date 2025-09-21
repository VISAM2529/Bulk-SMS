// lib/auth.ts
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

export function createAuthToken(userId: string, email: string, role: string) {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function verifyAuthToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function authenticateRequest(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const decoded = await verifyAuthToken(token);
  const user = await User.findById(decoded.userId).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}