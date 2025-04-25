export const hexToRgba = (hex: string, overrideAlpha?: number): string => {
  const value = hex.replace(/^#/, "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const a =
    overrideAlpha !== undefined ? overrideAlpha : value.length === 8 ? parseInt(value.slice(6, 8), 16) / 255 : 1;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
