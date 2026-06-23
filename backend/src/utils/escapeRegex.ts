// Escapes characters that have special meaning in regular expressions,
// so user input can be safely used inside a RegExp without enabling
// regex injection or catastrophic backtracking (ReDoS).
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}