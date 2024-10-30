import { Vector2 } from '../../Types';
import { Interpolation } from '../../Utils';

/**
 * Helper methods to approximate a path by interpolating a sequence of control points.
 */
export class PathApproximator {
  static readonly BEZIER_TOLERANCE = Math.fround(0.25);
  static readonly CIRCULAR_ARC_TOLERANCE = Math.fround(0.1);

  /**
   * The amount of pieces to calculate for each control point quadruplet.
   */
  static readonly CATMULL_DETAIL = 50;

  /**
   * Creates a piecewise-linear approximation of a bezier curve, by adaptively repeatedly subdividing
   * the control points until their approximation error vanishes below a given threshold.
   * @param controlPoints The control points of the path.
   * @returns A list of vectors representing the piecewise-linear approximation.
   */
  static approximateBezier(controlPoints: Vector2[]): Vector2[] {
    return this.approximateBSpline(controlPoints);
  }

  /**
   * Creates a piecewise-linear approximation of a clamped uniform B-spline with polynomial order p, 
   * by dividing it into a series of bezier control points at its knots, then adaptively repeatedly
   * subdividing those until their approximation error vanishes below a given threshold.
   * Retains previous bezier approximation functionality when p is 0 or too large to create knots.
   * Algorithm unsuitable for large values of p with many knots.
   * @param controlPoints The control points.
   * @param p The polynomial order.
   * @returns A list of vectors representing the piecewise-linear approximation.
   */
  static approximateBSpline(controlPoints: Vector2[], p = 0): Vector2[] {
    const output: Vector2[] = [];
    const n = controlPoints.length - 1;

    if (n < 0) return output;

    const toFlatten: Vector2[][] = [];
    const freeBuffers: Vector2[][] = [];

    const points = controlPoints.slice();

    if (p > 0 && p < n) {
      // Subdivide B-spline into bezier control points at knots.
      for (let i = 0; i < n - p; ++i) {
        const subBezier: Vector2[] = [points[i]];

        // Destructively insert the knot p-1 times via Boehm's algorithm.
        for (let j = 0; j < p - 1; ++j) {
          subBezier[j + 1] = points[i + 1];

          for (let k = 1; k < p - j; ++k) {
            const l = Math.min(k, n - p - i);

            points[i + k] = (points[i + k]
              .fscale(l)
              .fadd(points[i + k + 1]))
              .fdivide(l + 1);
          }
        }

        subBezier[p] = points[i + 1];
        toFlatten.push(subBezier);
      }

      toFlatten.push(points.slice(n - p));
      // Reverse the stack so elements can be accessed in order.
      toFlatten.reverse();
    }
    else {
      // B-spline subdivision unnecessary, degenerate to single bezier.
      p = n;
      toFlatten.push(points);
    }

    /**
     * "toFlatten" contains all the curves which are not yet approximated well enough.
     * We use a stack to emulate recursion without the risk of running into a stack overflow.
     * (More specifically, we iteratively and adaptively refine our curve 
     * with a {@link https://en.wikipedia.org/wiki/Depth-first_search|Depth-first search} 
     * over the tree resulting from the subdivisions we make.)
     */

    const subdivisionBuffer1: Vector2[] = [];
    const subdivisionBuffer2: Vector2[] = [];

    const leftChild = subdivisionBuffer2;

    while (toFlatten.length > 0) {
      const parent = toFlatten.pop() || [];

      if (this._bezierIsFlatEnough(parent)) {
        /**
         * If the control points we currently operate on are sufficiently "flat", we use
         * an extension to De Casteljau's algorithm to obtain a piecewise-linear approximation
         * of the bezier curve represented by our control points, consisting of the same amount
         * of points as there are control points.
         */
        this._bezierApproximate(parent, output, subdivisionBuffer1, subdivisionBuffer2, p + 1);

        freeBuffers.push(parent);
        continue;
      }

      /**
       * If we do not yet have a sufficiently "flat" (in other words, detailed) approximation we keep
       * subdividing the curve we are currently operating on.
       */
      const rightChild = freeBuffers.pop() || [];

      this._bezierSubdivide(parent, leftChild, rightChild, subdivisionBuffer1, p + 1);

      /**
       * We re-use the buffer of the parent for one of the children, 
       * so that we save one allocation per iteration.
       */
      for (let i = 0; i < p + 1; ++i) {
        parent[i] = leftChild[i];
      }

      toFlatten.push(rightChild);
      toFlatten.push(parent);
    }

    output.push(controlPoints[n]);

    return output;
  }

  /**
   * Creates a piecewise-linear approximation of a Catmull-Rom spline.
   * @param controlPoints The control points of the path.
   * @returns A list of vectors representing the piecewise-linear approximation.
   */
  static approximateCatmull(controlPoints: Vector2[]): Vector2[] {
    const output = [];
    const controlPointsLength = controlPoints.length;

    for (let i = 0; i < controlPointsLength - 1; i++) {
      const v1 = i > 0 ? controlPoints[i - 1] : controlPoints[i];
      const v2 = controlPoints[i];
      const v3 = i < controlPointsLength - 1
        ? controlPoints[i + 1]
        : v2.fadd(v2).fsubtract(v1);

      const v4 = i < controlPointsLength - 2
        ? controlPoints[i + 2]
        : v3.fadd(v3).fsubtract(v2);

      for (let c = 0; c < PathApproximator.CATMULL_DETAIL; c++) {
        output.push(
          PathApproximator._catmullFindPoint(v1, v2, v3, v4,
            Math.fround(Math.fround(c) / PathApproximator.CATMULL_DETAIL),
          ),
        );

        output.push(
          PathApproximator._catmullFindPoint(v1, v2, v3, v4,
            Math.fround(Math.fround(c + 1) / PathApproximator.CATMULL_DETAIL),
          ),
        );
      }
    }

    return output;
  }

  /**
   * Creates a piecewise-linear approximation of a circular arc curve.
   * @param controlPoints The control points of the path.
   * @returns A list of vectors representing the piecewise-linear approximation.
   */
  static approximateCircularArc(controlPoints: Vector2[]): Vector2[] {
    const pr = this._circularArcProperties(controlPoints);

    if (!pr.isValid) {
      return this.approximateBezier(controlPoints);
    }

    /**
     * We select the amount of points for the approximation by requiring the discrete curvature
     * to be smaller than the provided tolerance. The exact angle required to meet the tolerance
     * is: 2 * Math.Acos(1 - TOLERANCE / r)
     * The special case is required for extremely short sliders where the radius is smaller than
     * the tolerance. This is a pathological rather than a realistic case.
     */
    let amountPoints = 2;

    if (2 * pr.radius > PathApproximator.CIRCULAR_ARC_TOLERANCE) {
      let angle = Math.fround(PathApproximator.CIRCULAR_ARC_TOLERANCE / pr.radius);

      angle = Math.fround(1 - angle);
      angle = Math.fround(2 * Math.fround(Math.acos(angle)));

      const points = Math.ceil(Math.fround(pr.thetaRange / angle));

      /**
       * Edge case for beatmaps with huge radius and infinite points:
       * https://osu.ppy.sh/beatmapsets/1235519#osu/2568364
       */
      const validPoints = !isFinite(points) ? -(2 ** 31) : points;

      amountPoints = Math.max(2, validPoints);
    }

    const output: Vector2[] = [];

    for (let i = 0; i < amountPoints; ++i) {
      const fract = i / (amountPoints - 1);
      const theta = pr.thetaStart + pr.direction * fract * pr.thetaRange;

      const vector2 = new Vector2(
        Math.fround(Math.cos(theta)),
        Math.fround(Math.sin(theta)),
      );

      output.push(vector2.fscale(pr.radius).fadd(pr.centre));
    }

    return output;
  }

  /**
   * Computes various properties that can be used to approximate the circular arc.
   * @param controlPoints Three distinct points on the arc.
   * @returns The properties for approximation of the circular arc.
   */
  static _circularArcProperties(controlPoints: Vector2[]): CircularArcProperties {
    const a = controlPoints[0];
    const b = controlPoints[1];
    const c = controlPoints[2];

    /**
     * If we have a degenerate triangle where a side-length is almost zero,
     * then give up and fallback to a more numerically stable method.
     */
    const sideLength = Math.fround(
      Math.fround(b.floatY - a.floatY) * Math.fround(c.floatX - a.floatX) -
      Math.fround(b.floatX - a.floatX) * Math.fround(c.floatY - a.floatY),
    );

    if (Math.abs(sideLength) < Math.fround(0.001)) {
      return new CircularArcProperties();
    }

    const d = Math.fround(2 * Math.fround((
      Math.fround(a.floatX * b.fsubtract(c).floatY) +
      Math.fround(b.floatX * c.fsubtract(a).floatY) +
      Math.fround(c.floatX * a.fsubtract(b).floatY)
    )));

    const aSq = Math.fround(
      Math.fround(a.floatX * a.floatX) + Math.fround(a.floatY * a.floatY),
    );

    const bSq = Math.fround(
      Math.fround(b.floatX * b.floatX) + Math.fround(b.floatY * b.floatY),
    );

    const cSq = Math.fround(
      Math.fround(c.floatX * c.floatX) + Math.fround(c.floatY * c.floatY),
    );

    const centre = new Vector2(
      Math.fround(
        Math.fround(
          Math.fround(aSq * b.fsubtract(c).floatY) +
          Math.fround(bSq * c.fsubtract(a).floatY),
        ) + Math.fround(cSq * a.fsubtract(b).floatY),
      ),
      Math.fround(
        Math.fround(
          Math.fround(aSq * c.fsubtract(b).floatX) +
          Math.fround(bSq * a.fsubtract(c).floatX),
        ) + Math.fround(cSq * b.fsubtract(a).floatX),
      ),
    ).fdivide(d);

    const dA = a.fsubtract(centre);
    const dC = c.fsubtract(centre);

    const radius = dA.flength();

    const thetaStart = Math.atan2(dA.floatY, dA.floatX);
    let thetaEnd = Math.atan2(dC.floatY, dC.floatX);

    while (thetaEnd < thetaStart) {
      thetaEnd += 2 * Math.PI;
    }

    let direction = 1;
    let thetaRange = thetaEnd - thetaStart;

    /**
     * Decide in which direction to draw the circle, depending on which side of
     * AC B lies.
     */
    let orthoAtoC = c.fsubtract(a);

    orthoAtoC = new Vector2(orthoAtoC.floatY, -orthoAtoC.floatX);

    if (orthoAtoC.fdot(b.fsubtract(a)) < 0) {
      direction = -direction;
      thetaRange = 2 * Math.PI - thetaRange;
    }

    return new CircularArcProperties(thetaStart, thetaRange, direction, radius, centre);
  }

  /**
   * Creates a piecewise-linear approximation of a linear curve.
   * Basically, returns the input.
   * @param controlPoints The control points of the path.
   * @returns A list of vectors representing the piecewise-linear approximation.
   */
  static approximateLinear(controlPoints: Vector2[]): Vector2[] {
    return controlPoints.slice();
  }

  /**
   * Creates a piecewise-linear approximation of a lagrange polynomial.
   * @param controlPoints The control points of the path.
   * @returns A list of vectors representing the piecewise-linear approximation.
   */
  static approximateLagrangePolynomial(controlPoints: Vector2[]): Vector2[] {
    // TODO: add some smarter logic here, chebyshev nodes?
    const NUM_STEPS = 51;

    const output = [];

    const weights = Interpolation.barycentricWeights(controlPoints);

    let minX = controlPoints[0].floatX;
    let maxX = controlPoints[0].floatX;

    for (let i = 1, len = controlPoints.length; i < len; i++) {
      minX = Math.min(minX, controlPoints[i].floatX);
      maxX = Math.max(maxX, controlPoints[i].floatX);
    }

    const dx = maxX - minX;

    for (let i = 0; i < NUM_STEPS; i++) {
      const x = minX + (dx / (NUM_STEPS - 1)) * i;
      const y = Math.fround(Interpolation.barycentricLagrange(controlPoints, weights, x));

      output.push(new Vector2(x, y));
    }

    return output;
  }

  /**
   * Make sure the 2nd order derivative (approximated using finite elements) is within tolerable bounds.
   * NOTE: The 2nd order derivative of a 2d curve represents its curvature, so intuitively this function
   *       checks (as the name suggests) whether our approximation is _locally_ "flat". More curvy parts
   *       need to have a denser approximation to be more "flat".
   * @param controlPoints The control points to check for flatness.
   * @returns Whether the control points are flat enough.
   */
  private static _bezierIsFlatEnough(controlPoints: Vector2[]): boolean {
    let vector2;

    for (let i = 1, len = controlPoints.length; i < len - 1; i++) {
      vector2 = controlPoints[i - 1]
        .fsubtract(controlPoints[i].fscale(2))
        .fadd(controlPoints[i + 1]);

      if (vector2.flength() ** 2 > PathApproximator.BEZIER_TOLERANCE ** 2 * 4) {
        return false;
      }
    }

    return true;
  }

  /**
   * Subdivides n control points representing a bezier curve into 2 sets of n control points, each
   * describing a bezier curve equivalent to a half of the original curve. Effectively this splits
   * the original curve into 2 curves which result in the original curve when pieced back together.
   * @param controlPoints The control points to split.
   * @param l Output: The control points corresponding to the left half of the curve.
   * @param r Output: The control points corresponding to the right half of the curve.
   * @param subdivisionBuffer The first buffer containing the current subdivision state.
   * @param count The number of control points in the original list.
   */
  private static _bezierSubdivide(
    controlPoints: Vector2[],
    l: Vector2[],
    r: Vector2[],
    subdivisionBuffer: Vector2[],
    count: number,
  ): void {
    const midpoints = subdivisionBuffer;

    for (let i = 0; i < count; ++i) {
      midpoints[i] = controlPoints[i];
    }

    for (let i = 0; i < count; ++i) {
      l[i] = midpoints[0];
      r[count - i - 1] = midpoints[count - i - 1];

      for (let j = 0; j < count - i - 1; j++) {
        midpoints[j] = midpoints[j].fadd(midpoints[j + 1]).fdivide(2);
      }
    }
  }

  /**
   * This uses De Casteljau's algorithm to obtain an optimal
   * piecewise-linear approximation of the bezier curve with the same amount of points as there are control points.
   * @param controlPoints The control points describing the bezier curve to be approximated.
   * @param output The points representing the resulting piecewise-linear approximation.
   * @param count The number of control points in the original list.
   * @param subdivisionBuffer1 The first buffer containing the current subdivision state.
   * @param subdivisionBuffer2 The second buffer containing the current subdivision state.
   */
  private static _bezierApproximate(
    controlPoints: Vector2[],
    output: Vector2[],
    subdivisionBuffer1: Vector2[],
    subdivisionBuffer2: Vector2[],
    count: number,
  ): void {
    const l = subdivisionBuffer2;
    const r = subdivisionBuffer1;

    PathApproximator._bezierSubdivide(controlPoints, l, r, subdivisionBuffer1, count);

    for (let i = 0; i < count - 1; ++i) {
      l[count + i] = r[i + 1];
    }

    output.push(controlPoints[0]);

    for (let i = 1; i < count - 1; ++i) {
      const index = 2 * i;
      const p = l[index - 1]
        .fadd(l[index].fscale(2))
        .fadd(l[index + 1])
        .fscale(Math.fround(0.25));

      output.push(p);
    }
  }

  /**
   * Finds a point on the spline at the position of a parameter.
   * @param vec1 The first vector.
   * @param vec2 The second vector.
   * @param vec3 The third vector.
   * @param vec4 The fourth vector.
   * @param t The parameter at which to find the point on the spline, in the range [0, 1].
   * @returns The point on the spline at t.
   */
  private static _catmullFindPoint(
    vec1: Vector2,
    vec2: Vector2,
    vec3: Vector2,
    vec4: Vector2,
    t: number,
  ): Vector2 {
    const t2 = Math.fround(t * t);
    const t3 = Math.fround(t * t2);

    const coordinates: number[] = [];

    /**
     * Please help me...
     * 
     * result.X = 0.5f * (2f * vec2.X + (-vec1.X + vec3.X) * t + (2f * vec1.X - 5f * vec2.X + 4f * vec3.X - vec4.X) * t2 + (-vec1.X + 3f * vec2.X - 3f * vec3.X + vec4.X) * t3);
     * result.Y = 0.5f * (2f * vec2.Y + (-vec1.Y + vec3.Y) * t + (2f * vec1.Y - 5f * vec2.Y + 4f * vec3.Y - vec4.Y) * t2 + (-vec1.Y + 3f * vec2.Y - 3f * vec3.Y + vec4.Y) * t3);
     */
    for (let i = 0; i <= 1; ++i) {
      const value1 = i === 0 ? vec1.floatX : vec1.floatY;
      const value2 = i === 0 ? vec2.floatX : vec2.floatY;
      const value3 = i === 0 ? vec3.floatX : vec3.floatY;
      const value4 = i === 0 ? vec4.floatX : vec4.floatY;

      const v1 = Math.fround(2 * value2);
      const v2 = Math.fround(value3 - value1);

      const v31 = Math.fround(2 * value1);
      const v32 = Math.fround(5 * value2);
      const v33 = Math.fround(4 * value3);

      const v41 = Math.fround(3 * value2);
      const v42 = Math.fround(3 * value3);

      const v5 = Math.fround(v2 * t);

      const v61 = Math.fround(v31 - v32);
      const v62 = Math.fround(v61 + v33);
      const v63 = Math.fround(v62 - value4);
      const v6 = Math.fround(v63);

      const v71 = Math.fround(v41 - value1);
      const v72 = Math.fround(v71 - v42);
      const v7 = Math.fround(v72 + value4);

      const v8 = Math.fround(v6 * t2);
      const v9 = Math.fround(v7 * t3);

      const v101 = Math.fround(v1 + v5);
      const v102 = Math.fround(v101 + v8);
      const v10 = Math.fround(v102 + v9);

      coordinates.push(Math.fround(Math.fround(0.5) * v10));
    }

    return new Vector2(coordinates[0], coordinates[1]);
  }
}

/**
 * The properties for approximation of the circular arc.
 */
export class CircularArcProperties {
  /**
   * Whether the properties are valid.
   */
  readonly isValid: boolean;

  /**
   * Starting angle of the circle.
   */
  readonly thetaStart: number;

  /**
   * The angle of the drawn circle.
   */
  readonly thetaRange: number;

  /**
   * The direction in which the circle will be drawn.
   */
  readonly direction: number;

  /**
   * The radius of a circle.
   */
  readonly radius: number;

  /**
   * The centre position of a circle.
   */
  readonly centre: Vector2;

  constructor(thetaStart?: number, thetaRange?: number, direction?: number, radius?: number, centre?: Vector2) {
    this.isValid = !!(thetaStart || thetaRange || direction || radius || centre);
    this.thetaStart = thetaStart || 0;
    this.thetaRange = thetaRange || 0;
    this.direction = direction || 0;
    this.radius = radius ? Math.fround(radius) : 0;
    this.centre = centre || new Vector2(0, 0);
  }

  get thetaEnd(): number {
    return this.thetaStart + this.thetaRange * this.direction;
  }
}
