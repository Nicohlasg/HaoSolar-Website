import { describe, expect, test } from "vitest";
import { cueAt } from "./hero";

const CUES = [
  { at: 0, projectId: "a" },
  { at: 4, projectId: "b" },
  { at: 9.5, projectId: "c" },
];

describe("cueAt", () => {
  test("returns null with no cues or before the first one", () => {
    expect(cueAt([], 3)).toBeNull();
    expect(cueAt([{ at: 2, projectId: "a" }], 1)).toBeNull();
  });

  test("returns the cue that started most recently", () => {
    expect(cueAt(CUES, 0)).toBe("a");
    expect(cueAt(CUES, 3.99)).toBe("a");
    expect(cueAt(CUES, 4)).toBe("b");
    expect(cueAt(CUES, 9.4)).toBe("b");
    expect(cueAt(CUES, 9.5)).toBe("c");
  });

  test("holds the last cue after the reel loops past it", () => {
    expect(cueAt(CUES, 60)).toBe("c");
  });
});
