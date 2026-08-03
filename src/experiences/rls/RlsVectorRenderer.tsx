import type { CSSProperties, ReactNode } from "react";
import vectorDataJson from "./vector-scenes.json";
import styles from "./rls.module.css";

type RlsVectorStep = 1 | 2 | 3 | 4;
type RlsVectorPopup = "amplifier" | "roadm1" | "roadm2" | "roadm3" | "roadm4";

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
  background?: { color?: string };
  backgroundHasBeenSet?: boolean;
  border?: { radius?: number | string; width?: number; color?: string };
  animations?: VectorAnimation[];
  shape?: string;
  path?: Array<{ x: number; y: number }>;
  isClosedPath?: boolean;
  textContent?: string;
  textSpans?: Array<{ index: number; length: number; fontColor?: string }>;
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
    steps: Record<`${RlsVectorStep}`, HierarchyNode[]>;
    popups: Record<RlsVectorPopup, HierarchyNode[]>;
  };
  components: Record<string, VectorComponent>;
  assets: Record<string, string>;
};

type SvgMotionStyle = CSSProperties & {
  "--svg-delay"?: string;
  "--svg-duration"?: string;
};

const vectorData = vectorDataJson as VectorSceneData;

const motionClasses: Record<string, string> = {
  fadeIn: styles.svgFadeIn,
  fadeLeft: styles.svgFadeLeft,
  fadeRight: styles.svgFadeRight,
  fadeUp: styles.svgFadeUp,
  enlarge: styles.svgEnlarge,
  scaleUpTop: styles.svgScaleTop,
  scaleUpBottom: styles.svgScaleBottom,
  scaleUpVerticalTop: styles.svgScaleVerticalTop,
  scaleUpVerticalBottom: styles.svgScaleVerticalBottom,
  scaleUpVerticalCenter: styles.svgScaleVerticalCenter,
  scaleUpHorizontalRight: styles.svgScaleHorizontalRight,
  scaleUpHorizontalLeft: styles.svgScaleHorizontalLeft,
  scaleUpRight: styles.svgScaleHorizontalRight,
  scaleUpLeft: styles.svgScaleHorizontalLeft,
  shiftUp: styles.svgShiftUp,
  shiftDown: styles.svgShiftDown,
};

function motionProps(component: VectorComponent) {
  const animations = component.animations ?? [];
  if (animations.some((animation) => animation.type === "flash") && animations.some((animation) => animation.type === "fadeOut")) {
    const first = animations[0];
    return {
      className: styles.svgIndicatorSequence,
      style: {
        "--svg-delay": `${first?.delay ?? 0}s`,
        "--svg-duration": `${animations.reduce((total, animation) => total + animation.duration + animation.delay, 0)}s`,
      } as SvgMotionStyle,
    };
  }
  const animation = animations[0];
  if (!animation) return { className: undefined, style: undefined };
  return {
    className: motionClasses[animation.type] ?? styles.svgFadeIn,
    style: {
      "--svg-delay": `${animation.delay}s`,
      "--svg-duration": `${animation.duration}s`,
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
  const fill = component.background?.color ?? "none";
  const stroke = component.border?.color ?? "none";
  const strokeWidth = stroke === "none" ? 0 : component.border?.width ?? 0;
  const radius = component.border?.radius ?? 0;
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
  const points = (component.path ?? []).map((point) => `${point.x},${point.y}`).join(" ");
  return (
    <polyline
      fill={component.isClosedPath ? component.background?.color ?? "transparent" : "none"}
      points={points}
      stroke={component.border?.color ?? "#323E48"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={component.border?.width ?? 1}
    />
  );
}

function VectorImage({ component }: { component: VectorComponent }) {
  const href = component.image ? vectorData.assets[component.image] : undefined;
  if (!href) return null;
  if (href.endsWith("/circle-icon.svg")) {
    return (
      <ellipse
        cx={(component.width ?? 0) / 2}
        cy={(component.height ?? 0) / 2}
        fill={component.background?.color ?? "#F18A00"}
        rx={(component.width ?? 0) / 2}
        ry={(component.height ?? 0) / 2}
      />
    );
  }
  return (
    <image
      height={component.height ?? 0}
      href={href}
      preserveAspectRatio={component.preserveAspectRatio === false ? "none" : "xMidYMid meet"}
      width={component.width ?? 0}
    />
  );
}

function VectorText({ component }: { component: VectorComponent }) {
  const defaultSpan = component.defaultSpan ?? {};
  const spanColor = component.textSpans?.[0]?.fontColor;
  const isRegular = defaultSpan.variantGuid?.includes("fc58c99a");
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
    color: spanColor ?? defaultSpan.fontColor ?? "#000000",
    fontFamily: '"Aktiv Grotesk", Arial, Helvetica, sans-serif',
    fontSize: defaultSpan.fontSize ?? 12,
    fontWeight: isRegular ? 400 : 700,
    letterSpacing: defaultSpan.letterSpacing ?? 0,
    lineHeight: `${component.leading ?? (defaultSpan.fontSize ?? 12) * 1.2}px`,
    textAlign: component.justify ?? "left",
    textDecoration: defaultSpan.underline ? "underline" : undefined,
    whiteSpace: "pre-wrap",
  };
  return (
    <foreignObject height={component.height ?? 0} overflow={component.showOverflow ? "visible" : "hidden"} width={component.width ?? 0}>
      <div style={textStyle}>{component.textContent ?? ""}</div>
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
  if (!component || (!forceVisible && component.visible === false) || component.type === "hotspot-component") return null;

  const children = [...(node.items ?? [])].reverse().map((child) => renderNode(child));
  const isContainer = component.type === "folder" || component.type === "group";
  const borderOffset = component.type === "shape-component" && component.border?.color
    ? component.border.width ?? 0
    : 0;
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
    scaleX !== 1 || scaleY !== 1 ? `translate(${scaleX < 0 ? width : 0} ${scaleY < 0 ? height : 0}) scale(${scaleX} ${scaleY})` : "",
  ].filter(Boolean).join(" ");
  const motion = motionProps(component);

  return (
    <g data-ceros-component={component.id} key={component.id} opacity={component.opacity ?? 1} transform={transform || undefined}>
      <g className={motion.className} style={motion.style}>
        {isContainer ? children : componentGraphic(component)}
      </g>
    </g>
  );
}

function VectorScene({ className, forceTopLevelVisible = false, nodes, sceneName }: { className?: string; forceTopLevelVisible?: boolean; nodes: HierarchyNode[]; sceneName: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`${styles.vectorScene} ${className ?? ""}`}
      data-native-svg="true"
      data-vector-components={nodes.reduce((total, node) => total + (node.items?.length ?? 1), 0)}
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

export function RlsVectorBase() {
  return <VectorScene className={styles.vectorBase} nodes={vectorData.scenes.base} sceneName="base" />;
}

export function RlsVectorStepLayer({ step }: { step: RlsVectorStep }) {
  return <VectorScene className={styles.vectorStep} nodes={vectorData.scenes.steps[`${step}`]} sceneName={`step-${step}`} />;
}

export function RlsVectorPopupLayer({ popup }: { popup: RlsVectorPopup }) {
  return <VectorScene className={styles.vectorPopup} forceTopLevelVisible nodes={vectorData.scenes.popups[popup]} sceneName={popup} />;
}
