/**
 * Hero caption timing. A cue names which project is on screen from a given
 * second of the reel. With no footage the slideshow supplies the project
 * directly, so this only has to answer "which cue owns this time".
 */
export type HeroCue = { at: number; projectId: string };

/** The project on screen at `time` seconds, or null before the first cue. */
export function cueAt(cues: readonly HeroCue[], time: number): string | null {
  let current: string | null = null;
  for (const cue of cues) {
    if (cue.at <= time) current = cue.projectId;
    else break;
  }
  return current;
}
