import { describe, expect, it } from "vitest";
import { contrastRatio, createTheme, masterTheme, figmaVariables, themeToCss } from "../src/theme";

const v = (t: ReturnType<typeof createTheme>, k: string) => t.vars[`--cd-${k}` as keyof typeof t.vars];

describe("master theme", () => {
  const t = createTheme(masterTheme);
  it("reproduces the Figma variables exactly", () => {
    expect(v(t, "primary")).toBe("#F5EF0F");
    expect(v(t, "secondary")).toBe("#0E0E0E");
    expect(v(t, "bg").toLowerCase()).toBe(figmaVariables["bg-subtle"].toLowerCase());
    expect(v(t, "border").toLowerCase()).toBe("#e4e1d8");
    expect(v(t, "success").toLowerCase()).toBe("#177a45");
    expect(v(t, "danger").toLowerCase()).toBe("#b8340d");
    expect(v(t, "chart-highlight")).toBe("#F5C518");
    expect(v(t, "on-primary")).toBe("#0E0E0E");
  });
  it("produces no warnings", () => expect(t.warnings).toEqual([]));
});

describe("generated palettes", () => {
  const primaries = ["#0EA5E9", "#22C55E", "#2563EB", "#E11D48", "#F59E0B", "#7C3AED", "#111111", "#FFFFFF", "#FACC15"];
  for (const mode of ["light", "dark"] as const) {
    for (const primary of primaries) {
      it(`${mode} ${primary}: readable text on primary, secondary, accent and surface`, () => {
        const t = createTheme({ brandName: "X", primary, mode });
        expect(contrastRatio(v(t, "primary"), v(t, "on-primary"))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v(t, "secondary"), v(t, "on-secondary"))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v(t, "accent"), v(t, "on-accent"))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v(t, "surface"), v(t, "text"))).toBeGreaterThanOrEqual(7);
        expect(contrastRatio(v(t, "surface"), v(t, "text-secondary"))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v(t, "surface"), v(t, "primary-text"))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v(t, "surface"), v(t, "danger"))).toBeGreaterThanOrEqual(4.5);
        expect(contrastRatio(v(t, "surface"), v(t, "success"))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
  it("only changes brand/font/mode variables, never layout tokens", () => {
    const keys = Object.keys(createTheme({ brandName: "A", primary: "#0EA5E9" }).vars);
    expect(keys.some((k) => /radius|spacing|page|sidebar/.test(k))).toBe(false);
  });
  it("overrides win and css serialises", () => {
    const t = createTheme({ brandName: "A", primary: "#0EA5E9", overrides: { primary: "#123456" } });
    expect(v(t, "primary")).toBe("#123456");
    expect(themeToCss(t)).toContain("--cd-primary: #123456;");
  });
  it("warns when secondary is light", () => {
    expect(createTheme({ brandName: "A", primary: "#0EA5E9", secondary: "#EEEEEE" }).warnings.length).toBeGreaterThan(0);
  });
});
