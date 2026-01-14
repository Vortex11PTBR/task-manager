import { auth } from "@/auth";

// O Next.js 16 exige que o export se chame 'proxy' ou seja o 'default'
export default auth;

export const config = {
  // Mantemos o matcher para proteger as rotas desejadas
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};