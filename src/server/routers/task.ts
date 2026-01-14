import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/lib/db";

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    return await db.task.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        completed: true,
        dueDate: true,
        startDate: true,
        doDate: true,
        isRecurring: true,
        recurrenceRule: true,
        reminders: true,
        focusSessions: true,
        totalMinutes: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  getOccurrences: protectedProcedure
    .input(
      z.object({ start: z.date(), end: z.date() })
    )
    .query(async ({ input, ctx }) => {
      // Expand this user's tasks into occurrences within the range
      const tasks = await db.task.findMany({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
          title: true,
          dueDate: true,
          doDate: true,
          isRecurring: true,
          recurrenceRule: true,
          category: true,
          totalMinutes: true,
        },
      });

      const { expandTasksForRange } = await import("@/lib/recurrence");

      const occ = expandTasksForRange(
        tasks as any,
        input.start,
        input.end
      );

      return occ;
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const tasks = await db.task.findMany({
      where: { userId: ctx.session.user.id },
      select: { totalMinutes: true, focusSessions: true, completed: true },
    });

    return tasks.reduce(
      (acc, task) => {
        acc.totalTime += task.totalMinutes;
        acc.totalSessions += task.focusSessions;
        if (task.completed) acc.completedTasks += 1;
        acc.totalTasks += 1;
        return acc;
      },
      { totalTime: 0, totalSessions: 0, completedTasks: 0, totalTasks: 0 }
    );
  }),

  getTasksByDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ input, ctx }) => {
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      // Return tasks that have dueDate within the day
      return await db.task.findMany({
        where: {
          userId: ctx.session.user.id,
          dueDate: { gte: startOfDay, lte: endOfDay },
        },
        orderBy: { createdAt: "asc" },
      });
    }),

  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        dueDate: z.date().optional(),
        startDate: z.date().optional(),
        doDate: z.date().optional(),
        isRecurring: z.boolean().optional(),
        recurrenceRule: z.string().optional(),
        reminders: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await db.task.create({
        data: {
          title: input.title,
          description: input.description,
          category: input.category || "Geral",
          dueDate: input.dueDate,
          startDate: input.startDate,
          doDate: input.doDate,
          isRecurring: input.isRecurring ?? false,
          recurrenceRule: input.recurrenceRule,
          reminders: input.reminders ? input.reminders as any : undefined,
          userId: ctx.session.user.id as string,
        },
      });
    }),

  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        completed: z.boolean().optional(),
        dueDate: z.date().nullable().optional(),
        startDate: z.date().nullable().optional(),
        doDate: z.date().nullable().optional(),
        isRecurring: z.boolean().optional(),
        recurrenceRule: z.string().optional(),
        reminders: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await db.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
          completed: input.completed,
          dueDate: input.dueDate ?? undefined,
          startDate: input.startDate ?? undefined,
          doDate: input.doDate ?? undefined,
          isRecurring: input.isRecurring,
          recurrenceRule: input.recurrenceRule,
          reminders: input.reminders ? input.reminders as any : undefined,
        },
      });
    }),
});