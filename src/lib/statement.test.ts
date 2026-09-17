import { describe, expect, test } from "vitest";
import { CHAPTERS, chapterAt, panelWindow, promiseWindow, CTA_WINDOW } from "./statement";

describe("CHAPTERS", () => {
  test("cover the whole scroll without gaps and end in a hold", () => {
    expect(CHAPTERS[0].from).toBe(0);
    for (let i = 1; i < CHAPTERS.length; i++) expect(CHAPTERS[i].from).toBe(CHAPTERS[i - 1].to);
    expect(CHAPTERS[CHAPTERS.length - 1]).toMatchObject({ id: "hold", to: 1 });
  });

  test("hold keeps at least a fifth of the scroll", () => {
    const hold = CHAPTERS[CHAPTERS.length - 1];
    expect(hold.to - hold.from).toBeCloseTo(0.2, 5);
  });
});

describe("chapterAt", () => {
  test("maps the start of the scroll to the first chapter", () => {
    expect(chapterAt(0)).toBe(0);
    expect(chapterAt(-0.2)).toBe(0);
  });

  test("maps each chapter's range to its index", () => {
    CHAPTERS.forEach((c, i) => {
      expect(chapterAt((c.from + c.to) / 2)).toBe(i);
    });
  });

  test("clamps the end of the scroll to the hold", () => {
    expect(chapterAt(1)).toBe(CHAPTERS.length - 1);
    expect(chapterAt(1.5)).toBe(CHAPTERS.length - 1);
  });
});

describe("panelWindow", () => {
  test("spreads panels evenly across the panels chapter", () => {
    const first = panelWindow(0, 4);
    const last = panelWindow(3, 4);
    expect(first[0]).toBeCloseTo(CHAPTERS[1].from);
    expect(last[1]).toBeCloseTo(CHAPTERS[1].to);
    expect(first[1]).toBeLessThanOrEqual(panelWindow(1, 4)[1]);
  });

  test("gives every panel a non-empty window", () => {
    for (let i = 0; i < 24; i++) {
      const [a, b] = panelWindow(i, 24);
      expect(b).toBeGreaterThan(a);
    }
  });

  test("handles a single panel and zero panels", () => {
    expect(panelWindow(0, 1)).toEqual([CHAPTERS[1].from, CHAPTERS[1].to]);
    expect(panelWindow(0, 0)).toEqual([CHAPTERS[1].from, CHAPTERS[1].to]);
  });
});

describe("promiseWindow", () => {
  test("stamps promises one after another inside the stays chapter", () => {
    const a = promiseWindow(0, 4);
    const b = promiseWindow(1, 4);
    expect(a[0]).toBeCloseTo(CHAPTERS[3].from);
    expect(b[0]).toBeGreaterThan(a[0]);
    expect(promiseWindow(3, 4)[1]).toBeLessThanOrEqual(CHAPTERS[3].to);
  });

  test("finishes before the hold so nothing changes during it", () => {
    expect(promiseWindow(3, 4)[1]).toBeLessThanOrEqual(CHAPTERS[4].from);
    expect(CTA_WINDOW[1]).toBeLessThanOrEqual(CHAPTERS[4].from);
  });
});
