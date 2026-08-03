import type { CSSProperties, ReactNode } from "react";
import vectorDataJson from "./vector-scenes.json";
import styles from "./liquid-spectrum.module.css";

export type LiquidSpectrumPhase =
  | "liquidSpectrum"
  | "optimization"
  | "operations"
  | "delivery"
  | "planning";

export type LiquidSpectrumFeature =
  | "planningToolCalibrator"
  | "bandwidthOptimizer"
  | "pinPointOtdr"
  | "channelMarginGauge"
  | "photonicPerformanceGauge"
  | "liquidRestoration"
  | "spectrumDefragmentation"
  | "snrOptimizer";

export type LiquidSpectrumFeaturePhase =
  | "optimization"
  | "operations"
  | "delivery"
  | "planning";

type HierarchyNode = {
  id: string;
  items?: HierarchyNode[];
};

type VectorAnimation = {
  type: string;
  duration: number;
  delay: number;
  easing?: string;
};

type VectorPaint = { color?: string } | unknown[];

type VectorTextSpan = {
  index: number;
  length: number;
  fontColor?: string;
  fontSize?: number;
  variantGuid?: string;
  letterSpacing?: number;
  underline?: boolean;
};

type VectorComponent = {
  id: string;
  type: string;
  title?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  rotation?: number;
  visible?: boolean;
  background?: VectorPaint;
  backgroundHasBeenSet?: boolean;
  border?: { radius?: number | string; width?: number; color?: string } | unknown[];
  shadow?: { color?: string; x?: number; y?: number; blur?: number } | unknown[];
  animations?: VectorAnimation[];
  shape?: string;
  path?: Array<{ x: number; y: number }>;
  isClosedPath?: boolean;
  textContent?: string;
  textSpans?: VectorTextSpan[];
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  defaultSpan?: {
    fontColor?: string;
    fontSize?: number;
    variantGuid?: string;
    letterSpacing?: number;
    underline?: boolean;
  };
  justify?: "left" | "center" | "right";
  leading?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  showOverflow?: boolean;
  image?: string;
  contentType?: string;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  preserveAspectRatio?: boolean;
  blendingMode?: string;
};

type VectorSceneData = {
  width: number;
  height: number;
  canvasOffsetY: number;
  scenes: {
    base: HierarchyNode[];
    dimmers: Record<LiquidSpectrumFeaturePhase, HierarchyNode[]>;
    phases: Record<LiquidSpectrumPhase, HierarchyNode[]>;
    features: Record<LiquidSpectrumFeature, HierarchyNode[]>;
  };
  components: Record<string, VectorComponent>;
  assets: Record<string, string>;
};

type SvgMotionStyle = CSSProperties & {
  "--svg-delay"?: string;
  "--svg-duration"?: string;
  "--svg-easing"?: string;
};

const vectorData = vectorDataJson as VectorSceneData;

const motionClasses: Record<string, string> = {
  fadeIn: styles.svgFadeIn,
  fadeDown: styles.svgFadeDown,
  fadeLeft: styles.svgFadeLeft,
  fadeRight: styles.svgFadeRight,
  fadeUp: styles.svgFadeUp,
  enlarge: styles.svgEnlarge,
  slideLeft: styles.svgSlideLeft,
  scaleUpHorizontalCenter: styles.svgScaleHorizontalCenter,
  scaleUpHorizontalLeft: styles.svgScaleHorizontalLeft,
  scaleUpHorizontalRight: styles.svgScaleHorizontalRight,
  scaleUpVerticalBottom: styles.svgScaleVerticalBottom,
  scaleUpVerticalCenter: styles.svgScaleVerticalCenter,
  scaleUpVerticalTop: styles.svgScaleVerticalTop,
  spinRight: styles.svgSpinRight,
};

function paintColor(paint: VectorPaint | undefined) {
  return paint && !Array.isArray(paint) ? paint.color : undefined;
}

function borderValue(component: VectorComponent) {
  return component.border && !Array.isArray(component.border) ? component.border : undefined;
}

function shadowValue(component: VectorComponent) {
  return component.shadow && !Array.isArray(component.shadow) ? component.shadow : undefined;
}

function motionProps(component: VectorComponent) {
  const animation = component.animations?.[0];
  if (!animation) return { className: undefined, style: undefined };

  return {
    className: motionClasses[animation.type] ?? styles.svgFadeIn,
    style: {
      "--svg-delay": `${animation.delay}s`,
      "--svg-duration": `${animation.duration}s`,
      "--svg-easing": animation.easing ?? "ease",
    } as SvgMotionStyle,
  };
}

function roundedRectPath(width: number, height: number, radius: string) {
  const radii = radius.split(",").map((value) => Math.max(0, Number(value.trim()) || 0));
  const [topLeft = 0, topRight = topLeft, bottomRight = topLeft, bottomLeft = topRight] = radii;
  return [
    `M ${topLeft} 0`,
    `H ${width - topRight}`,
    topRight ? `Q ${width} 0 ${width} ${topRight}` : `L ${width} 0`,
    `V ${height - bottomRight}`,
    bottomRight ? `Q ${width} ${height} ${width - bottomRight} ${height}` : `L ${width} ${height}`,
    `H ${bottomLeft}`,
    bottomLeft ? `Q 0 ${height} 0 ${height - bottomLeft}` : `L 0 ${height}`,
    `V ${topLeft}`,
    topLeft ? `Q 0 0 ${topLeft} 0` : "L 0 0",
    "Z",
  ].join(" ");
}

function VectorShape({ component }: { component: VectorComponent }) {
  const width = component.width ?? 0;
  const height = component.height ?? 0;
  const border = borderValue(component);
  const fill = paintColor(component.background) ?? "none";
  const stroke = border?.color ?? "none";
  const strokeWidth = stroke === "none" ? 0 : border?.width ?? 0;
  const radius = border?.radius ?? 0;
  const shapeWidth = width + strokeWidth;
  const shapeHeight = height + strokeWidth;
  const shapeOffset = strokeWidth / 2;
  const numericRadius = Number(radius) || 0;
  const resolvedRadius = Math.min(numericRadius, shapeWidth / 2, shapeHeight / 2);

  if (component.shape === "circle") {
    return (
      <ellipse
        cx={(width + strokeWidth * 2) / 2}
        cy={(height + strokeWidth * 2) / 2}
        fill={fill}
        rx={shapeWidth / 2}
        ry={shapeHeight / 2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }

  if (typeof radius === "string" && radius.includes(",")) {
    return (
      <path
        d={roundedRectPath(shapeWidth, shapeHeight, radius)}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        transform={shapeOffset ? `translate(${shapeOffset} ${shapeOffset})` : undefined}
      />
    );
  }

  return (
    <rect
      fill={fill}
      height={shapeHeight}
      rx={resolvedRadius}
      ry={resolvedRadius}
      stroke={stroke}
      strokeWidth={strokeWidth}
      width={shapeWidth}
      x={shapeOffset}
      y={shapeOffset}
    />
  );
}

function VectorCustomShape({ component }: { component: VectorComponent }) {
  const border = borderValue(component);
  const points = (component.path ?? []).map((point) => `${point.x},${point.y}`).join(" ");
  return (
    <polyline
      fill={component.isClosedPath ? paintColor(component.background) ?? "transparent" : "none"}
      points={points}
      stroke={border?.color ?? "#373737"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={border?.width ?? 1}
    />
  );
}

function VectorImage({ component }: { component: VectorComponent }) {
  const href = component.image ? vectorData.assets[component.image] : undefined;
  const width = component.width ?? 0;
  const height = component.height ?? 0;
  const color = paintColor(component.background) ?? "#140729";

  if (!href && component.title === "plus_icon.svg") {
    return (
      <g fill="none" stroke={color} strokeLinecap="square" strokeWidth={Math.max(1.2, width / 14)}>
        <line x1={width * 0.31} x2={width * 0.69} y1={height / 2} y2={height / 2} />
        <line x1={width / 2} x2={width / 2} y1={height * 0.31} y2={height * 0.69} />
      </g>
    );
  }

  if (!href && component.title === "arrow_icon.svg") {
    if (component.image?.includes("2019-07-18")) {
      return (
        <polyline
          fill="none"
          points={`${width * 0.38},${height * 0.24} ${width * 0.64},${height / 2} ${width * 0.38},${height * 0.76}`}
          stroke={color}
          strokeLinecap="square"
          strokeLinejoin="miter"
          strokeWidth={Math.max(1, width / 15)}
        />
      );
    }
    return (
      <g fill="none" stroke={color} strokeLinecap="square" strokeLinejoin="miter" strokeWidth={Math.max(1, width / 15)}>
        <line x1={width * 0.16} x2={width * 0.76} y1={height / 2} y2={height / 2} />
        <polyline points={`${width * 0.58},${height * 0.28} ${width * 0.8},${height / 2} ${width * 0.58},${height * 0.72}`} />
      </g>
    );
  }

  if (!href && component.title === "caution_icon.svg") {
    return (
      <g fill="none" stroke={color} strokeLinejoin="round" strokeWidth={1.2}>
        <path d={`M ${width / 2} 1 L ${width - 1} ${height - 1} L 1 ${height - 1} Z`} />
        <line x1={width / 2} x2={width / 2} y1={height * 0.32} y2={height * 0.63} />
        <circle cx={width / 2} cy={height * 0.78} fill={color} r={0.8} stroke="none" />
      </g>
    );
  }

  if (!href) return null;

  return (
    <image
      height={component.height ?? 0}
      href={href}
      preserveAspectRatio={component.preserveAspectRatio === true ? "xMidYMid meet" : "none"}
      width={component.width ?? 0}
    />
  );
}

function fontWeightForVariant(variantGuid?: string) {
  if (variantGuid?.includes("67871a57") || variantGuid?.includes("703f2941")) return 700;
  return 400;
}

function resolvedLetterSpacing(value: number | undefined, fontSize: number) {
  if (!value) return 0;
  return `${(value / 1000) * fontSize}px`;
}

function textRuns(component: VectorComponent) {
  const text = component.id === "5f7e102fd8449" ? "Liquid Spectrum" : component.textContent ?? "";
  const spans = [...(component.textSpans ?? [])]
    .filter((span) => span.length > 0 && span.index < text.length)
    .sort((left, right) => left.index - right.index);

  if (!spans.length) return text;

  const runs: ReactNode[] = [];
  let cursor = 0;
  for (const [index, span] of spans.entries()) {
    const start = Math.max(cursor, span.index);
    const end = Math.min(text.length, span.index + span.length);
    if (start > cursor) runs.push(text.slice(cursor, start));
    if (end > start) {
      runs.push(
        <span
          key={`${span.index}-${index}`}
          style={{
            color: span.fontColor,
            fontSize: span.fontSize,
            fontWeight: fontWeightForVariant(span.variantGuid),
            letterSpacing: resolvedLetterSpacing(
              span.letterSpacing,
              span.fontSize ?? component.defaultSpan?.fontSize ?? 12,
            ),
            textDecoration: span.underline ? "underline" : undefined,
          }}
        >
          {text.slice(start, end)}
        </span>,
      );
    }
    cursor = Math.max(cursor, end);
  }
  if (cursor < text.length) runs.push(text.slice(cursor));
  return runs;
}

function VectorText({ component }: { component: VectorComponent }) {
  const defaultSpan = component.defaultSpan ?? {};
  const textStyle: CSSProperties = {
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    margin: 0,
    paddingTop: component.paddingTop ?? 0,
    paddingRight: component.paddingRight ?? 0,
    paddingBottom: component.paddingBottom ?? 0,
    paddingLeft: component.paddingLeft ?? 0,
    overflow: component.showOverflow ? "visible" : "hidden",
    color: defaultSpan.fontColor ?? "#373737",
    fontFamily: '"Aktiv Grotesk", Arial, Helvetica, sans-serif',
    fontSize: defaultSpan.fontSize ?? 12,
    fontWeight: fontWeightForVariant(defaultSpan.variantGuid),
    letterSpacing: resolvedLetterSpacing(
      defaultSpan.letterSpacing,
      defaultSpan.fontSize ?? 12,
    ),
    lineHeight: `${component.leading ?? (defaultSpan.fontSize ?? 12) * 1.2}px`,
    textAlign: component.justify ?? "left",
    textDecoration: defaultSpan.underline ? "underline" : undefined,
    textTransform: component.textTransform ?? "none",
    whiteSpace: "pre-wrap",
  };

  return (
    <foreignObject
      height={component.height ?? 0}
      overflow={component.showOverflow ? "visible" : "hidden"}
      width={component.width ?? 0}
    >
      <div style={textStyle}>{textRuns(component)}</div>
    </foreignObject>
  );
}

function componentGraphic(component: VectorComponent): ReactNode {
  if (component.type === "shape-component") return <VectorShape component={component} />;
  if (component.type === "custom-shape-component") return <VectorCustomShape component={component} />;
  if (component.type === "image-component") return <VectorImage component={component} />;
  if (component.type === "text-component") return <VectorText component={component} />;
  return null;
}

function renderNode(node: HierarchyNode, forceVisible = false): ReactNode {
  const component = vectorData.components[node.id];
  if (!component || (!forceVisible && component.visible === false) || component.type === "hotspot-component") {
    return null;
  }

  const children = [...(node.items ?? [])].reverse().map((child) => renderNode(child));
  const isContainer = component.type === "folder" || component.type === "group";
  const border = borderValue(component);
  const borderOffset = component.type === "shape-component" && border?.color ? border.width ?? 0 : 0;
  const x = (component.x ?? 0) - borderOffset;
  const y = (component.y ?? 0) - borderOffset;
  const width = component.width ?? 0;
  const height = component.height ?? 0;
  const rotation = component.rotation ?? 0;
  const scaleX = component.flipHorizontal ? -1 : 1;
  const scaleY = component.flipVertical ? -1 : 1;
  const transform = [
    `translate(${x} ${y})`,
    rotation ? `rotate(${rotation} ${width / 2} ${height / 2})` : "",
    scaleX !== 1 || scaleY !== 1
      ? `translate(${scaleX < 0 ? width : 0} ${scaleY < 0 ? height : 0}) scale(${scaleX} ${scaleY})`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const motion = motionProps(component);
  const shadow = shadowValue(component);
  const shadowStyle: CSSProperties | undefined = shadow?.color
    ? {
        filter: `drop-shadow(${shadow.x ?? 0}px ${shadow.y ?? 0}px ${shadow.blur ?? 0}px ${shadow.color})`,
      }
    : undefined;

  return (
    <g
      data-ceros-component={component.id}
      key={component.id}
      opacity={component.opacity ?? 1}
      style={shadowStyle}
      transform={transform || undefined}
    >
      <g className={motion.className} style={motion.style}>
        {isContainer ? children : componentGraphic(component)}
      </g>
    </g>
  );
}

function VectorScene({
  className,
  forceTopLevelVisible = false,
  nodes,
  sceneName,
}: {
  className?: string;
  forceTopLevelVisible?: boolean;
  nodes: HierarchyNode[];
  sceneName: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`${styles.vectorScene} ${className ?? ""}`}
      data-native-svg="true"
      data-vector-scene={sceneName}
      height={vectorData.height}
      preserveAspectRatio="none"
      viewBox={`0 0 ${vectorData.width} ${vectorData.height}`}
      width={vectorData.width}
    >
      <g transform={`translate(0 ${vectorData.canvasOffsetY})`}>
        {[...nodes].reverse().map((node) => renderNode(node, forceTopLevelVisible))}
      </g>
    </svg>
  );
}

export function LiquidSpectrumVectorBase() {
  return <VectorScene className={styles.vectorBase} nodes={vectorData.scenes.base} sceneName="base" />;
}

export function LiquidSpectrumVectorDimmers({
  selectedPhase,
}: {
  selectedPhase: LiquidSpectrumFeaturePhase;
}) {
  const nodes = (Object.keys(vectorData.scenes.dimmers) as LiquidSpectrumFeaturePhase[])
    .filter((phase) => phase !== selectedPhase)
    .flatMap((phase) => vectorData.scenes.dimmers[phase]);

  return (
    <VectorScene
      className={styles.vectorDimmer}
      forceTopLevelVisible
      nodes={nodes}
      sceneName={`dimmers-except-${selectedPhase}`}
    />
  );
}

export function LiquidSpectrumVectorPhase({ phase }: { phase: LiquidSpectrumPhase }) {
  return (
    <VectorScene
      className={styles.vectorOverlay}
      forceTopLevelVisible
      nodes={vectorData.scenes.phases[phase]}
      sceneName={`phase-${phase}`}
    />
  );
}

export function LiquidSpectrumVectorFeature({ feature }: { feature: LiquidSpectrumFeature }) {
  return (
    <VectorScene
      className={styles.vectorOverlay}
      forceTopLevelVisible
      nodes={vectorData.scenes.features[feature]}
      sceneName={`feature-${feature}`}
    />
  );
}
