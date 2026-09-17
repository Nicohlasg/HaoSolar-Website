import { describe, expect, test } from "vitest";
import { dotCentre, isReached, type Stop } from "./timeline";

const stop: Stop = { from: 20, to: 180 };

describe("dotCentre", () => {
  test("waits at its step until the bead arrives", () => {
    expect(dotCentre(0, stop)).toBe(20);
    expect(dotCentre(19, stop)).toBe(20);
  });

  test("rides with the bead while the title is stuck", () => {
    expect(dotCentre(100, stop)).toBe(100);
  });

  test("stays behind once the title scrolls away", () => {
    expect(dotCentre(400, stop)).toBe(180);
  });
});

describe("isReached", () => {
  test("is false above the step and true from its centre on", () => {
    expect(isReached(19.9, stop)).toBe(false);
    expect(isReached(20, stop)).toBe(true);
    expect(isReached(900, stop)).toBe(true);
  });
});
