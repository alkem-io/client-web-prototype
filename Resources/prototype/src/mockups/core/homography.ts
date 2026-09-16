/**
 * homography — fit a flat screen into the four corners of a photograph.
 *
 * This is what makes a reference photo usable as a template. Given where the
 * screen's four corners land in the image, it solves the projective transform
 * that maps an axis-aligned `width x height` element onto that quad, and emits
 * it as a CSS `matrix3d`. Same idea as a Photoshop smart object, done in the
 * browser so the screen underneath stays live text rather than a flattened
 * bitmap.
 */
export type Point = [number, number];
/** Clockwise from the top-left of the screen area. */
export type Quad = [Point, Point, Point, Point];

/** Solve A x = b by Gaussian elimination with partial pivoting. */
function solve(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-10) return null;
    [M[col], M[pivot]] = [M[pivot], M[col]];

    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

/**
 * The CSS matrix3d that maps the rect (0,0)-(width,height) onto `quad`.
 * Returns null when the quad is degenerate — three points in a line, or a
 * self-crossing shape — which is what a bad calibration drag produces.
 */
export function quadToMatrix3d(width: number, height: number, quad: Quad): string | null {
  const src: Quad = [[0, 0], [width, 0], [width, height], [0, height]];

  // Eight unknowns: the homography with h22 fixed at 1.
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [u, v] = quad[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }

  const h = solve(A, b);
  if (!h) return null;
  if (h.some(n => !Number.isFinite(n))) return null;

  // CSS matrix3d is column-major, and the 2D homography drops into the
  // x/y/w rows and columns of the 4x4 with z left as identity.
  const m = [
    h[0], h[3], 0, h[6],
    h[1], h[4], 0, h[7],
    0, 0, 1, 0,
    h[2], h[5], 0, 1,
  ];
  return `matrix3d(${m.map(n => Number(n.toFixed(6))).join(',')})`;
}

/** Axis-aligned bounds of a quad — used to size the wrapper we transform in. */
export function quadBounds(quad: Quad) {
  const xs = quad.map(p => p[0]);
  const ys = quad.map(p => p[1]);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
