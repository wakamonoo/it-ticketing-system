import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTicket = async (req: any, res: any) => {
  try {
    const { title, description, ticketTypeId } = req.body;

    const userId = req.user.userId;

    const firstStep = await prisma.ticketPipeline.findFirst({
      where: {
        ticketTypeId,
      },
      orderBy: {
        order: "asc",
      },
    });

    if (!firstStep) {
      return res.status(400).json({
        error: "pipeline not found",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        ticketTypeId,
        createdById: userId,
        currentDepartmentId: firstStep.departmentId,
      },
    });

    await prisma.activityLog.create({
      data: {
        ticketId: ticket.id,
        userId,
        type: "CREATED",
        message: "ticket created",
      },
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const getMyTickets = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const tickets = await prisma.ticket.findMany({
      where: { createdById: userId },
      include: {
        ticketType: true,
        currentDepartment: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const getDepartmentTickets = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    if (!user.departmentId) {
      return res.status(404).json({ error: "user has no department" });
    }

    const departmentId = user.departmentId;

    const tickets = await prisma.ticket.findMany({
      where: {
        currentDepartmentId: departmentId,
      },
      include: {
        createdBy: true,
        assignedTo: true,
        ticketType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const unassigned = tickets.filter((t) => !t.assignedToId);
    const assigned = tickets.filter((t) => t.assignedToId);

    res.json({ unassigned, assigned });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const getTicketActivity = async (req: any, res: any) => {
  try {
    const ticketId = req.params.id;

    const activities = await prisma.activityLog.findMany({
      where: {
        ticketId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};



export const getTicketById = async (req: any, res: any) => {
  try {
    const ticketId = req.params.id;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        ticketType: true,
        createdBy: true,
        assignedTo: true,
        currentDepartment: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        error: "ticket not found",
      });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const assignTicket = async (req: any, res: any) => {
  try {
    const ticketId = req.params.id;
    const { assignedToId } = req.body;

    const userId = req.user.userId;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(400).json({ error: "ticket not found" });
    }

    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
      return res.status(400).json({
        error: "cannot assign completed tickets",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assignedToId,
        status: "IN_PROGRESS",
      },
    });

    await prisma.activityLog.create({
      data: {
        ticketId,
        userId,
        type: "ASSIGNED",
        message: `Assigned ticket to ${assignedToId}`,
      },
    });

    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const escalateTicket = async (req: any, res: any) => {
  try {
    const ticketId = req.params.id;

    const userId = req.user.userId;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({
        error: "ticket not found",
      });
    }

    if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
      return res.status(400).json({
        error: "cannot assign completed tickets",
      });
    }

    const nextStep = ticket.pipelineStep + 1;

    const nextPipeline = await prisma.ticketPipeline.findFirst({
      where: {
        ticketTypeId: ticket.ticketTypeId,
        order: nextStep,
      },
    });

    if (!nextPipeline) {
      return res.status(400).json({
        error: "no next department. resolve ticket instead.",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        pipelineStep: nextStep,
        currentDepartmentId: nextPipeline.departmentId,
        assignedToId: null,
        status: "ESCALATED",
      },
    });

    await prisma.activityLog.create({
      data: {
        ticketId,
        userId,
        type: "ESCALATED",
        message: `Escalated to pipeline step ${nextStep}`,
      },
    });

    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const resolveTicket = async (req: any, res: any) => {
  try {
    const ticketId = req.params.id;

    const userId = req.user.userId;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({
        error: "ticket not found",
      });
    }

    if (ticket.status === "CLOSED") {
      return res.status(400).json({ error: "ticket already closed" });
    }

    if (ticket.status === "RESOLVED") {
      return res.status(400).json({ error: "ticket already resolved" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        ticketId,
        userId,
        type: "STATUS_CHANGED",
        message: "Ticket resolved",
      },
    });

    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const closeTicket = async (req: any, res: any) => {
  try {
    const ticketId = req.params.id;

    const userId = req.user.userId;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({
        error: "ticket not found",
      });
    }

    if (ticket.status !== "RESOLVED") {
      return res
        .status(400)
        .json({ error: "ticket must be resolved before closing" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        ticketId,
        userId,
        type: "STATUS_CHANGED",
        message: "Ticket closed",
      },
    });

    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};
