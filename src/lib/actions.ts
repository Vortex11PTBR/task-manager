"use server"

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Initializes a new objective tied to the authenticated user.
 */
export async function createTask(formData: FormData) {
  const session = await auth();
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const dueDateRaw = formData.get("dueDate") as string | null;
  const dueDate = dueDateRaw ? new Date(dueDateRaw + "T00:00:00") : undefined;
  const startDateRaw = formData.get("startDate") as string | null;
  const startDate = startDateRaw ? new Date(startDateRaw) : undefined;
  const doDateRaw = formData.get("doDate") as string | null;
  const doDate = doDateRaw ? new Date(doDateRaw) : undefined;
  const recurrenceRaw = formData.get("recurrence") as string | null;
  const recurrenceRuleRaw = formData.get("recurrenceRule") as string | null;
  const remindersRaw = formData.get("reminders") as string | null; // comma-separated minutes or ISO datetimes
  const reminders = remindersRaw ? remindersRaw.split(",").map(s => s.trim()).filter(Boolean) : undefined;

  if (!session?.user?.id || !title) return;

  try {
    // map simple recurrence choices to RRULE strings
    let recurrenceRule = recurrenceRuleRaw || undefined;
    let isRecurring = false;
    if (recurrenceRaw && recurrenceRaw !== "none") {
      isRecurring = true;
      if (!recurrenceRule) {
        if (recurrenceRaw === "daily") recurrenceRule = "RRULE:FREQ=DAILY";
        if (recurrenceRaw === "weekly") recurrenceRule = "RRULE:FREQ=WEEKLY";
        if (recurrenceRaw === "monthly") recurrenceRule = "RRULE:FREQ=MONTHLY";
      }
    }

    await db.task.create({
      data: {
        title,
        category: category || "General",
        dueDate: dueDate,
        startDate: startDate,
        doDate: doDate,
        isRecurring: isRecurring,
        recurrenceRule: recurrenceRule,
        reminders: reminders as any,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("FAILED_TO_INITIALIZE_OBJECTIVE:", error);
  }
}

/**
 * Toggles the operational status of a specific objective.
 */
export async function toggleTaskStatus(id: string, currentStatus: boolean) {
  try {
    await db.task.update({
      where: { id },
      data: { completed: !currentStatus },
    });
    
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("FAILED_TO_TOGGLE_STATUS:", error);
  }
}

/**
 * Permanently purges an objective from the database.
 */
export async function deleteTask(id: string) {
  try {
    await db.task.delete({
      where: { id },
    });
    
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("FAILED_TO_PURGE_DATA:", error);
  }
}