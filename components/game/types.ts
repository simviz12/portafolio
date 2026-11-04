export type DroneId = "about" | "skills" | "projects";

export type GamePalette = {
  dark: boolean;
  skyTop: string;
  skyBottom: string;
  horizon: string;
  fog: string;
  floor: string;
  grid: string;
  monolith: string;
  strip: string;
  weapon: string;
  weaponTrim: string;
  energy: string;
  tracer: string;
  drones: Record<DroneId, string>;
};

export const GAME_PALETTES: Record<"light" | "dark", GamePalette> = {
  dark: {
    dark: true,
    skyTop: "#02030a",
    skyBottom: "#0b1124",
    horizon: "#00f5d4",
    fog: "#05070f",
    floor: "#070a12",
    grid: "#00f5d4",
    monolith: "#0b0f1a",
    strip: "#00f5d4",
    weapon: "#151a24",
    weaponTrim: "#c9d4e3",
    energy: "#00f5d4",
    tracer: "#7ffff0",
    drones: { about: "#00f5d4", skills: "#b388ff", projects: "#ff3d81" },
  },
  light: {
    dark: false,
    skyTop: "#bfe6ff",
    skyBottom: "#f6f8fb",
    horizon: "#ffffff",
    fog: "#eef2f7",
    floor: "#f2f4f7",
    grid: "#00a28c",
    monolith: "#ffffff",
    strip: "#00b39b",
    weapon: "#e9edf2",
    weaponTrim: "#1f2937",
    energy: "#00b39b",
    tracer: "#00a28c",
    drones: { about: "#00a28c", skills: "#7c3aed", projects: "#e11d74" },
  },
};

export type DroneDef = { id: DroneId; tag: string; name: string };

export type FireResult = { id: DroneId; crit: boolean; killed: boolean; hp: number } | null;

export type SceneApi = { fire: () => FireResult };

/** Mutable input/state shared between the DOM shell and the render loop (no re-renders). */
export type Shared = {
  aimX: number;
  aimY: number;
  keys: Record<string, boolean>;
  turn: number;
  paused: boolean;
  reloading: number; // 0..1 progress, 0 = not reloading
  kills: number;
  hover: DroneId | null;
  labels: Partial<Record<DroneId, HTMLDivElement | null>>;
};

export const MAX_HP = 3;
export const MAG_SIZE = 30;
