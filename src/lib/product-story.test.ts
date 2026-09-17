import { describe, expect, test } from "vitest";
import { detailWindow, glideAt, HOTSPOTS_FROM, rotationAt, sideFor, SPIN_END } from "./product-story";

describe("rotationAt", () => {
  test("turns a full circle by the end of the spin, then holds", () => {
    expect(rotationAt(0)).toBe(0);
    expect(rotationAt(SPIN_END / 2)).toBe(180);
    expect(rotationAt(SPIN_END)).toBe(360);
    expect(rotationAt(1)).toBe(360);
  });

  test("never goes negative before the stage starts", () => {
    expect(rotationAt(-0.3)).toBe(0);
  });
});

describe("glideAt", () => {
  test("tracks the spin and clamps at one", () => {
    expect(glideAt(0)).toBe(0);
    expect(glideAt(SPIN_END)).toBe(1);
    expect(glideAt(0.9)).toBe(1);
  });
});

describe("sideFor", () => {
  test("alternates starting on the right", () => {
    expect(sideFor(0)).toBe("right");
    expect(sideFor(1)).toBe("left");
    expect(sideFor(2)).toBe("right");
  });
});

describe("detailWindow", () => {
  test("lands lines in order and finishes before the hotspots settle", () => {
    const a = detailWindow(0, 4);
    const b = detailWindow(1, 4);
    const last = detailWindow(3, 4);
    expect(b[0]).toBeGreaterThan(a[0]);
    expect(a[1]).toBeGreaterThan(a[0]);
    expect(last[1]).toBeLessThanOrEqual(SPIN_END + 0.05);
    expect(a[0]).toBeGreaterThan(0);
  });

  test("hotspots wake after the last detail has started", () => {
    expect(HOTSPOTS_FROM).toBeGreaterThan(detailWindow(3, 4)[0]);
  });
});
