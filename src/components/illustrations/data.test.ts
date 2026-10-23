import { describe, expect, it } from 'vitest';
import { CLASSIFICATION, CLUSTERING, HOME, REGRESSION, type Pt } from './data';

const dist = (p: Pt, q: Pt) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const mean = (pts: readonly Pt[]): Pt => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];

function leastSquares(pts: readonly Pt[]) {
  const [mx, my] = mean(pts);
  const slope =
    pts.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) /
    pts.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
  return { slope, intercept: my - slope * mx };
}

const nearest = (pts: readonly Pt[], to: Pt) => pts.map((p) => dist(p, to)).sort((a, b) => a - b);

describe('the drawings show real results of their methods', () => {
  it('Regression: the line is the least squares line of the points', () => {
    const fit = leastSquares(REGRESSION.points);
    expect(fit.slope).toBeCloseTo(REGRESSION.slope, 3);
    expect(fit.intercept).toBeCloseTo(REGRESSION.intercept, 1);
    for (const [x, y] of REGRESSION.line) {
      expect(y).toBeCloseTo(fit.intercept + fit.slope * x, 0);
    }
    expect(mean(REGRESSION.points)[0]).toBeCloseTo(REGRESSION.mean[0], 1);
    expect(fit.intercept + fit.slope * REGRESSION.mean[0]).toBeCloseTo(REGRESSION.mean[1], 0);
  });

  it('Classification: the circle holds exactly the k nearest points and the majority is white', () => {
    const { a, b, query, k, radius } = CLASSIFICATION;
    const all = [...a.map((p) => [p, 'a'] as const), ...b.map((p) => [p, 'b'] as const)];
    const sorted = all.map(([p, c]) => ({ d: dist(p, query), c })).sort((x, y) => x.d - y.d);
    expect(sorted[k - 1].d).toBeLessThan(radius);
    expect(sorted[k].d).toBeGreaterThan(radius);
    expect(sorted.filter((s) => s.d < radius)).toHaveLength(k);
    const votes = sorted.slice(0, k).filter((s) => s.c === 'a').length;
    expect(votes).toBe(2);
    expect(nearest([...a, ...b], query)[k]).toBeGreaterThan(radius + 5);
  });

  it('Clustering: two k-means steps give the drawn assignments and centroids, then it rests', () => {
    const { points, init, assign1, mid, assign2, final } = CLUSTERING;
    const assign = (c: readonly Pt[]) =>
      points.map((p) => (dist(p, c[0]) <= dist(p, c[1]) ? 0 : 1));
    const update = (labels: readonly number[]): Pt[] =>
      [0, 1].map((k) => mean(points.filter((_, i) => labels[i] === k)));
    const round = (c: Pt[]) => c.map((p) => p.map((v) => Math.round(v * 10) / 10));

    expect(assign(init)).toEqual(assign1);
    expect(round(update(assign1))).toEqual(mid);
    expect(assign(mid)).toEqual(assign2);
    expect(round(update(assign2))).toEqual(final);
    expect(assign(final)).toEqual(assign2);
    // the picture has something to show: some points change cluster after the first move
    expect(assign1.filter((l, i) => l !== assign2[i]).length).toBeGreaterThan(0);
  });

  it('Home: the fit, the boundary and the centroids belong to the points', () => {
    const { points, groups, line, boundary, centroids } = HOME;
    const fit = leastSquares(points);
    for (const [x, y] of line) expect(y).toBeCloseTo(fit.intercept + fit.slope * x, 0);

    const groupMean = (g: number) => mean(points.filter((_, i) => groups[i] === g));
    centroids.forEach((c, g) => {
      expect(c[0]).toBeCloseTo(groupMean(g)[0], 1);
      expect(c[1]).toBeCloseTo(groupMean(g)[1], 1);
    });

    // the dashed boundary separates the two groups (cross product sign per side)
    const side = (p: Pt) =>
      (boundary[1][0] - boundary[0][0]) * (p[1] - boundary[0][1]) -
      (boundary[1][1] - boundary[0][1]) * (p[0] - boundary[0][0]);
    points.forEach((p, i) => expect(Math.sign(side(p))).toBe(groups[i] === 0 ? 1 : -1));
  });

  it('every coordinate lies inside the 400 x 300 drawing area', () => {
    const all: Pt[] = [
      ...REGRESSION.points,
      ...REGRESSION.line,
      ...CLASSIFICATION.a,
      ...CLASSIFICATION.b,
      CLASSIFICATION.query,
      ...CLUSTERING.points,
      ...CLUSTERING.init,
      ...CLUSTERING.final,
      ...HOME.points,
      ...HOME.line,
      ...HOME.boundary,
      ...HOME.start,
    ];
    for (const [x, y] of all) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(400);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(300);
    }
    const { query, radius } = CLASSIFICATION;
    expect(query[0] - radius).toBeGreaterThan(0);
    expect(query[0] + radius).toBeLessThan(400);
    expect(query[1] - radius).toBeGreaterThan(0);
    expect(query[1] + radius).toBeLessThan(300);
  });
});
