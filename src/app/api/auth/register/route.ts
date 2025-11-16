import { NextResponse } from 'next/server';
import { createUser } from '@/lib/users';

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

    const result = await createUser({ name, email, password });
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true, user: result.user }, { status: 201 });
  } catch (error) {
    console.error('REGISTRATION_ERROR', error);
    return NextResponse.json(
      { ok: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
