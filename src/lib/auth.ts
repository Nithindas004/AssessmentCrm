// src/lib/auth.ts

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/models/User';
import connectToDB from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('--- Authorize function started ---');

                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing credentials');
                    throw new Error('Invalid credentials');
                }

                try {
                    await connectToDB();

                    console.log(`Searching for user: ${credentials.email}`);
                    const user = await User.findOne({ email: credentials.email }).select('+password');

                    if (!user) {
                        console.log('User not found in database.');
                        throw new Error('Invalid credentials');
                    }
                    console.log('User found:', user.email);

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        console.log('Password comparison failed.');
                        throw new Error('Invalid credentials');
                    }

                    console.log('Password correct. Authentication successful!');

                    const { password, ...userWithoutPassword } = user.toObject();
                    console.log("userWithoutPassword", userWithoutPassword)
                    return userWithoutPassword;

                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id;
                token.role = user.role;
                token.name = user.fullName;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/',
        error: '/auth/error', // <-- This is the critical line for redirecting
    },
    secret: process.env.NEXTAUTH_SECRET,
};