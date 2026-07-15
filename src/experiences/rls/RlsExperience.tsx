"use client";
/* eslint-disable @next/next/no-img-element -- the fixed Ceros artboard uses locally recovered production assets */

import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./rls.module.css";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

type RlsStep = 1 | 2 | 3 | 4;
type ProductView = "roadm" | "amplifier" | null;

const steps: Array<{
  id: RlsStep;
  label: string;
  image: string;
  transition0: string;
  transition500: string;
  transition1200: string;
  transition2000: string;
  rect: CSSProperties;
  bullets: string[];
}> = [
  {
    id: 1,
    label: "Initial Installation",
    image: "/assets/optimized/rls/states/step-1.png",
    transition0: "/assets/optimized/rls/transitions/step-1-0ms.png",
    transition500: "/assets/optimized/rls/transitions/step-1-500ms.png",
    transition1200: "/assets/optimized/rls/transitions/step-1-1200ms.png",
    transition2000: "/assets/optimized/rls/transitions/step-1-2000ms.png",
    rect: { left: 39, top: 67, width: 167, height: 39 },
    bullets: [
      "Integrated C&L-band amplifiers are installed at all in-line amplifier sites, so the line system is ready for L-band from day one.",
      "Built-in ASE noise loading ensures stable, optimal performance from day one until the system is fully filled.",
      "L-band ROADM and add/drop can be deferred to lower initial costs.",
    ],
  },
  {
    id: 2,
    label: "Grow C-band traffic",
    image: "/assets/optimized/rls/states/step-2.png",
    transition0: "/assets/optimized/rls/transitions/step-2-0ms.png",
    transition500: "/assets/optimized/rls/transitions/step-2-500ms.png",
    transition1200: "/assets/optimized/rls/transitions/step-2-1200ms.png",
    transition2000: "/assets/optimized/rls/transitions/step-2-2000ms.png",
    rect: { left: 234, top: 67, width: 167, height: 40 },
    bullets: [
      "Grow C-band capacity by simply adding more wavelengths.",
      "RLS substitutes signal power for ASE during channel addition with no impact to existing in-service traffic.",
    ],
  },
  {
    id: 3,
    label: "Expand to L-band",
    image: "/assets/optimized/rls/states/step-3.png",
    transition0: "/assets/optimized/rls/transitions/step-3-0ms.png",
    transition500: "/assets/optimized/rls/transitions/step-3-500ms.png",
    transition1200: "/assets/optimized/rls/transitions/step-3-1200ms.png",
    transition2000: "/assets/optimized/rls/transitions/step-3-2000ms.png",
    rect: { left: 41, top: 130, width: 167, height: 41 },
    bullets: [
      "Double fiber capacity with simple, hitless L-band expansion.",
      "No additional planning or engineering is required for L-band.",
      "No amplifier site visits are required.",
      "There is no impact to existing in-service C-band traffic.",
    ],
  },
  {
    id: 4,
    label: "Grow L-band traffic",
    image: "/assets/optimized/rls/states/step-4.png",
    transition0: "/assets/optimized/rls/transitions/step-4-0ms.png",
    transition500: "/assets/optimized/rls/transitions/step-4-500ms.png",
    transition1200: "/assets/optimized/rls/transitions/step-4-1200ms.png",
    transition2000: "/assets/optimized/rls/transitions/step-4-2000ms.png",
    rect: { left: 233, top: 130, width: 167, height: 42 },
    bullets: [
      "RLS substitutes signal power for ASE during channel addition with no impact to existing in-service traffic.",
      "Adding more wavelengths to the L-band is just as easy as adding traffic to the C-band.",
    ],
  },
];

const roadmOverlayImages: Record<RlsStep, string> = {
  1: "/assets/optimized/rls/overlays/roadm-step-1.png",
  2: "/assets/optimized/rls/overlays/roadm-step-2.png",
  3: "/assets/optimized/rls/overlays/roadm-step-3.png",
  4: "/assets/optimized/rls/overlays/roadm-step-4.png",
};

export function RlsExperience() {
  const [step, setStep] = useState<RlsStep>(1);
  const [transitionId, setTransitionId] = useState(0);
  const [frameSrc, setFrameSrc] = useState(steps[0].transition0);
  const [productView, setProductView] = useState<ProductView>(null);
  const [scale, setScale] = useState(1);
  const dialogRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const activeStep = steps.find((item) => item.id === step) ?? steps[0];

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

  useEffect(() => {
    const midpoint = window.setTimeout(
      () => setFrameSrc(activeStep.transition500),
      500,
    );
    const buildout = window.setTimeout(
      () => setFrameSrc(activeStep.transition1200),
      1200,
    );
    const detail = window.setTimeout(
      () => setFrameSrc(activeStep.transition2000),
      2000,
    );
    const settled = window.setTimeout(() => setFrameSrc(activeStep.image), 2800);
    return () => {
      window.clearTimeout(midpoint);
      window.clearTimeout(buildout);
      window.clearTimeout(detail);
      window.clearTimeout(settled);
    };
  }, [activeStep, transitionId]);

  const closeProductView = () => {
    setProductView(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (!productView) return;
    const focusFrame = window.requestAnimationFrame(() => dialogRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProductView();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [productView]);

  const chooseStep = (nextStep: RlsStep) => {
    if (nextStep === step) return;
    const next = steps.find((item) => item.id === nextStep) ?? steps[0];
    setFrameSrc(next.transition0);
    setStep(nextStep);
    setProductView(null);
    setTransitionId((value) => value + 1);
  };

  const openProductView = (
    nextView: Exclude<ProductView, null>,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    lastTriggerRef.current = event.currentTarget;
    setProductView(nextView);
  };

  return (
    <main aria-label="Ciena 6500 Reconfigurable Line System" className={styles.viewer}>
      <div
        className={styles.stage}
        data-active-step={step}
        data-experience="ciena-rls"
        data-product-view={productView ?? "closed"}
        style={{ "--rls-scale": scale } as CSSProperties}
      >
        <img
          alt=""
          aria-hidden="true"
          className={styles.stateFrame}
          draggable={false}
          key={frameSrc}
          src={frameSrc}
        />

        <section aria-live="polite" className={styles.srOnly}>
          <h1>{`Step ${step}: ${activeStep.label}`}</h1>
          <ul>
            {activeStep.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <nav aria-label="Choose an RLS growth step" className={styles.stepControls}>
          {steps.map((item) => (
            <button
              aria-label={`Show Step ${item.id}: ${item.label}`}
              aria-pressed={item.id === step}
              className={styles.hotspot}
              data-step-target={item.id}
              key={item.id}
              onClick={() => chooseStep(item.id)}
              style={item.rect}
              type="button"
            />
          ))}
        </nav>

        <button
          aria-haspopup="dialog"
          aria-label={`Open ROADM Site product view for Step ${step}`}
          className={styles.hotspot}
          onClick={(event) => openProductView("roadm", event)}
          style={{ left: 80, top: 591, width: 147, height: 43 }}
          type="button"
        />
        <button
          aria-haspopup="dialog"
          aria-label="Open Bi-directional Amplifier Site product view"
          className={styles.hotspot}
          onClick={(event) => openProductView("amplifier", event)}
          style={{ left: 566, top: 375, width: 146, height: 45 }}
          type="button"
        />

        {productView ? (
          <section
            aria-labelledby="rls-product-view-title"
            aria-modal="true"
            className={styles.dialogLayer}
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <h2 className={styles.srOnly} id="rls-product-view-title">
              {productView === "roadm" ? "ROADM Site" : "Bi-directional Amplifier Site"}
            </h2>
            {productView === "roadm" ? (
              <img
                alt={`ROADM Site product configuration for Step ${step}: ${activeStep.label}`}
                className={styles.roadmDialog}
                draggable={false}
                src={roadmOverlayImages[step]}
              />
            ) : (
              <>
                <div aria-hidden="true" className={styles.dialogBackdrop} />
                <img
                  alt="Bi-directional Amplifier Site with DLA C&L-band amplifier and optional SRA single-line Raman amplifier"
                  className={styles.amplifierDialog}
                  draggable={false}
                  src="/assets/optimized/rls/overlays/amplifier-dialog.webp"
                />
              </>
            )}
            <button
              aria-label="Close product view"
              className={`${styles.hotspot} ${styles.closeHotspot} ${
                productView === "amplifier" ? styles.amplifierClose : styles.roadmClose
              }`}
              onClick={closeProductView}
              type="button"
            />
          </section>
        ) : null}
      </div>
    </main>
  );
}
