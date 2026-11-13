import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import { createTheme, type ClientTheme, type ResolvedTheme } from "./createTheme";

const ThemeContext = createContext<ResolvedTheme | null>(null);

export interface ThemeProviderProps {
  theme: ClientTheme;
  children: ReactNode;
  /** Render a wrapping element carrying the variables (default). Set false to apply nothing and only provide context. */
  scoped?: boolean;
  className?: string;
}

/**
 * Provides the resolved client theme and scopes its CSS variables to a wrapper element,
 * so several themes can coexist on one page (useful for previews).
 */
export function ThemeProvider({ theme, children, scoped = true, className }: ThemeProviderProps) {
  const resolved = useMemo(() => createTheme(theme), [theme]);
  if (!scoped) return <ThemeContext.Provider value={resolved}>{children}</ThemeContext.Provider>;
  return (
    <ThemeContext.Provider value={resolved}>
      <div
        className={["cd-root", className].filter(Boolean).join(" ")}
        data-cd-mode={resolved.mode}
        style={{ ...(resolved.vars as unknown as CSSProperties), colorScheme: resolved.mode }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useDashboardTheme(): ResolvedTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useDashboardTheme must be used inside <ThemeProvider>");
  return ctx;
}
