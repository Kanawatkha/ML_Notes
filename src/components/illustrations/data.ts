/**
 * Fixed coordinates of the four illustrations, in the 400 x 300 viewBox of every drawing. They were
 * produced by a script (least squares for the lines, k nearest neighbours for the query, two
 * k-means steps for the centroids) and are checked again by data.test.ts, so the pictures show real
 * results of the methods and not hand-placed guesses.
 */
export type Pt = readonly [number, number];

export const REGRESSION = {
  points: [
    [56, 254.0],
    [83, 210.9],
    [110, 217.8],
    [137, 174.6],
    [164, 191.5],
    [191, 156.4],
    [218, 164.3],
    [245, 119.2],
    [272, 125.0],
    [299, 85.9],
    [326, 97.8],
    [353, 66.7],
  ] as readonly Pt[],
  /** Least squares line, drawn between x = 44 and x = 356. */
  line: [
    [44, 248.0],
    [356, 67.9],
  ] as readonly Pt[],
  mean: [204.5, 155.3] as Pt,
  slope: -0.5774,
  intercept: 273.409,
} as const;

export const CLASSIFICATION = {
  a: [
    [92, 206],
    [118, 176],
    [140, 214],
    [150, 186],
    [104, 236],
    [176, 222],
    [128, 246],
  ] as readonly Pt[],
  b: [
    [262, 96],
    [288, 128],
    [310, 84],
    [246, 124],
    [332, 112],
    [278, 70],
    [300, 150],
  ] as readonly Pt[],
  query: [200, 160] as Pt,
  k: 3,
  /** The circle passes between the 3rd and the 4th nearest point. */
  radius: 73,
} as const;

export const CLUSTERING = {
  points: [
    [78, 84],
    [112, 62],
    [96, 118],
    [140, 96],
    [70, 140],
    [128, 140],
    [158, 66],
    [110, 172],
    [252, 196],
    [286, 170],
    [320, 214],
    [268, 236],
    [304, 248],
    [340, 180],
    [236, 158],
    [214, 214],
  ] as readonly Pt[],
  init: [
    [120, 70],
    [170, 120],
  ] as readonly Pt[],
  assign1: [0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1] as readonly number[],
  mid: [
    [109.0, 94.3],
    [245.8, 192.8],
  ] as readonly Pt[],
  assign2: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1] as readonly number[],
  final: [
    [111.5, 109.8],
    [277.5, 202.0],
  ] as readonly Pt[],
} as const;

export const HOME = {
  points: [
    [70, 222],
    [104, 196],
    [88, 248],
    [132, 224],
    [120, 170],
    [150, 206],
    [176, 238],
    [226, 120],
    [262, 92],
    [250, 150],
    [292, 128],
    [318, 70],
    [300, 176],
    [344, 108],
  ] as readonly Pt[],
  groups: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1] as readonly number[],
  line: [
    [44, 246.5],
    [356, 91.2],
  ] as readonly Pt[],
  boundary: [
    [137.7, 54.9],
    [266.9, 280.5],
  ] as readonly Pt[],
  centroids: [
    [120.0, 214.9],
    [284.6, 120.6],
  ] as readonly Pt[],
  start: [
    [190, 140],
    [214, 164],
  ] as readonly Pt[],
} as const;
