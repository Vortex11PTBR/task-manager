import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "@/auth";

// Resolve o erro "Cannot find name 'createTRPCContext'"
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  return {
    session,
    db: (await import("@/lib/db")).db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// ESTES EXPORTS SÃO OBRIGATÓRIOS para o task.ts funcionar
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Resolve o erro de tipagem "implicitly has an 'any' type" nos routers
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});