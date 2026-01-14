import { handlers } from "@/auth";

// Em vez de export const { GET, POST } = handlers;
// Tente exportar desta forma mais explícita para o Turbopack:
export const GET = handlers.GET;
export const POST = handlers.POST;