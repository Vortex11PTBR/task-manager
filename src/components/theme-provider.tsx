"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Usamos ComponentProps para extrair as tipagens diretamente do componente pai
// Isso resolve o erro de "module not found" nas tipagens internas do next-themes
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}