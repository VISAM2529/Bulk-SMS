// app/api/contacts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import { authenticateRequest } from '../../../lib/auth';
import Contact from '../../../models/Contact';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');
    const groupId = searchParams.get('group');
    
    const skip = (page - 1) * limit;
    const filter: any = { userId: user._id, isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (groupId) {
      filter.groups = groupId;
    }

    const contacts = await Contact.find(filter)
      .populate('groups')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);

    return NextResponse.json({
      contacts,
      total,
      pages: Math.ceil(total / limit)
    });

  } catch (error: any) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(request);
    
    const body = await request.json();
    const { name, phoneNumber, groups, tags } = body;

    if (!name || !phoneNumber) {
      return NextResponse.json(
        { message: 'Name and phone number are required' },
        { status: 400 }
      );
    }

    // Check if contact already exists
    const existingContact = await Contact.findOne({
      userId: user._id,
      phoneNumber
    });

    if (existingContact) {
      return NextResponse.json(
        { message: 'Contact with this phone number already exists' },
        { status: 400 }
      );
    }

    const contact = new Contact({
      userId: user._id,
      name,
      phoneNumber,
      groups: groups || [],
      tags: tags || []
    });

    await contact.save();
    await contact.populate('groups');

    return NextResponse.json(contact, { status: 201 });

  } catch (error: any) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}