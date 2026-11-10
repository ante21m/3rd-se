import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { validateRegistration } from '@/lib/validation';
import { createUser, findUserByEmail } from '@/lib/db';

export async function POST(request) {
  // 1. Read the JSON body safely
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  // 2. Validate on the server (never trust the browser)
  const { valid, errors, clean } = validateRegistration(body);
  if (!valid) {
    return NextResponse.json({ message: 'Validation failed.', errors }, { status: 400 });
  }

  // 3. Make sure the email is not already used
  if (await findUserByEmail(clean.email)) {
    return NextResponse.json(
      { message: 'Validation failed.', errors: { email: 'This email is already registered.' } },
      { status: 409 }
    );
  }

  // 4. Hash the password - NEVER store plain-text passwords
  const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
  const passwordHash = await bcrypt.hash(clean.password, rounds);

  // 5. Save the user
  try {
    const user = await createUser({ name: clean.name, email: clean.email, passwordHash });
    // 6. Return only safe fields - never the hash
    return NextResponse.json(
      { message: 'Registration successful!', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === 'DUPLICATE_EMAIL') {
      return NextResponse.json(
        { message: 'Validation failed.', errors: { email: 'This email is already registered.' } },
        { status: 409 }
      );
    }
    console.error('Registration error:', err);
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
