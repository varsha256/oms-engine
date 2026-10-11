import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // npm install jsonwebtoken

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET; // Add a long random string to your .env

export default async function handle(req, res) {
  const { email, password } = req.body;

  try {
    // 1. Find the user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // 2. Verify the password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // 3. Generate a token containing the tenantId
    const token = jwt.sign(
      { 
        userId: user.id, 
        tenantId: user.tenantId // Inject the tenant ID into the token
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, tenantId: user.tenantId });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}