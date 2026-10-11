import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; // npm install bcrypt

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { companyName, email, password } = req.body;

  try {
    // 1. Hash the password (using 10 salt rounds)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 2. Create the Tenant AND the User in a single transaction
    const tenant = await prisma.tenant.create({
      data: {
        companyName: companyName,
        users: {
          create: {
            email: email,
            passwordHash: passwordHash,
          }
        }
      },
      include: {
        users: true // Return the created user data
      }
    });

    res.status(200).json({ 
      message: 'Account created successfully',
      tenantId: tenant.id // This is the unique ID for the Momo shop!
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create account' });
  }
}