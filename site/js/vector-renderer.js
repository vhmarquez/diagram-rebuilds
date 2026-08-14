import { siteUrl } from "./common.js";

const SVG_NS = "http://www.w3.org/2000/svg";

const motionClasses = {
  fadeIn: "svgFadeIn",
  fadeDown: "svgFadeDown",
  fadeLeft: "svgFadeLeft",
  fadeRight: "svgFadeRight",
  fadeUp: "svgFadeUp",
  enlarge: "svgEnlarge",
  slideLeft: "svgSlideLeft",
  scaleUpTop: "svgScaleTop",
  scaleUpBottom: "svgScaleBottom",
  scaleUpVerticalTop: "svgScaleVerticalTop",
  scaleUpVerticalBottom: "svgScaleVerticalBottom",
  scaleUpVerticalCenter: "svgScaleVerticalCenter",
  scaleUpHorizontalCenter: "svgScaleHorizontalCenter",
  scaleUpHorizontalRight: "svgScaleHorizontalRight",
  scaleUpHorizontalLeft: "svgScaleHorizontalLeft",
  scaleUpRight: "svgScaleHorizontalRight",
  scaleUpLeft: "svgScaleHorizontalLeft",
  shiftUp: "svgShiftUp",
  shiftDown: "svgShiftDown",
  spinRight: "svgSpinRight",
};

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null && value !== "") {
      element.setAttribute(name, String(value));
    }
  }
  return element;
}

function paintColor(paint) {
  return paint && !Array.isArray(paint) ? paint.color : undefined;
}

function objectValue(value) {
  return value && !Array.isArray(value) ? value : undefined;
}

function roundedRectPath(width, height, radius) {
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

export class VectorRenderer {
  constructor(data, mode) {
    this.data = data;
    this.mode = mode;
  }

  motion(component) {
    const animations = component.animations || [];
    if (
      this.mode === "rls" &&
      animations.some((animation) => animation.type === "flash") &&
      animations.some((animation) => animation.type === "fadeOut")
    ) {
      return {
        className: "svgIndicatorSequence",
        delay: animations[0]?.delay || 0,
        duration: animations.reduce(
          (total, animation) => total + animation.duration + animation.delay,
          0,
        ),
        easing: "ease",
      };
    }

    const animation = animations[0];
    if (!animation) return null;
    return {
      className: motionClasses[animation.type] || "svgFadeIn",
      delay: animation.delay,
      duration: animation.duration,
      easing: animation.easing || "ease",
    };
  }

  shape(component) {
    const width = component.width || 0;
    const height = component.height || 0;
    const border = objectValue(component.border);
    const fill = paintColor(component.background) || "none";
    const stroke = border?.color || "none";
    const strokeWidth = stroke === "none" ? 0 : border?.width || 0;
    const radius = border?.radius || 0;
    const shapeWidth = width + strokeWidth;
    const shapeHeight = height + strokeWidth;
    const shapeOffset = strokeWidth / 2;

    if (component.shape === "circle") {
      return svgElement("ellipse", {
        cx: (width + strokeWidth * 2) / 2,
        cy: (height + strokeWidth * 2) / 2,
        fill,
        rx: shapeWidth / 2,
        ry: shapeHeight / 2,
        stroke,
        "stroke-width": strokeWidth,
      });
    }

    if (typeof radius === "string" && radius.includes(",")) {
      return svgElement("path", {
        d: roundedRectPath(shapeWidth, shapeHeight, radius),
        fill,
        stroke,
        "stroke-width": strokeWidth,
        transform: shapeOffset ? `translate(${shapeOffset} ${shapeOffset})` : undefined,
      });
    }

    const resolvedRadius = Math.min(Number(radius) || 0, shapeWidth / 2, shapeHeight / 2);
    return svgElement("rect", {
      fill,
      height: shapeHeight,
      rx: resolvedRadius,
      ry: resolvedRadius,
      stroke,
      "stroke-width": strokeWidth,
      width: shapeWidth,
      x: shapeOffset,
      y: shapeOffset,
    });
  }

  customShape(component) {
    const border = objectValue(component.border);
    return svgElement("polyline", {
      fill: component.isClosedPath ? paintColor(component.background) || "transparent" : "none",
      points: (component.path || []).map((point) => `${point.x},${point.y}`).join(" "),
      stroke: border?.color || (this.mode === "rls" ? "#323E48" : "#373737"),
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": border?.width || 1,
    });
  }

  image(component) {
    const source = component.image ? this.data.assets[component.image] : undefined;
    const href = source ? siteUrl(source) : undefined;
    const width = component.width || 0;
    const height = component.height || 0;
    const color = paintColor(component.background) || "#140729";

    if (this.mode === "rls" && href?.endsWith("/circle-icon.svg")) {
      return svgElement("ellipse", {
        cx: width / 2,
        cy: height / 2,
        fill: paintColor(component.background) || "#F18A00",
        rx: width / 2,
        ry: height / 2,
      });
    }

    if (!href && component.title === "plus_icon.svg") {
      const group = svgElement("g", {
        fill: "none",
        stroke: color,
        "stroke-linecap": "square",
        "stroke-width": Math.max(1.2, width / 14),
      });
      group.append(
        svgElement("line", { x1: width * 0.31, x2: width * 0.69, y1: height / 2, y2: height / 2 }),
        svgElement("line", { x1: width / 2, x2: width / 2, y1: height * 0.31, y2: height * 0.69 }),
      );
      return group;
    }

    if (!href && component.title === "arrow_icon.svg") {
      if (component.image?.includes("2019-07-18")) {
        return svgElement("polyline", {
          fill: "none",
          points: `${width * 0.38},${height * 0.24} ${width * 0.64},${height / 2} ${width * 0.38},${height * 0.76}`,
          stroke: color,
          "stroke-linecap": "square",
          "stroke-linejoin": "miter",
          "stroke-width": Math.max(1, width / 15),
        });
      }
      const group = svgElement("g", {
        fill: "none",
        stroke: color,
        "stroke-linecap": "square",
        "stroke-linejoin": "miter",
        "stroke-width": Math.max(1, width / 15),
      });
      group.append(
        svgElement("line", { x1: width * 0.16, x2: width * 0.76, y1: height / 2, y2: height / 2 }),
        svgElement("polyline", { points: `${width * 0.58},${height * 0.28} ${width * 0.8},${height / 2} ${width * 0.58},${height * 0.72}` }),
      );
      return group;
    }

    if (!href && component.title === "caution_icon.svg") {
      const group = svgElement("g", {
        fill: "none",
        stroke: color,
        "stroke-linejoin": "round",
        "stroke-width": 1.2,
      });
      group.append(
        svgElement("path", { d: `M ${width / 2} 1 L ${width - 1} ${height - 1} L 1 ${height - 1} Z` }),
        svgElement("line", { x1: width / 2, x2: width / 2, y1: height * 0.32, y2: height * 0.63 }),
        svgElement("circle", { cx: width / 2, cy: height * 0.78, fill: color, r: 0.8, stroke: "none" }),
      );
      return group;
    }

    if (!href) return null;
    return svgElement("image", {
      height,
      href,
      preserveAspectRatio:
        this.mode === "liquid"
          ? component.preserveAspectRatio === true ? "xMidYMid meet" : "none"
          : component.preserveAspectRatio === false ? "none" : "xMidYMid meet",
      width,
    });
  }

  fontWeight(variantGuid) {
    if (this.mode === "rls") return variantGuid?.includes("fc58c99a") ? 400 : 700;
    return variantGuid?.includes("67871a57") || variantGuid?.includes("703f2941") ? 700 : 400;
  }

  letterSpacing(value, fontSize) {
    if (!value) return "0px";
    return this.mode === "liquid" ? `${(value / 1000) * fontSize}px` : `${value}px`;
  }

  text(component) {
    const defaultSpan = component.defaultSpan || {};
    const text = this.mode === "liquid" && component.id === "5f7e102fd8449"
      ? "Liquid Spectrum"
      : component.textContent || "";
    const foreignObject = svgElement("foreignObject", {
      height: component.height || 0,
      overflow: component.showOverflow ? "visible" : "hidden",
      width: component.width || 0,
    });
    const div = document.createElement("div");
    Object.assign(div.style, {
      boxSizing: "border-box",
      width: "100%",
      height: "100%",
      margin: "0px",
      paddingTop: `${component.paddingTop || 0}px`,
      paddingRight: `${component.paddingRight || 0}px`,
      paddingBottom: `${component.paddingBottom || 0}px`,
      paddingLeft: `${component.paddingLeft || 0}px`,
      overflow: component.showOverflow ? "visible" : "hidden",
      color: defaultSpan.fontColor || "#373737",
      fontFamily: '"Aktiv Grotesk", Arial, Helvetica, sans-serif',
      fontSize: `${defaultSpan.fontSize || 12}px`,
      fontWeight: String(this.fontWeight(defaultSpan.variantGuid)),
      letterSpacing: this.letterSpacing(defaultSpan.letterSpacing, defaultSpan.fontSize || 12),
      lineHeight: `${component.leading || (defaultSpan.fontSize || 12) * 1.2}px`,
      textAlign: component.justify || "left",
      textDecoration: defaultSpan.underline ? "underline" : "none",
      textTransform: component.textTransform || "none",
      whiteSpace: "pre-wrap",
    });

    const spans = [...(component.textSpans || [])]
      .filter((span) => span.length > 0 && span.index < text.length)
      .sort((left, right) => left.index - right.index);
    if (!spans.length) {
      div.textContent = text;
    } else if (this.mode === "rls") {
      div.style.color = spans[0]?.fontColor || defaultSpan.fontColor || "#000000";
      div.textContent = text;
    } else {
      let cursor = 0;
      spans.forEach((span) => {
        const start = Math.max(cursor, span.index);
        const end = Math.min(text.length, span.index + span.length);
        if (start > cursor) div.append(document.createTextNode(text.slice(cursor, start)));
        if (end > start) {
          const run = document.createElement("span");
          run.textContent = text.slice(start, end);
          if (span.fontColor) run.style.color = span.fontColor;
          if (span.fontSize) run.style.fontSize = `${span.fontSize}px`;
          run.style.fontWeight = String(this.fontWeight(span.variantGuid));
          run.style.letterSpacing = this.letterSpacing(
            span.letterSpacing,
            span.fontSize || defaultSpan.fontSize || 12,
          );
          if (span.underline) run.style.textDecoration = "underline";
          div.append(run);
        }
        cursor = Math.max(cursor, end);
      });
      if (cursor < text.length) div.append(document.createTextNode(text.slice(cursor)));
    }

    foreignObject.append(div);
    return foreignObject;
  }

  graphic(component) {
    if (component.type === "shape-component") return this.shape(component);
    if (component.type === "custom-shape-component") return this.customShape(component);
    if (component.type === "image-component") return this.image(component);
    if (component.type === "text-component") return this.text(component);
    return null;
  }

  node(node, forceVisible = false) {
    const component = this.data.components[node.id];
    if (
      !component ||
      (!forceVisible && component.visible === false) ||
      component.type === "hotspot-component"
    ) {
      return null;
    }

    const isContainer = component.type === "folder" || component.type === "group";
    const border = objectValue(component.border);
    const borderOffset = component.type === "shape-component" && border?.color ? border.width || 0 : 0;
    const x = (component.x || 0) - borderOffset;
    const y = (component.y || 0) - borderOffset;
    const width = component.width || 0;
    const height = component.height || 0;
    const rotation = component.rotation || 0;
    const scaleX = component.flipHorizontal ? -1 : 1;
    const scaleY = component.flipVertical ? -1 : 1;
    const transform = [
      `translate(${x} ${y})`,
      rotation ? `rotate(${rotation} ${width / 2} ${height / 2})` : "",
      scaleX !== 1 || scaleY !== 1
        ? `translate(${scaleX < 0 ? width : 0} ${scaleY < 0 ? height : 0}) scale(${scaleX} ${scaleY})`
        : "",
    ].filter(Boolean).join(" ");

    const outer = svgElement("g", {
      "data-vector-component": component.id,
      opacity: component.opacity ?? 1,
      transform,
    });
    const shadow = objectValue(component.shadow);
    if (shadow?.color) {
      outer.style.filter = `drop-shadow(${shadow.x || 0}px ${shadow.y || 0}px ${shadow.blur || 0}px ${shadow.color})`;
    }

    const inner = svgElement("g");
    const motion = this.motion(component);
    if (motion) {
      inner.classList.add(motion.className);
      inner.style.setProperty("--svg-delay", `${motion.delay}s`);
      inner.style.setProperty("--svg-duration", `${motion.duration}s`);
      inner.style.setProperty("--svg-easing", motion.easing);
    }

    if (isContainer) {
      [...(node.items || [])].reverse().forEach((child) => {
        const rendered = this.node(child);
        if (rendered) inner.append(rendered);
      });
    } else {
      const graphic = this.graphic(component);
      if (graphic) inner.append(graphic);
    }
    outer.append(inner);
    return outer;
  }

  scene(nodes, { className = "", forceTopLevelVisible = false, sceneName }) {
    const svg = svgElement("svg", {
      "aria-hidden": "true",
      "data-native-svg": "true",
      "data-vector-scene": sceneName,
      height: this.data.height,
      preserveAspectRatio: "none",
      viewBox: `0 0 ${this.data.width} ${this.data.height}`,
      width: this.data.width,
    });
    svg.classList.add("vectorScene");
    if (className) svg.classList.add(className);
    const canvas = svgElement("g", { transform: `translate(0 ${this.data.canvasOffsetY})` });
    [...nodes].reverse().forEach((node) => {
      const rendered = this.node(node, forceTopLevelVisible);
      if (rendered) canvas.append(rendered);
    });
    svg.append(canvas);
    return svg;
  }
}
