import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import UserDefault, { IUser } from '../../../../models/User';
import mongoose from 'mongoose';
import { createAuthToken } from '../../../../lib/auth';

const User = UserDefault as mongoose.Model<IUser>;

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const { name, email, password } = await request.json();

		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: 'Name, email, and password are required' },
				{ status: 400 }
			);
		}

		const existing = await User.findOne({ email });
		if (existing) {
			return NextResponse.json(
				{ message: 'Email already exists' },
				{ status: 409 }
			);
		}

		const user = await User.create({
			name,
			email,
			password,
			role: 'user',
			creditBalance: 0,
			settings: { notifications: true, autoRecharge: false, defaultTags: [] }
		});

		const token = createAuthToken(user._id.toString(), user.email, user.role);

		return NextResponse.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				creditBalance: user.creditBalance
			}
		});
	} catch (error: any) {
		console.error('Signup error:', error);
		return NextResponse.json(
			{ message: error.message || 'Server error' },
			{ status: 500 }
		);
	}
}
