import { describe, expect, test } from "vitest";
import { cardSide, clampCentre, clampPan, clusterMarkers, HOME_VIEW, inFilter, splitZoom, toBoxPx, toPercent, ZOOM, zoomAround } from "./map";
import { SG_BOUNDS } from "@/content/singapore-outline";

const BOX = { w: 1000, h: 600 };

describe("inFilter", () => {
  test("landed view shows landed jobs and home chargers", () => {
    expect(inFilter("landed", "landed")).toBe(true);
    expect(inFilter("ev", "landed")).toBe(true);
    expect(inFilter("commercial", "landed")).toBe(false);
  });

  test("commercial view shows commercial jobs only", () => {
    expect(inFilter("commercial", "commercial")).toBe(true);
    expect(inFilter("landed", "commercial")).toBe(false);
    expect(inFilter("ev", "commercial")).toBe(false);
  });
});

describe("cardSide", () => {
  test("opens right on the western half and left on the eastern half", () => {
    expect(cardSide(10)).toBe("right");
    expect(cardSide(55)).toBe("right");
    expect(cardSide(56)).toBe("left");
    expect(cardSide(95)).toBe("left");
  });
});

describe("toPercent", () => {
  test("maps the bounds corners to the edges of the box", () => {
    const nw = toPercent(SG_BOUNDS.maxLat, SG_BOUNDS.minLng);
    const se = toPercent(SG_BOUNDS.minLat, SG_BOUNDS.maxLng);
    expect(nw.x).toBeCloseTo(0);
    expect(nw.y).toBeCloseTo(0);
    expect(se.x).toBeCloseTo(100);
    expect(se.y).toBeCloseTo(100, 0);
  });

  test("puts Woodlands north-west of Katong", () => {
    const woodlands = toPercent(1.4382, 103.789);
    const katong = toPercent(1.304, 103.902);
    expect(woodlands.x).toBeLessThan(katong.x);
    expect(woodlands.y).toBeLessThan(katong.y);
  });
});

describe("toBoxPx", () => {
  test("the home view maps percent straight to box px", () => {
    expect(toBoxPx({ x: 25, y: 50 }, BOX, HOME_VIEW)).toEqual({ x: 250, y: 300 });
  });

  test("scale is about the centre and pan shifts the result", () => {
    expect(toBoxPx({ x: 25, y: 50 }, BOX, { z: 2, x: 0, y: 0 })).toEqual({ x: 0, y: 300 });
    expect(toBoxPx({ x: 25, y: 50 }, BOX, { z: 2, x: 100, y: -50 })).toEqual({ x: 100, y: 250 });
  });
});

describe("zoomAround", () => {
  test("keeps the anchor point fixed on screen", () => {
    const p = { x: 70, y: 30 };
    const before = toBoxPx(p, BOX, HOME_VIEW);
    const view = zoomAround(HOME_VIEW, p, 2.2, BOX);
    const after = toBoxPx(p, BOX, view);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
    expect(view.z).toBe(2.2);
  });

  test("clamps the zoom to the allowed range", () => {
    expect(zoomAround(HOME_VIEW, { x: 50, y: 50 }, 400, BOX).z).toBe(ZOOM.max);
    expect(zoomAround({ z: 3, x: 0, y: 0 }, { x: 50, y: 50 }, 0.2, BOX).z).toBe(ZOOM.min);
  });
});

describe("clampPan", () => {
  test("limits the pan to half the scaled box", () => {
    expect(clampPan({ z: 2, x: 5000, y: -5000 }, BOX)).toEqual({ z: 2, x: 1000, y: -600 });
    expect(clampPan({ z: 1, x: 10, y: 10 }, BOX)).toEqual({ z: 1, x: 10, y: 10 });
  });
});

describe("clusterMarkers", () => {
  const dots = [
    { id: "a", at: { x: 50, y: 50 } },
    { id: "b", at: { x: 51, y: 50 } }, // 10 px away at z = 1
    { id: "c", at: { x: 80, y: 20 } },
  ];

  test("merges dots that sit within the radius on screen", () => {
    const clusters = clusterMarkers(dots, BOX, HOME_VIEW);
    expect(clusters).toHaveLength(2);
    expect(clusters[0].items.map((i) => i.id)).toEqual(["a", "b"]);
    expect(clusters[0].at.x).toBeCloseTo(50.5);
    expect(clusters[1].items.map((i) => i.id)).toEqual(["c"]);
  });

  test("splits them again once the zoom spreads them past the radius", () => {
    const clusters = clusterMarkers(dots, BOX, { z: 4, x: 0, y: 0 });
    expect(clusters).toHaveLength(3);
  });

  test("keys are stable and describe the members", () => {
    expect(clusterMarkers(dots, BOX, HOME_VIEW)[0].key).toBe("a+b");
  });
});

describe("splitZoom", () => {
  const box = { w: 1000, h: 600 };
  test("returns the zoom that puts the closest pair a clear gap apart", () => {
    // 1% of a 1000 px box is 10 px apart; 30 px radius times 2.4 gap needs 72 px, so 7.2x.
    const z = splitZoom([{ at: { x: 50, y: 50 } }, { at: { x: 51, y: 50 } }, { at: { x: 60, y: 50 } }], box);
    expect(z).toBeCloseTo(7.2, 5);
  });
  test("after that zoom the cluster is apart", () => {
    const items = [{ id: "a", at: { x: 50, y: 50 } }, { id: "b", at: { x: 51, y: 50 } }];
    const z = splitZoom(items, box);
    expect(clusterMarkers(items, box, { z, x: 0, y: 0 })).toHaveLength(2);
  });
  test("never below 1 and capped at the maximum", () => {
    expect(splitZoom([{ at: { x: 10, y: 10 } }, { at: { x: 90, y: 90 } }], box)).toBe(ZOOM.min);
    expect(splitZoom([{ at: { x: 50, y: 50 } }, { at: { x: 50, y: 50 } }], box)).toBe(ZOOM.max);
    expect(splitZoom([{ at: { x: 50, y: 50 } }], box)).toBe(ZOOM.max);
  });
});

describe("clampCentre", () => {
  test("keeps a card inside the box", () => {
    expect(clampCentre({ x: 10, y: 590 }, { w: 1000, h: 600 }, { w: 160, h: 176 })).toEqual({ x: 160, y: 424 });
    expect(clampCentre({ x: 500, y: 300 }, { w: 1000, h: 600 }, { w: 160, h: 176 })).toEqual({ x: 500, y: 300 });
  });
  test("centres a card wider than the box", () => {
    expect(clampCentre({ x: 0, y: 0 }, { w: 200, h: 600 }, { w: 160, h: 10 }).x).toBe(100);
  });
});
