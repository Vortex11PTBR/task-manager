-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "doDate" TIMESTAMP(3),
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrenceRule" TEXT,
ADD COLUMN     "reminders" JSONB,
ADD COLUMN     "startDate" TIMESTAMP(3);
