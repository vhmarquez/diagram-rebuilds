"use client";
/* eslint-disable @next/next/no-img-element -- source images are pre-sized, local, and must preserve Ceros' exact DOM geometry */

import type { CSSProperties, ReactNode } from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import renderDataJson from "./render-data.json";
import runtimeAssetsJson from "./runtime-assets.json";
import styles from "./timeline.module.css";

const STAGE_WIDTH = 1280;
// Ceros renders this experience against its published 4,500px height override.
const STAGE_HEIGHT = 4500;

type HierarchyItem = { id: string; items?: HierarchyItem[] };
type TextSpan = {
  index?: number;
  length?: number;
  fontColor?: string;
  fontSize?: number;
  letterSpacing?: number;
  underline?: boolean;
  variantGuid?: string;
};
type Component = {
  id: string;
  type: string;
  title?: string;
  visible?: boolean;
  x?: number;
  y?: number;
  width?: number | null;
  height?: number | null;
  opacity?: number;
  rotation?: number;
  background?: { color?: string; type?: string } | unknown[];
  border?: { radius?: number; width?: number; color?: string; style?: string } | unknown[];
  animations?: Array<{ duration?: number; delay?: number; easing?: string; type?: string }>;
  image?: string;
  altText?: string;
  textContent?: string;
  textSpans?: TextSpan[];
  defaultSpan?: TextSpan;
  justify?: CSSProperties["textAlign"];
  leading?: number;
  textTransform?: CSSProperties["textTransform"];
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
};
type RenderData = {
  artboard: { width: number; height: number; scaleHeight: number };
  hierarchy: HierarchyItem[];
  components: Record<string, Component>;
};
type RuntimeAssets = {
  assets: Array<{ id: string; path: string }>;
  fonts: Array<{ weight: number; path: string }>;
};

const renderData = renderDataJson as RenderData;
const runtimeAssets = runtimeAssetsJson as RuntimeAssets;
const assetPaths = new Map(
  runtimeAssets.assets.map((asset) => [asset.id, asset.path]),
);

function weightForGuid(guid?: string) {
  if (guid?.includes("67871a57")) return 700;
  if (guid?.includes("3da741ab")) return 300;
  return 400;
}

function spanStyle(span: TextSpan = {}): CSSProperties {
  return {
    color: span.fontColor,
    fontSize: span.fontSize,
    fontWeight: weightForGuid(span.variantGuid),
    letterSpacing:
      typeof span.letterSpacing === "number" ? `${span.letterSpacing}px` : undefined,
    textDecoration: span.underline ? "underline" : undefined,
  };
}

function renderTextSpans(component: Component) {
  const text = component.textContent ?? "";
  const overrides = component.textSpans ?? [];
  const boundaries = new Set([0, text.length]);

  for (const span of overrides) {
    const start = span.index ?? 0;
    boundaries.add(start);
    boundaries.add(Math.min(text.length, start + (span.length ?? 0)));
  }

  const points = [...boundaries].sort((a, b) => a - b);

  return points.slice(0, -1).map((start, index) => {
    const end = points[index + 1];
    const active = overrides.filter((span) => {
      const spanStart = span.index ?? 0;
      return start >= spanStart && start < spanStart + (span.length ?? 0);
    });
    const merged = Object.assign({}, component.defaultSpan, ...active);

    return (
      <span key={`${component.id}-${start}`} style={spanStyle(merged)}>
        {text.slice(start, end)}
      </span>
    );
  });
}

function positionStyle(component: Component): CSSProperties {
  const border = Array.isArray(component.border) ? undefined : component.border;
  return {
    position: "absolute",
    left: component.x ?? 0,
    top: component.y ?? 0,
    width: component.width ?? undefined,
    height: component.height ?? undefined,
    opacity: component.opacity ?? 1,
    transform: component.rotation ? `rotate(${component.rotation}deg)` : undefined,
    transformOrigin: "center",
    borderRadius: border?.radius ?? 0,
  };
}

function renderComponent(item: HierarchyItem): ReactNode {
  const component = renderData.components[item.id];

  if (!component || component.visible === false || component.type === "hotspot-component") {
    return null;
  }

  const children = item.items
    ?.slice()
    .reverse()
    .map((child) => <Fragment key={child.id}>{renderComponent(child)}</Fragment>);

  if (component.type === "folder") {
    return children;
  }

  if (component.type === "group") {
    const hasFadeDown = component.animations?.some(
      (animation) => animation.type === "fadeDown",
    );
    return (
      <div
        className={hasFadeDown ? styles.fadeDown : undefined}
        data-ceros-id={component.id}
        style={positionStyle(component)}
      >
        {children}
      </div>
    );
  }

  if (component.type === "shape-component") {
    const background = Array.isArray(component.background)
      ? undefined
      : component.background;
    const border = Array.isArray(component.border) ? undefined : component.border;
    return (
      <div
        aria-hidden="true"
        data-ceros-id={component.id}
        style={{
          ...positionStyle(component),
          background: background?.color,
          border:
            border?.width && border.color
              ? `${border.width}px ${border.style ?? "solid"} ${border.color}`
              : undefined,
        }}
      />
    );
  }

  if (component.type === "image-component") {
    const source = component.image ? assetPaths.get(component.image) : undefined;
    if (!source) return null;
    return (
      <img
        alt={component.altText ?? ""}
        data-ceros-id={component.id}
        decoding="async"
        draggable={false}
        loading="eager"
        src={source}
        style={{ ...positionStyle(component), objectFit: "cover" }}
      />
    );
  }

  if (component.type === "text-component") {
    return (
      <div
        data-ceros-id={component.id}
        style={{
          ...positionStyle(component),
          fontFamily: '"Aktiv Grotesk", Arial, sans-serif',
          lineHeight: component.leading ? `${component.leading}px` : undefined,
          padding: `${component.paddingTop ?? 0}px ${component.paddingRight ?? 0}px ${component.paddingBottom ?? 0}px ${component.paddingLeft ?? 0}px`,
          textAlign: component.justify,
          textTransform: component.textTransform,
          whiteSpace: "pre-wrap",
        }}
      >
        {renderTextSpans(component)}
      </div>
    );
  }

  return null;
}

export function TimelineExperience() {
  const [scale, setScale] = useState(720 / STAGE_HEIGHT);
  const hierarchy = useMemo(
    () => renderData.hierarchy.slice().reverse(),
    [],
  );

  useEffect(() => {
    const fitStage = () => {
      setScale(
        Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT),
      );
    };

    const initialFrame = window.requestAnimationFrame(fitStage);
    window.addEventListener("resize", fitStage);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("resize", fitStage);
    };
  }, []);

  const fontCss = runtimeAssets.fonts
    .map(
      (font) =>
        `@font-face{font-family:"Aktiv Grotesk";src:url("${font.path}") format("woff");font-style:normal;font-weight:${font.weight};font-display:swap;}`,
    )
    .join("");

  return (
    <main
      aria-label="Ciena company timeline, 1992 to 2025"
      className={styles.viewer}
    >
      <style>{fontCss}</style>
      <div
        className={styles.stage}
        data-experience="ciena-timeline"
        style={{ "--timeline-scale": scale } as CSSProperties}
      >
        {hierarchy.map((item) => (
          <Fragment key={item.id}>{renderComponent(item)}</Fragment>
        ))}
      </div>
    </main>
  );
}
