/**
 * Colour tokens mirrored from globals.css for use in JS (charts, canvas, SVG
 * fills). The CSS @theme block is the source of truth; keep these in sync.
 *
 * Palette from the official brand sheet (lime, forest green, black, two greys)
 * plus two derived neutrals.
 */
export const COLORS = {
  paper: "#ffffff",
  paper2: "#f4f4f4",
  ink: "#000000",
  ink2: "#5a5a5a",
  grey: "#a7a7a7",
  rule: "#dcdcdc",
  lime: "#d8ff32",
  limeDeep: "#c4ec1c",
  forest: "#09641f",
  alert: "#d43a2f",
} as const;
