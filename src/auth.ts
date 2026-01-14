import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs"; // Importante para segurança

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "Tactical Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca o usuário no banco de dados
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Se o usuário não existir ou não tiver senha (ex: registro incompleto)
        if (!user || !user.password) return null;

        // Verifica se a senha fornecida bate com a senha criptografada no banco
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) return user;
        
        return null;
      },
    }),
  ],
  // CONFIGURAÇÃO DE PÁGINAS CUSTOMIZADAS
  pages: {
    signIn: "/auth/signin", // Nossa tela Cyber-Tactical
    newUser: "/auth/register",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});