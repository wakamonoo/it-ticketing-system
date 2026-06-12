import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("seed working");

  //---- DEPARTMENTS ----//
  const helpdesk = await prisma.department.upsert({
    where: { name: "Help Desk" },
    update: {},
    create: { name: "Help Desk" },
  });

  const tier2 = await prisma.department.upsert({
    where: { name: "Tier 2 Support" },
    update: {},
    create: { name: "Tier 2 Support" },
  });

  const infra = await prisma.department.upsert({
    where: { name: "Infrastracture" },
    update: {},
    create: { name: "Infrastracture" },
  });

  //---- USERS ----//
  const password = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "help@it.com" },
    update: {},
    create: {
      name: "Help Desk User",
      email: "help@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: helpdesk.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "tier2@it.com" },
    update: {},
    create: {
      name: "Tier 2 User",
      email: "tier2@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: tier2.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "infra@it.com" },
    update: {},
    create: {
      name: "Infrastracture User",
      email: "infra@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: infra.id,
    },
  });

  //---- TICKET TYPES ----//
  const hardware = await prisma.ticketType.upsert({
    where: { name: "Hardware Issue" },
    update: {},
    create: {
      name: "Hardware Issue",
      description: "problems related to physical devices",
    },
  });

  const software = await prisma.ticketType.upsert({
    where: { name: "Software Issue" },
    update: {},
    create: {
      name: "Software Issue",
      description: "problems related to applications",
    },
  });

  //---- PIPELINE ORDERED FLOW ----//
  await prisma.ticketPipeline.createMany({
    data: [
      // hardware pipeline
      {
        ticketTypeId: hardware.id,
        departmentId: helpdesk.id,
        order: 1,
      },
      {
        ticketTypeId: hardware.id,
        departmentId: tier2.id,
        order: 2,
      },
      {
        ticketTypeId: hardware.id,
        departmentId: infra.id,
        order: 3,
      },

      // software pipeline
      {
        ticketTypeId: software.id,
        departmentId: helpdesk.id,
        order: 1,
      },
      {
        ticketTypeId: software.id,
        departmentId: tier2.id,
        order: 2,
      },
    ],
  });

  console.log("seeding completed");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
