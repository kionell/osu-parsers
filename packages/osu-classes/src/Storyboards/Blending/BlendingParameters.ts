import { BlendingEquation } from './BlendingEquation';
import { BlendEquationMode } from './BlendingEquationMode';
import { BlendingFactorDest } from './BlendingFactorDest';
import { BlendingFactorSrc } from './BlendingFactorSrc';
import { BlendingType } from './BlendingType';

/**
 * Contains information about how a drawable should be blended into its destination.
 */
export class BlendingParameters {
  /**
   * The blending factor for the source color of the blend.
   */
  source: BlendingType;

  /**
   * The blending factor for the destination color of the blend.
   */
  destination: BlendingType;

  /**
   * The blending factor for the source alpha of the blend.
   */
  sourceAlpha: BlendingType;

  /**
   * The blending factor for the destination alpha of the blend.
   */
  destinationAlpha: BlendingType;

  /**
   * Gets or sets the blending equation to use for the RGB components of the blend.
   */
  rgbEquation: BlendingEquation;

  /**
   * Gets or sets the blending equation to use for the alpha component of the blend.
   */
  alphaEquation: BlendingEquation;

  static None = new BlendingParameters({
    source: BlendingType.One,
    destination: BlendingType.Zero,
    sourceAlpha: BlendingType.One,
    destinationAlpha: BlendingType.Zero,
    rgbEquation: BlendingEquation.Add,
    alphaEquation: BlendingEquation.Add,
  });

  static Inherit = new BlendingParameters({
    source: BlendingType.Inherit,
    destination: BlendingType.Inherit,
    sourceAlpha: BlendingType.Inherit,
    destinationAlpha: BlendingType.Inherit,
    rgbEquation: BlendingEquation.Inherit,
    alphaEquation: BlendingEquation.Inherit,
  });

  static Mixture = new BlendingParameters({
    source: BlendingType.SrcAlpha,
    destination: BlendingType.OneMinusSrcAlpha,
    sourceAlpha: BlendingType.One,
    destinationAlpha: BlendingType.One,
    rgbEquation: BlendingEquation.Add,
    alphaEquation: BlendingEquation.Add,
  });

  static Additive = new BlendingParameters({
    source: BlendingType.SrcAlpha,
    destination: BlendingType.One,
    sourceAlpha: BlendingType.One,
    destinationAlpha: BlendingType.One,
    rgbEquation: BlendingEquation.Add,
    alphaEquation: BlendingEquation.Add,
  });

  constructor(params: Partial<BlendingParameters>) {
    this.source = params.source || BlendingType.Inherit;
    this.destination = params.destination || BlendingType.Inherit;
    this.sourceAlpha = params.sourceAlpha || BlendingType.Inherit;
    this.destinationAlpha = params.destinationAlpha || BlendingType.Inherit;
    this.rgbEquation = params.rgbEquation || BlendingEquation.Inherit;
    this.alphaEquation = params.alphaEquation || BlendingEquation.Inherit;
  }

  /**
   * Copy all properties that are marked as inherited from a parent blending parameters object.
   * @param parent The parent blending parameters from which to copy inherited properties.
   */
  copyFromParent(parent: BlendingParameters): void {
    if (this.source === BlendingType.Inherit) {
      this.source = parent.source;
    }

    if (this.destination === BlendingType.Inherit) {
      this.destination = parent.destination;
    }

    if (this.sourceAlpha === BlendingType.Inherit) {
      this.sourceAlpha = parent.sourceAlpha;
    }

    if (this.destinationAlpha === BlendingType.Inherit) {
      this.destinationAlpha = parent.destinationAlpha;
    }

    if (this.rgbEquation === BlendingEquation.Inherit) {
      this.rgbEquation = parent.rgbEquation;
    }

    if (this.alphaEquation === BlendingEquation.Inherit) {
      this.alphaEquation = parent.alphaEquation;
    }
  }

  /**
   * Any properties marked as inherited will have their 
   * blending mode changed to the default type. 
   * This can occur when a root element is set to inherited.
   */
  applyDefaultToInherited(): void {
    if (this.source === BlendingType.Inherit) {
      this.source = BlendingType.SrcAlpha;
    }

    if (this.destination === BlendingType.Inherit) {
      this.destination = BlendingType.OneMinusSrcAlpha;
    }

    if (this.sourceAlpha === BlendingType.Inherit) {
      this.sourceAlpha = BlendingType.One;
    }

    if (this.destinationAlpha === BlendingType.Inherit) {
      this.destinationAlpha = BlendingType.One;
    }

    if (this.rgbEquation === BlendingEquation.Inherit) {
      this.rgbEquation = BlendingEquation.Add;
    }

    if (this.alphaEquation === BlendingEquation.Inherit) {
      this.alphaEquation = BlendingEquation.Add;
    }
  }

  equals(other: BlendingParameters): boolean {
    return other.source === this.source
      && other.destination === this.destination
      && other.sourceAlpha === this.sourceAlpha
      && other.destinationAlpha === this.destinationAlpha
      && other.rgbEquation === this.rgbEquation
      && other.alphaEquation === this.alphaEquation;
  }

  get isDisabled(): boolean {
    return this.source === BlendingType.One
      && this.destination === BlendingType.Zero
      && this.sourceAlpha === BlendingType.One
      && this.destinationAlpha === BlendingType.Zero
      && this.rgbEquation === BlendingEquation.Add
      && this.alphaEquation === BlendingEquation.Add;
  }

  /**
   * Gets the blending equation mode for the currently specified RGB Equation.
   */
  get rgbEquationMode(): BlendEquationMode {
    return BlendingParameters._translateEquation(this.rgbEquation);
  }

  /**
   * Gets the blending equation mode for the currently specified Alpha Equation.
   */
  get alphaEquationMode(): BlendEquationMode {
    return BlendingParameters._translateEquation(this.alphaEquation);
  }

  /**
   * Gets the blending factor source for the currently specified source blending mode.
   */
  get sourceBlendingFactor(): BlendingFactorSrc {
    return BlendingParameters._translateBlendingFactorSrc(this.source);
  }

  /**
   * Gets the blending factor destination for the currently specified destination blending mode.
   */
  get destinationBlendingFactor(): BlendingFactorDest {
    return BlendingParameters._translateBlendingFactorDest(this.destination);
  }

  /**
   * Gets the blending factor source for the currently specified source alpha mode.
   */
  get sourceAlphaBlendingFactor(): BlendingFactorSrc {
    return BlendingParameters._translateBlendingFactorSrc(this.sourceAlpha);
  }

  /**
   * Gets the blending factor destination for the currently specified destination alpha mode.
   */
  get destinationAlphaBlendingFactor(): BlendingFactorDest {
    return BlendingParameters._translateBlendingFactorDest(this.destinationAlpha);
  }

  private static _translateBlendingFactorSrc(factor: BlendingType): BlendingFactorSrc {
    switch (factor) {
      case BlendingType.ConstantAlpha:
        return BlendingFactorSrc.ConstantAlpha;

      case BlendingType.ConstantColor:
        return BlendingFactorSrc.ConstantColor;

      case BlendingType.DstAlpha:
        return BlendingFactorSrc.DstAlpha;

      case BlendingType.DstColor:
        return BlendingFactorSrc.DstColor;

      case BlendingType.One:
        return BlendingFactorSrc.One;

      case BlendingType.OneMinusConstantAlpha:
        return BlendingFactorSrc.OneMinusConstantAlpha;

      case BlendingType.OneMinusConstantColor:
        return BlendingFactorSrc.OneMinusConstantColor;

      case BlendingType.OneMinusDstAlpha:
        return BlendingFactorSrc.OneMinusDstAlpha;

      case BlendingType.OneMinusDstColor:
        return BlendingFactorSrc.OneMinusDstColor;

      case BlendingType.OneMinusSrcAlpha:
        return BlendingFactorSrc.OneMinusSrcColor;

      case BlendingType.SrcAlpha:
        return BlendingFactorSrc.SrcAlpha;

      case BlendingType.SrcAlphaSaturate:
        return BlendingFactorSrc.SrcAlphaSaturate;

      case BlendingType.SrcColor:
        return BlendingFactorSrc.SrcColor;

      default:
      case BlendingType.Zero:
        return BlendingFactorSrc.Zero;
    }
  }

  private static _translateBlendingFactorDest(factor: BlendingType): BlendingFactorDest {
    switch (factor) {
      case BlendingType.ConstantAlpha:
        return BlendingFactorDest.ConstantAlpha;

      case BlendingType.ConstantColor:
        return BlendingFactorDest.ConstantColor;

      case BlendingType.DstAlpha:
        return BlendingFactorDest.DstAlpha;

      case BlendingType.DstColor:
        return BlendingFactorDest.DstColor;

      case BlendingType.One:
        return BlendingFactorDest.One;

      case BlendingType.OneMinusConstantAlpha:
        return BlendingFactorDest.OneMinusConstantAlpha;

      case BlendingType.OneMinusConstantColor:
        return BlendingFactorDest.OneMinusConstantColor;

      case BlendingType.OneMinusDstAlpha:
        return BlendingFactorDest.OneMinusDstAlpha;

      case BlendingType.OneMinusDstColor:
        return BlendingFactorDest.OneMinusDstColor;

      case BlendingType.OneMinusSrcAlpha:
        return BlendingFactorDest.OneMinusSrcAlpha;

      case BlendingType.OneMinusSrcColor:
        return BlendingFactorDest.OneMinusSrcColor;

      case BlendingType.SrcAlpha:
        return BlendingFactorDest.SrcAlpha;

      case BlendingType.SrcAlphaSaturate:
        return BlendingFactorDest.SrcAlphaSaturate;

      case BlendingType.SrcColor:
        return BlendingFactorDest.SrcColor;

      default:
      case BlendingType.Zero:
        return BlendingFactorDest.Zero;
    }
  }

  private static _translateEquation(equation: BlendingEquation): BlendEquationMode {
    switch (equation) {
      default:
      case BlendingEquation.Inherit:
      case BlendingEquation.Add:
        return BlendEquationMode.FuncAdd;

      case BlendingEquation.Min:
        return BlendEquationMode.Min;

      case BlendingEquation.Max:
        return BlendEquationMode.Max;

      case BlendingEquation.Subtract:
        return BlendEquationMode.FuncSubtract;

      case BlendingEquation.ReverseSubtract:
        return BlendEquationMode.FuncReverseSubtract;
    }
  }
}
