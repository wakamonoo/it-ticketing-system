import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDepartments = async (req: any, res: any) => {
  try {
    const departments = await prisma.department.findMany();

    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};
