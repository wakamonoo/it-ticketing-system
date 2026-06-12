import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password, departmentId } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already exist" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "END_USER",
        departmentId,
      },
    });

    const token = signToken(user.id);

    res.json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: "user not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(404).json({ error: "invalid credentials" });

    const token = signToken(user.id);

    res.json({ user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};
