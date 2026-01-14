// @ts-ignore
import "./globals.css";
import { TRPCProvider } from "@/trpc/TRPCProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Focus OS | Neural Command Center",
  description: "High-performance deep work system built with Next.js, tRPC and Prisma.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans min-h-screen antialiased selection:bg-blue-500/30 bg-white dark:bg-deep-blue transition-colors duration-500`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            {/* Efeito visual de malha/grid futurista */}
            <div className="fixed inset-0 bg-grid-white pointer-events-none opacity-[0.05] dark:opacity-20 z-0" />
            
            {/* Linha de Scanner Global */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] overflow-hidden">
              <div className="w-full h-0.5 bg-blue-500 animate-scan shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </div>

            {/* Conteúdo da aplicação */}
            <main className="relative z-10">
              {children}
            </main>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}