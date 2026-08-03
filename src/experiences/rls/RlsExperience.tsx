"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RlsVectorBase, RlsVectorPopupLayer, RlsVectorStepLayer } from "./RlsVectorRenderer";
import styles from "./rls.module.css";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

type RlsStep = 1 | 2 | 3 | 4;
type ProductView = "roadm" | "amplifier" | null;
type MotionPhase = "entering" | "settled" | "exiting";
type MotionStyle = CSSProperties & {
  "--delay"?: string;
  "--menu-delay"?: string;
};

const steps: Array<{
  id: RlsStep;
  label: string;
  button: CSSProperties;
  bullets: string[];
}> = [
  {
    id: 1,
    label: "Initial Installation",
    button: { left: 39, top: 67, width: 169, height: 38 },
    bullets: [
      "Integrated C&L-band amplifiers are installed at all in-line amplifier sites, so the line system is ready for L-band from day one.",
      "Built-in ASE noise loading ensures stable, optimal performance from day one until the system is fully filled.",
      "L-band ROADM and add/drop can be deferred to lower initial costs.",
    ],
  },
  {
    id: 2,
    label: "Grow C-band traffic",
    button: { left: 232, top: 67, width: 169, height: 38 },
    bullets: [
      "Grow C-band capacity by simply adding more wavelengths.",
      "RLS substitutes signal power for ASE during channel addition with no impact to existing in-service traffic.",
    ],
  },
  {
    id: 3,
    label: "Expand to L-band",
    button: { left: 39, top: 132, width: 169, height: 38 },
    bullets: [
      "Double fiber capacity with simple, hitless L-band expansion.",
      "No additional planning/engineering required for L-band.",
      "No amplifier site visits required.",
      "No impact to existing in-service C-band traffic.",
    ],
  },
  {
    id: 4,
    label: "Grow L-band traffic",
    button: { left: 232, top: 132, width: 169, height: 38 },
    bullets: [
      "RLS substitutes signal power for ASE during channel addition with no impact to existing in-service traffic.",
      "Adding more wavelengths to the L-band is just as easy as adding traffic to the C-band.",
    ],
  },
];

const stepDuration: Record<RlsStep, number> = { 1: 2500, 2: 2600, 3: 3200, 4: 3800 };

function ProductDialog({
  activeStep,
  closing,
  productView,
  dialogRef,
  onClose,
}: {
  activeStep: RlsStep;
  closing: boolean;
  productView: Exclude<ProductView, null>;
  dialogRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const isRoadm = productView === "roadm";
  const popup = isRoadm ? (`roadm${activeStep}` as const) : "amplifier";

  return (
    <section
      aria-labelledby="rls-product-view-title"
      aria-modal="true"
      className={`${styles.dialogLayer} ${closing ? styles.dialogClosing : ""}`}
      data-motion-granularity="svg-component"
      data-product-popup={popup}
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      <h2 className={styles.srOnly} id="rls-product-view-title">
        {isRoadm ? "ROADM Site" : "Bi-directional Amplifier Site"}
      </h2>
      <RlsVectorPopupLayer popup={popup} />
      <button
        aria-label="Close product view"
        className={`${styles.vectorCloseHotspot} ${isRoadm ? styles.vectorRoadmClose : styles.vectorAmplifierClose}`}
        onClick={onClose}
        type="button"
      />
    </section>
  );
}

export function RlsExperience() {
  const [step, setStep] = useState<RlsStep>(1);
  const [sceneRevision, setSceneRevision] = useState(0);
  const [phase, setPhase] = useState<MotionPhase>("entering");
  const [initialStepVisible, setInitialStepVisible] = useState(false);
  const [stepInteractionsReady, setStepInteractionsReady] = useState(false);
  const [productView, setProductView] = useState<ProductView>(null);
  const [productClosing, setProductClosing] = useState(false);
  const [scale, setScale] = useState(1);
  const dialogRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const stepTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const activeStep = steps.find((item) => item.id === step) ?? steps[0];

  useEffect(() => {
    const fitStage = () => {
      setScale(Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT));
    };
    const initialFrame = window.requestAnimationFrame(fitStage);
    const initialStepTimer = window.setTimeout(() => setInitialStepVisible(true), 5000);
    const interactionsTimer = window.setTimeout(() => setStepInteractionsReady(true), 7000);
    window.addEventListener("resize", fitStage);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.clearTimeout(initialStepTimer);
      window.clearTimeout(interactionsTimer);
      window.removeEventListener("resize", fitStage);
    };
  }, []);

  useEffect(() => {
    settleTimerRef.current = window.setTimeout(() => setPhase("settled"), stepDuration[step]);
    return () => {
      if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
    };
  }, [sceneRevision, step]);

  useEffect(
    () => () => {
      if (stepTimerRef.current !== null) window.clearTimeout(stepTimerRef.current);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const closeProductView = useCallback(() => {
    if (!productView || productClosing) return;
    setProductClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setProductView(null);
      setProductClosing(false);
      window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
    }, 220);
  }, [productClosing, productView]);

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
  }, [closeProductView, productView]);

  const chooseStep = (nextStep: RlsStep) => {
    if (!stepInteractionsReady) return;
    if (nextStep === step && phase !== "exiting") return;
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    if (stepTimerRef.current !== null) window.clearTimeout(stepTimerRef.current);
    setProductView(null);
    setProductClosing(false);
    setPhase("exiting");
    stepTimerRef.current = window.setTimeout(() => {
      setStep(nextStep);
      setSceneRevision((value) => value + 1);
      setPhase("entering");
    }, 200);
  };

  const openProductView = (
    nextView: Exclude<ProductView, null>,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (!initialStepVisible) return;
    lastTriggerRef.current = event.currentTarget;
    setProductClosing(false);
    setProductView(nextView);
  };

  return (
    <main aria-label="Ciena 6500 Reconfigurable Line System" className={styles.viewer}>
      <div
        className={styles.stage}
        data-active-step={step}
        data-experience="ciena-rls"
        data-motion-phase={phase}
        data-product-view={productView ?? "closed"}
        data-renderer="native-svg"
        data-startup-step-visible={initialStepVisible}
        data-step-interactions-ready={stepInteractionsReady}
        style={{ "--rls-scale": scale } as CSSProperties}
      >
        <nav aria-label="Choose an RLS growth step" className={styles.stepControls}>
          {steps.map((item, index) => (
            <div
              className={styles.stepControl}
              key={item.id}
              style={{ ...item.button, "--menu-delay": `${index * 400}ms` } as MotionStyle}
            >
              <span aria-hidden="true" className={styles.stepEyebrow}>{`STEP ${item.id}`}</span>
              <button
                aria-disabled={!stepInteractionsReady}
                aria-label={`Show Step ${item.id}: ${item.label}`}
                aria-pressed={initialStepVisible && item.id === step}
                className={styles.stepButton}
                data-step-target={item.id}
                onClick={() => chooseStep(item.id)}
                type="button"
              >
                {item.label}
              </button>
            </div>
          ))}
        </nav>

        <div
          aria-hidden="true"
          className={`${styles.copyRule} ${initialStepVisible ? "" : styles.startupHidden}`}
          key={`rule-${initialStepVisible ? "visible" : "hidden"}`}
        />
        <section
          aria-hidden={!initialStepVisible}
          aria-live="polite"
          className={`${styles.stepCopy} ${initialStepVisible ? "" : styles.startupHidden}`}
          data-step={step}
          key={`copy-${step}-${sceneRevision}-${initialStepVisible ? "visible" : "hidden"}`}
        >
          <h1 className={styles.srOnly}>{`Step ${step}: ${activeStep.label}`}</h1>
          <ul>
            {activeStep.bullets.map((bullet, index) => (
              <li key={bullet} style={{ "--delay": `${160 + index * 180}ms` } as MotionStyle}>
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        <RlsVectorBase />
        {initialStepVisible ? (
          <div className={`${styles.scene} ${phase === "exiting" ? styles.sceneExiting : ""}`} key={`scene-${step}-${sceneRevision}`}>
            <RlsVectorStepLayer step={step} />
          </div>
        ) : null}

        <button
          aria-disabled={!initialStepVisible}
          aria-haspopup="dialog"
          aria-label={`Open ROADM Site product view for Step ${step}`}
          className={`${styles.productHotspot} ${styles.roadmHotspot}`}
          onClick={(event) => openProductView("roadm", event)}
          tabIndex={initialStepVisible ? 0 : -1}
          type="button"
        />
        <button
          aria-disabled={!initialStepVisible}
          aria-haspopup="dialog"
          aria-label="Open Bi-directional Amplifier Site product view"
          className={`${styles.productHotspot} ${styles.amplifierHotspot}`}
          onClick={(event) => openProductView("amplifier", event)}
          tabIndex={initialStepVisible ? 0 : -1}
          type="button"
        />

        {productView ? (
          <ProductDialog
            activeStep={step}
            closing={productClosing}
            dialogRef={dialogRef}
            onClose={closeProductView}
            productView={productView}
          />
        ) : null}
      </div>
    </main>
  );
}
