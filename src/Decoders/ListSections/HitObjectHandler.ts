import {
  Vector2,
  SliderPath,
  SampleBank,
  HitSample,
  PathPoint,
  PathType,
  HitType,
  HitSound,
  SampleSet,
} from 'osu-resources';

import { ParsedHitObject } from '../../Classes/ParsedHitObject';
import { ParsedHit } from '../../Classes/ParsedHit';
import { ParsedSlider } from '../../Classes/ParsedSlider';
import { ParsedSpinner } from '../../Classes/ParsedSpinner';
import { ParsedHold } from '../../Classes/ParsedHold';

/**
 * A decoder for beatmap hit objects.
 */
export abstract class HitObjectHandler {
  /**
   * Decodes a hit object line to get a parsed hit object.
   * @param line A hit object line.
   * @returns A new parsed hit object.
   */
  static handleLine(line: string): ParsedHitObject {
    // x,y,time,type,hitSound,objectParams,hitSample

    const data = line.split(',').map((v) => v.trim());

    const hitType = parseInt(data[3]);

    const hitObject = HitObjectHandler.createHitObject(hitType);

    hitObject.startX = parseInt(data[0]);
    hitObject.startY = parseInt(data[1]);
    hitObject.startTime = parseInt(data[2]);
    hitObject.hitType = hitType;
    hitObject.hitSound = parseInt(data[4]);

    HitObjectHandler.addExtras(data.slice(5), hitObject);

    return hitObject;
  }

  /**
   * Creates a new parsed hit object based on hit type.
   * @param hitType Hit type data.
   * @returns A new parsed hit object.
   */
  static createHitObject(hitType: HitType): ParsedHitObject {
    if (hitType & HitType.Slider) {
      return new ParsedSlider();
    }

    if (hitType & HitType.Spinner) {
      return new ParsedSpinner();
    }

    if (hitType & HitType.Hold) {
      return new ParsedHold();
    }

    return new ParsedHit();
  }

  /**
   * Adds extra data to the parsed hit object.
   * @param data The data of a hit object line.
   * @param hitObject A parsed hit object.
   */
  static addExtras(data: string[], hitObject: ParsedHitObject): void {
    const hitType = hitObject.hitType;

    let extras: string[] = [];

    if (hitType & HitType.Slider) {
      extras = data.splice(0, 5);

      HitObjectHandler.addSliderExtras(extras, hitObject as ParsedSlider);
    }
    else if (hitType & HitType.Spinner) {
      extras = data.splice(0, 1);

      HitObjectHandler.addSpinnerExtras(extras, hitObject as ParsedSpinner);
    }
    else if (hitType & HitType.Hold) {
      data = data.join('').split(':');
      extras = data.splice(0, 1);
      data = data.join(':').split(',');

      HitObjectHandler.addHoldExtras(extras, hitObject as ParsedHold);
    }

    const sampleData = data.join('');
    const hitSound = hitObject.hitSound;

    // Create a new default sample bank.
    const bank = new SampleBank();

    hitObject.samples = HitObjectHandler.getDefaultSamples(sampleData, hitSound, bank);

    if (hitObject.hitType & HitType.Slider) {
      const slider = hitObject as ParsedSlider;

      const nodeData = extras.splice(3, 5);

      // One node for each repeat + the start and end nodes
      const nodes = slider.repeats + 2 || 2;

      slider.nodeSamples = HitObjectHandler.getNodeSamples(nodeData, nodes, hitSound, bank);
    }
    else if (hitObject.hitType & HitType.Hold) {
      const hold = hitObject as ParsedHold;

      hold.nodeSamples = [hold.samples];
    }
  }

  /**
   * Adds slider extra data to a parsed slider.
   * @param extras Extra data of slidable object.
   * @param slider A parsed slider.
   */
  static addSliderExtras(extras: string[], slider: ParsedSlider): void {
    // curveType|curvePoints,slides,length,edgeSounds,edgeSets

    const pathString = extras[0];
    const offset = slider.startPosition;

    const controlPoints = HitObjectHandler.convertPathString(pathString, offset);
    const curveType = controlPoints[0].type as PathType;

    /**
     * osu!stable treated the first span of the slider as a repeat,
     * but no repeats are happening.
     */
    slider.repeats = Math.max(0, parseInt(extras[1]) - 1);
    slider.pixelLength = parseFloat(extras[2]) || 0;

    const expectedDistance = slider.pixelLength;

    slider.path = new SliderPath(curveType, controlPoints, expectedDistance);
  }

  /**
   * Adds spinner extra data to a parsed spinner.
   * @param extras Extra data of spinnable object.
   * @param slider A parsed spinner.
   */
  static addSpinnerExtras(extras: string[], spinner: ParsedSpinner): void {
    // endTime

    spinner.endTime = parseInt(extras[0]);
  }

  /**
   * Adds hold extra data to a parsed hold.
   * @param extras Extra data of a holdable object.
   * @param slider A parsed hold.
   */
  static addHoldExtras(extras: string[], hold: ParsedHold): void {
    // endTime

    hold.endTime = parseInt(extras[0]);
  }

  /**
   * Converts a given path string into a set of path control points.
   * 
   * A path string takes the form: X|1:1|2:2|2:2|3:3|Y|1:1|2:2.
   * This has three segments:
   *  X: { (1,1), (2,2) } (implicit segment)
   *  X: { (2,2), (3,3) } (implicit segment)
   *  Y: { (3,3), (1,1), (2, 2) } (explicit segment)
   * 
   * @param pathString The path string.
   * @param offset The positional offset to apply to the control points.
   * @returns All control points in the resultant path.
   */
  static convertPathString(pathString: string, offset: Vector2): PathPoint[] {
    /**
     * This code takes on the responsibility of handling explicit segments of the path ("X" & "Y" from above).
     * Implicit segments are handled by calls to convertPoints().
     */
    const pathSplit = pathString.split('|').map((p) => p.trim());

    const controlPoints: PathPoint[] = [];

    let startIndex = 0;
    let endIndex = 0;
    let isFirst = true;

    while (++endIndex < pathSplit.length) {
      /**
       * Keep incrementing endIndex while it's not the start of a new segment
       * (indicated by having a type descriptor of length 1).
       */
      if (pathSplit[endIndex].length > 1) continue;

      const points = pathSplit.slice(startIndex, endIndex);

      /**
       * Multi-segmented sliders DON'T contain the end point
       * as part of the current segment as it's assumed to be the start of the next segment.
       * The start of the next segment is the index after the type descriptor.
       */
      const endPoint = endIndex < pathSplit.length - 1 ? pathSplit[endIndex + 1] : null;
      const convertedPoints = HitObjectHandler.convertPoints(points, endPoint, isFirst, offset);

      for (const point of convertedPoints) {
        controlPoints.push(...point);
      }

      startIndex = endIndex;
      isFirst = false;
    }

    if (endIndex > startIndex) {
      const points = pathSplit.slice(startIndex, endIndex);
      const convertedPoints = HitObjectHandler.convertPoints(points, null, isFirst, offset);

      for (const point of convertedPoints) {
        controlPoints.push(...point);
      }
    }

    return controlPoints;
  }

  /**
   * Converts a given point list into a set of path segments.
   * @param points The point list.
   * @param endPoint Any extra endpoint to consider as part of the points.
   * @param isFisrt Whether this is the first segment in the set. 
   * If true the first of the returned segments will contain a zero point.
   * @param offset The positional offset to apply to the control points.
   * @returns The set of points contained by point list as one or more segments of the path, 
   * prepended by an extra zero point if isFirst is true.
   */
  static *convertPoints(
    points: string[],
    endPoint: string | null,
    isFirst: boolean,
    offset: Vector2
  ): Generator<PathPoint[]> {
    // First control point is zero for the first segment.
    const readOffset = isFirst ? 1 : 0;

    // Extra length if an endpoint is given that lies outside the base point span.
    const endPointLength = endPoint !== null ? 1 : 0;

    const vertices: PathPoint[] = [];

    // Fill any non-read points.
    if (readOffset === 1) {
      vertices[0] = new PathPoint();
    }

    // Parse into control points.
    for (let i = 1; i < points.length; ++i) {
      vertices[readOffset + i - 1] = readPoint(points[i], offset);
    }

    // If an endpoint is given, add it to the end.
    if (endPoint !== null) {
      vertices[vertices.length - 1] = readPoint(endPoint, offset);
    }

    let type: PathType = HitObjectHandler.convertPathType(points[0]);

    // Edge-case rules (to match stable).
    if (type === PathType.PerfectCurve) {
      if (vertices.length !== 3) {
        type = PathType.Bezier;
      }
      else if (isLinear(vertices)) {
        // osu!stable special-cased colinear perfect curves to a linear path
        type = PathType.Linear;
      }
    }

    // The first control point must have a definite type.
    vertices[0].type = type;

    /**
     * A path can have multiple implicit segments of the same type 
     * if there are two sequential control points with the same position.
     * To handle such cases, this code may return multiple path segments 
     * with the final control point in each segment having a non-null type.
     * 
     * For the point string X|1:1|2:2|2:2|3:3, this code returns the segments:
     *  X: { (1, 1), (2, 2) }
     *  X: { (3, 3) }
     * 
     * Note: (2, 2) is not returned in the second segments, as it is implicit in the path.
     */
    let startIndex = 0;
    let endIndex = 0;

    while (++endIndex < vertices.length - endPointLength) {
      // Keep incrementing while an implicit segment doesn't need to be started
      if (!vertices[endIndex].position.equals(vertices[endIndex - 1].position)) {
        continue;
      }

      // The last control point of each segment is not allowed to start a new implicit segment.
      if (endIndex === vertices.length - endPointLength - 1) {
        continue;
      }

      // Force a type on the last point, and return the current control point set as a segment.
      vertices[endIndex - 1].type = type;

      yield vertices.slice(startIndex, endIndex);

      // Skip the current control point - as it's the same as the one that's just been returned.
      startIndex = endIndex + 1;
    }

    if (endIndex > startIndex) {
      yield vertices.slice(startIndex, endIndex);
    }

    function readPoint(point: string, offset: Vector2): PathPoint {
      const coords = point.split(':').map((v) => +v.trim());
      const pos = new Vector2(coords[0], coords[1]).subtract(offset);

      return new PathPoint(pos);
    }

    function isLinear(p: PathPoint[]): boolean {
      const yx = (p[1].position.y - p[0].position.y) * (p[2].position.x - p[0].position.x);
      const xy = (p[1].position.x - p[0].position.x) * (p[2].position.y - p[0].position.y);

      return Math.abs(yx - xy) < 0.001;
    }
  }

  static convertPathType(type: string): PathType {
    switch (type) {
      default:
      case 'C':
        return PathType.Catmull;

      case 'B':
        return PathType.Bezier;

      case 'L':
        return PathType.Linear;

      case 'P':
        return PathType.PerfectCurve;
    }
  }

  /**
   * Rewrites a sample bank with hit sample data.
   * @param line A line with hit sample data.  
   * @param bank A sample bank.
   * @returns The link to the same sample bank.
   */
  static rewriteSampleBank(line: string, bank: SampleBank): SampleBank {
    // normalSet:additionSet:index:volume:filename

    const set = line.split(':').map((v) => v.trim());

    switch (set.length) {
      case 5:
        bank.filename = set[4];
      case 4:
        bank.volume = parseInt(set[3]);
      case 3:
        bank.customIndex = parseInt(set[2]);
    }

    const normalSet = parseInt(set[0]);
    const additionSet = parseInt(set[1]);

    bank.normalSet = normalSet;
    bank.additionSet = additionSet || normalSet;

    return bank;
  }

  /**
   * Creates a list of basic hit object samples.
   * @param rewritable A line with rewritable hit sample data.
   * @param hitSound Hit sound data.
   * @param bank A sample bank.
   * @returns A new list of samples.
   */
  static getDefaultSamples(
    rewritable: string,
    hitSound: HitSound,
    bank: SampleBank
  ): HitSample[] {
    // Rewrite default sample bank.
    HitObjectHandler.rewriteSampleBank(rewritable, bank);

    return HitObjectHandler.getHitSamples(hitSound, bank);
  }

  /**
   * Creates a list of hit samples for every node of a hit object.
   * @param rewritable A list of rewritable data for every node.
   * @param nodes Amount of nodes.
   * @param hitSound Hit sound data.
   * @param bank A sample bank.
   * @returns A new list of node samples.
   */
  static getNodeSamples(
    rewritable: string[],
    nodes: number,
    hitSound: HitSound,
    bank: SampleBank
  ): HitSample[][] {
    /**
     * Populate node sound types and node sample banks 
     * with the default hit object values.
     */
    const nodeSounds: HitSound[] = [];
    const nodeBanks: SampleBank[] = [];

    for (let i = 0; i < nodes; ++i) {
      nodeSounds.push(hitSound);
      nodeBanks.push(bank.clone());
    }

    const adds = (rewritable[0] && rewritable[0].split('|')) || [];
    const sets = (rewritable[1] && rewritable[1].split('|')) || [];

    // Read any per-node sample banks & sound types.
    for (let i = 0; i < nodes; ++i) {
      if (i >= adds.length && i >= sets.length) {
        break;
      }

      if (i < adds.length) {
        nodeSounds[i] = parseInt(adds[i]);
      }

      if (i < sets.length) {
        HitObjectHandler.rewriteSampleBank(sets[i], nodeBanks[i]);
      }
    }

    // Generate the final per-node samples
    const nodeSamples: HitSample[][] = [];
    let samples: HitSample[];

    for (let i = 0; i < nodes; ++i) {
      samples = HitObjectHandler.getHitSamples(nodeSounds[i], nodeBanks[i]);

      nodeSamples.push(samples);
    }

    return nodeSamples;
  }

  /**
   * Creates a list of hit samples based on sample bank and hit sound data. 
   * @param hitSound Hit sound data.
   * @param bank A sample bank.
   * @returns A list of hit samples.
   */
  static getHitSamples(hitSound: HitSound, bank: SampleBank): HitSample[] {
    const samples: HitSample[] = [];

    if (bank.filename) {
      const hitSample = new HitSample();

      hitSample.filename = bank.filename;
      hitSample.volume = bank.volume;

      samples.push(hitSample);

      return samples;
    }

    samples.push(HitObjectHandler.getNormalSample(hitSound, bank));

    if (hitSound & HitSound.Finish) {
      samples.push(HitObjectHandler.getAdditionSample(HitSound.Finish, bank));
    }

    if (hitSound & HitSound.Whistle) {
      samples.push(HitObjectHandler.getAdditionSample(HitSound.Whistle, bank));
    }

    if (hitSound & HitSound.Clap) {
      samples.push(HitObjectHandler.getAdditionSample(HitSound.Clap, bank));
    }

    return samples;
  }

  /**
   * Creates a new hit sample based on the sample bank and hit sound type.
   * This is only used with the normal hit sound.
   * @param hitSound Hit sound data.
   * @param bank A sample bank.
   * @returns A new hit sample.
   */
  static getNormalSample(hitSound: HitSound, bank: SampleBank): HitSample {
    const hitSample = new HitSample();

    const sampleSetName = SampleSet[bank.normalSet];

    if (sampleSetName) {
      hitSample.sampleSet = sampleSetName;
    }

    hitSample.volume = bank.volume;
    hitSample.customIndex = bank.customIndex;

    if (bank.customIndex >= 2) {
      hitSample.suffix = bank.customIndex.toString();
    }

    /**
     * If the sound type doesn't have the Normal flag set,
     * attach it anyway as a layered sample.
     * None also counts as a normal non-layered sample.
     */
    hitSample.isLayered =
      hitSound !== HitSound.None && !(hitSound & HitSound.Normal);

    return hitSample;
  }

  /**
   * Creates a new hit sample based on the sample bank and hit sound type.
   * This is used with all types of the hit sound except normal.
   * @param hitSound Hit sound data.
   * @param bank A sample bank.
   * @returns A new hit sample.
   */
  static getAdditionSample(hitSound: HitSound, bank: SampleBank): HitSample {
    const hitSample = new HitSample();

    const hitSoundName = HitSound[hitSound];
    const sampleSetName = SampleSet[bank.additionSet];

    if (hitSoundName) {
      hitSample.hitSound = hitSoundName;
    }

    if (sampleSetName) {
      hitSample.sampleSet = sampleSetName;
    }

    hitSample.volume = bank.volume;
    hitSample.customIndex = bank.customIndex;

    return hitSample;
  }
}
