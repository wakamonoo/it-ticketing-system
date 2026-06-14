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
    where: { name: "Infrastructure" },
    update: {},
    create: { name: "Infrastructure" },
  });

  //---- USERS ----//
  const password = await bcrypt.hash("123456", 10);

  const help1 = await prisma.user.upsert({
    where: { email: "help1@it.com" },
    update: {},
    create: {
      name: "Help Desk User 1",
      email: "help1@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: helpdesk.id,
    },
  });

  const help2 = await prisma.user.upsert({
    where: { email: "help2@it.com" },
    update: {},
    create: {
      name: "Help Desk User 2",
      email: "help2@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: helpdesk.id,
    },
  });

  const tier21 = await prisma.user.upsert({
    where: { email: "tier21@it.com" },
    update: {},
    create: {
      name: "Tier 2 User 1",
      email: "tier21@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: tier2.id,
    },
  });

  const tier22 = await prisma.user.upsert({
    where: { email: "tier22@it.com" },
    update: {},
    create: {
      name: "Tier 2 User 2",
      email: "tier22@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: tier2.id,
    },
  });

  const infra1 = await prisma.user.upsert({
    where: { email: "infra1@it.com" },
    update: {},
    create: {
      name: "Infrastructure User 1",
      email: "infra1@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: infra.id,
    },
  });

  const infra2 = await prisma.user.upsert({
    where: { email: "infra2@it.com" },
    update: {},
    create: {
      name: "Infrastructure User 2",
      email: "infra2@it.com",
      password,
      role: "DEPARTMENT_MEMBER",
      departmentId: infra.id,
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: "employee@it.com" },
    update: {},
    create: {
      name: "Joven Employee",
      email: "employee@it.com",
      password,
      role: "END_USER",
      departmentId: helpdesk.id,
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

  const network = await prisma.ticketType.upsert({
    where: { name: "Network Issue" },
    update: {},
    create: {
      name: "Network Issue",
      description: "network and connectivity issues",
    },
  });

  //---- PIPELINE ORDERED FLOW ----//
  await prisma.ticketPipeline.deleteMany();

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

      // network pipeline
      {
        ticketTypeId: network.id,
        departmentId: helpdesk.id,
        order: 1,
      },
      {
        ticketTypeId: network.id,
        departmentId: infra.id,
        order: 2,
      },
    ],
  });

  //---- SAMPLE TICKETS ----//
  const openTicket = await prisma.ticket.create({
    data: {
      title: "Mouse not working",
      description: "Usb mouse stopped responding",
      ticketTypeId: hardware.id,
      createdById: employee.id,
      currentDepartmentId: helpdesk.id,
      status: "OPEN",
    },
  });

  const inProgressTicket = await prisma.ticket.create({
    data: {
      title: "Outlook cannot send email",
      description: "Email stuck in outbox",
      ticketTypeId: software.id,
      createdById: employee.id,
      assignedToId: help1.id,
      currentDepartmentId: helpdesk.id,
      status: "IN_PROGRESS",
    },
  });

  const escalatedTicket = await prisma.ticket.create({
    data: {
      title: "VPN Connection Issue",
      description: "Unable to connect to company VPN",
      ticketTypeId: network.id,
      createdById: employee.id,
      currentDepartmentId: infra.id,
      pipelineStep: 2,
      status: "ESCALATED",
    },
  });

  const resolvedTicket = await prisma.ticket.create({
    data: {
      title: "Laptop Battery Problem",
      description: "Battery replaced succesfully",
      ticketTypeId: hardware.id,
      createdById: employee.id,
      assignedToId: infra1.id,
      currentDepartmentId: infra.id,
      status: "RESOLVED",
      resolvedAt: new Date(),
    },
  });

  const closedTicket = await prisma.ticket.create({
    data: {
      title: "Printer Setup",
      description: "Printer configure succesfully",
      ticketTypeId: software.id,
      createdById: employee.id,
      assignedToId: tier21.id,
      currentDepartmentId: tier2.id,
      status: "CLOSED",
      resolvedAt: new Date(),
      closedAt: new Date(),
    },
  });

  //---- ACTIVITY LOGS ----//
  await prisma.activityLog.createMany({
    data: [
      {
        ticketId: openTicket.id,
        userId: employee.id,
        type: "CREATED",
        message: "Ticket created",
      },
      {
        ticketId: inProgressTicket.id,
        userId: help1.id,
        type: "ASSIGNED",
        message: "Assigned to Help Desk User 1",
      },
      {
        ticketId: escalatedTicket.id,
        userId: help2.id,
        type: "ESCALATED",
        message: "Escalated to Infrastructure",
      },
      {
        ticketId: resolvedTicket.id,
        userId: infra1.id,
        type: "STATUS_CHANGED",
        message: "Ticket resolved",
      },
      {
        ticketId: closedTicket.id,
        userId: tier21.id,
        type: "STATUS_CHANGED",
        message: "Ticket closed",
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
