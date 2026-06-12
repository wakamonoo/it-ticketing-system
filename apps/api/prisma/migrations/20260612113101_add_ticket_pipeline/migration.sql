-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "pipelineStep" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "TicketPipeline" (
    "id" TEXT NOT NULL,
    "ticketTypeId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "TicketPipeline_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketPipeline" ADD CONSTRAINT "TicketPipeline_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPipeline" ADD CONSTRAINT "TicketPipeline_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
