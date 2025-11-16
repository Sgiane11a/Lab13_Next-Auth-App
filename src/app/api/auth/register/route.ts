import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { users, User } from '@/lib/users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, message: 'Missing name, email, or password' },
        { status: 400 }
      );
    }

    const exist = users.find((user) => user.email === email);
    if (exist) {
      return NextResponse.json(
        { ok: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      hashedPassword,
    };

    users.push(newUser);

    console.log('Usuario registrado:', newUser);

    return NextResponse.json(
      { ok: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('REGISTRATION_ERROR', error);
    return NextResponse.json(
      { ok: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
