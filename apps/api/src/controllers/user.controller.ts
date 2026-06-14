import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMe = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    res.json(currentUser);
  } catch (err) {
    console.error(err);
    res.status(200).json({
      error: "server error",
    });
  }
};

export const getDepartmentUsers = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser?.departmentId) {
      return res.status(400).json({
        error: "user has no department",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        departmentId: currentUser.departmentId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(200).json({
      error: "server error",
    });
  }
};
