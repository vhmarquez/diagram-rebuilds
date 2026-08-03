"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  LiquidSpectrumVectorBase,
  LiquidSpectrumVectorDimmers,
  LiquidSpectrumVectorFeature,
  LiquidSpectrumVectorPhase,
  type LiquidSpectrumFeature,
  type LiquidSpectrumPhase,
} from "./LiquidSpectrumVectorRenderer";
import styles from "./liquid-spectrum.module.css";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

type FeaturePhase = "planning" | "delivery" | "operations" | "optimization";
type Bounds = { left: number; top: number; width: number; height: number };

type FeatureDefinition = {
  id: LiquidSpectrumFeature;
  label: string;
  phase: FeaturePhase;
  bounds: Bounds;
  previous: LiquidSpectrumFeature;
  next: LiquidSpectrumFeature;
};

type PhaseDefinition = {
  id: LiquidSpectrumPhase;
  label: string;
  bounds: Bounds;
};

const features: FeatureDefinition[] = [
  {
    id: "planningToolCalibrator",
    label: "Planning Tool Calibrator",
    phase: "planning",
    bounds: { left: 783, top: 90, width: 393, height: 55 },
    previous: "liquidRestoration",
    next: "bandwidthOptimizer",
  },
  {
    id: "bandwidthOptimizer",
    label: "Bandwidth Optimizer",
    phase: "delivery",
    bounds: { left: 783, top: 149, width: 393, height: 49 },
    previous: "planningToolCalibrator",
    next: "pinPointOtdr",
  },
  {
    id: "pinPointOtdr",
    label: "PinPoint OTDR",
    phase: "operations",
    bounds: { left: 783, top: 261, width: 393, height: 50 },
    previous: "bandwidthOptimizer",
    next: "channelMarginGauge",
  },
  {
    id: "channelMarginGauge",
    label: "Channel Margin Gauge",
    phase: "operations",
    bounds: { left: 783, top: 329, width: 393, height: 50 },
    previous: "pinPointOtdr",
    next: "photonicPerformanceGauge",
  },
  {
    id: "photonicPerformanceGauge",
    label: "Photonic Performance Gauge",
    phase: "operations",
    bounds: { left: 783, top: 394, width: 393, height: 50 },
    previous: "channelMarginGauge",
    next: "liquidRestoration",
  },
  {
    id: "liquidRestoration",
    label: "Liquid Restoration",
    phase: "optimization",
    bounds: { left: 783, top: 501, width: 393, height: 49 },
    previous: "photonicPerformanceGauge",
    next: "planningToolCalibrator",
  },
  {
    id: "spectrumDefragmentation",
    label: "Spectrum Defragmentation",
    phase: "optimization",
    bounds: { left: 783, top: 558, width: 393, height: 49 },
    previous: "photonicPerformanceGauge",
    next: "planningToolCalibrator",
  },
  {
    id: "snrOptimizer",
    label: "SNR Optimizer",
    phase: "optimization",
    bounds: { left: 783, top: 614, width: 393, height: 49 },
    previous: "photonicPerformanceGauge",
    next: "planningToolCalibrator",
  },
];

const phases: PhaseDefinition[] = [
  {
    id: "planning",
    label: "Planning",
    bounds: { left: 313, top: 203, width: 114, height: 50 },
  },
  {
    id: "delivery",
    label: "Delivery",
    bounds: { left: 501, top: 360, width: 111, height: 55 },
  },
  {
    id: "operations",
    label: "Operations",
    bounds: { left: 318, top: 548, width: 115, height: 56 },
  },
  {
    id: "optimization",
    label: "Optimization",
    bounds: { left: 108, top: 360, width: 138, height: 57 },
  },
  {
    id: "liquidSpectrum",
    label: "Liquid Spectrum",
    bounds: { left: 247, top: 267, width: 254, height: 253 },
  },
];

function hotspotStyle(bounds: Bounds): CSSProperties {
  return bounds;
}

export function LiquidSpectrumExperience() {
  const [activeFeature, setActiveFeature] = useState<LiquidSpectrumFeature | null>(
    "channelMarginGauge",
  );
  const [activePhase, setActivePhase] = useState<LiquidSpectrumPhase | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [sceneRevision, setSceneRevision] = useState(0);
  const [closing, setClosing] = useState(false);
  const [transitionLocked, setTransitionLocked] = useState(false);
  const [interactionsReady, setInteractionsReady] = useState(false);
  const [scale, setScale] = useState(1);
  const activeSceneRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const shouldFocusSceneRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const activeFeatureDefinition = features.find((feature) => feature.id === activeFeature);
  const selectedPhase = activeFeatureDefinition?.phase ?? activePhase;

  useEffect(() => {
    const fitStage = () => {
      setScale(Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT));
    };
    const initialFrame = window.requestAnimationFrame(fitStage);
    const readyTimer = window.setTimeout(() => setInteractionsReady(true), 800);
    window.addEventListener("resize", fitStage);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.clearTimeout(readyTimer);
      window.removeEventListener("resize", fitStage);
    };
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!shouldFocusSceneRef.current || (!activeFeature && !activePhase)) return;
    const focusFrame = window.requestAnimationFrame(() => activeSceneRef.current?.focus());
    shouldFocusSceneRef.current = false;
    return () => window.cancelAnimationFrame(focusFrame);
  }, [activeFeature, activePhase, sceneRevision]);

  const lockTransition = useCallback(() => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    setTransitionLocked(true);
    transitionTimerRef.current = window.setTimeout(() => setTransitionLocked(false), 900);
  }, []);

  const closeScene = useCallback(() => {
    if ((!activeFeature && !activePhase) || closing) return;
    setClosing(true);
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setActiveFeature(null);
      setActivePhase(null);
      setClosing(false);
      setSceneRevision((value) => value + 1);
      window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
    }, 200);
  }, [activeFeature, activePhase, closing]);

  useEffect(() => {
    if (!activeFeature && !activePhase) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeScene();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeFeature, activePhase, closeScene]);

  const showFeature = (
    feature: LiquidSpectrumFeature,
    trigger?: HTMLButtonElement | null,
  ) => {
    if (!interactionsReady || transitionLocked || closing) return;
    if (trigger) lastTriggerRef.current = trigger;
    setHasUserInteracted(true);
    shouldFocusSceneRef.current = true;
    setActivePhase(null);
    setActiveFeature(feature);
    setClosing(false);
    setSceneRevision((value) => value + 1);
    lockTransition();
  };

  const showPhase = (phase: LiquidSpectrumPhase, trigger: HTMLButtonElement) => {
    if (!interactionsReady || transitionLocked || closing || activeFeature) return;
    lastTriggerRef.current = trigger;
    setHasUserInteracted(true);
    shouldFocusSceneRef.current = true;
    setActiveFeature(null);
    setActivePhase(phase);
    setClosing(false);
    setSceneRevision((value) => value + 1);
    lockTransition();
  };

  const selectFeature = (
    feature: LiquidSpectrumFeature,
    event: MouseEvent<HTMLButtonElement>,
  ) => showFeature(feature, event.currentTarget);

  const selectPhase = (phase: LiquidSpectrumPhase, event: MouseEvent<HTMLButtonElement>) =>
    showPhase(phase, event.currentTarget);

  return (
    <main aria-label="Ciena Liquid Spectrum" className={styles.viewer}>
      <div
        className={styles.stage}
        data-active-feature={activeFeature ?? "none"}
        data-active-phase={activePhase ?? "none"}
        data-experience="ciena-liquid-spectrum"
        data-interactions-ready={interactionsReady}
        data-renderer="native-svg"
        data-scene-closing={closing}
        data-selected-lifecycle={selectedPhase ?? "none"}
        style={{ "--liquid-scale": scale } as CSSProperties}
      >
        <LiquidSpectrumVectorBase />

        {hasUserInteracted && activeFeatureDefinition ? (
          <LiquidSpectrumVectorDimmers selectedPhase={activeFeatureDefinition.phase} />
        ) : null}

        {activePhase ? (
          <section
            aria-labelledby="liquid-phase-title"
            className={`${styles.sceneLayer} ${closing ? styles.sceneClosing : ""}`}
            data-phase-scene={activePhase}
            key={`phase-${activePhase}-${sceneRevision}`}
            ref={activeSceneRef}
            tabIndex={-1}
          >
            <h1 className={styles.srOnly} id="liquid-phase-title">
              {phases.find((phase) => phase.id === activePhase)?.label ?? "Liquid Spectrum"}
            </h1>
            <LiquidSpectrumVectorPhase phase={activePhase} />
            <button
              aria-label="Close lifecycle information"
              className={`${styles.hotspot} ${styles.sceneCloseHotspot}`}
              onClick={closeScene}
              type="button"
            />
          </section>
        ) : null}

        {activeFeature && activeFeatureDefinition ? (
          <section
            aria-labelledby="liquid-feature-title"
            aria-modal="true"
            className={`${styles.sceneLayer} ${closing ? styles.sceneClosing : ""}`}
            data-feature-scene={activeFeature}
            key={`feature-${activeFeature}-${sceneRevision}`}
            ref={activeSceneRef}
            role="dialog"
            tabIndex={-1}
          >
            <h1 className={styles.srOnly} id="liquid-feature-title">
              {activeFeatureDefinition.label}
            </h1>
            <LiquidSpectrumVectorFeature feature={activeFeature} />
            <button
              aria-label={`Close ${activeFeatureDefinition.label}`}
              className={`${styles.hotspot} ${styles.featureCloseHotspot}`}
              onClick={closeScene}
              type="button"
            />
            <button
              aria-label={`Previous: ${features.find((feature) => feature.id === activeFeatureDefinition.previous)?.label}`}
              className={`${styles.hotspot} ${styles.previousHotspot}`}
              disabled={transitionLocked || closing}
              onClick={() => showFeature(activeFeatureDefinition.previous)}
              type="button"
            />
            <button
              aria-label={`Next: ${features.find((feature) => feature.id === activeFeatureDefinition.next)?.label}`}
              className={`${styles.hotspot} ${styles.nextHotspot}`}
              disabled={transitionLocked || closing}
              onClick={() => showFeature(activeFeatureDefinition.next)}
              type="button"
            />
          </section>
        ) : null}

        <nav aria-label="Explore the Liquid Spectrum lifecycle" className={styles.hotspotLayer}>
          {phases.map((phase) => (
            <button
              aria-label={`Show ${phase.label} lifecycle information`}
              aria-pressed={selectedPhase === phase.id}
              className={styles.hotspot}
              disabled={!interactionsReady || Boolean(activeFeature)}
              key={phase.id}
              onClick={(event) => selectPhase(phase.id, event)}
              style={hotspotStyle(phase.bounds)}
              type="button"
            />
          ))}
        </nav>

        <nav aria-label="Explore Liquid Spectrum applications" className={styles.hotspotLayer}>
          {features.map((feature) => (
            <button
              aria-label={`Show ${feature.label}`}
              aria-pressed={activeFeature === feature.id}
              className={styles.hotspot}
              disabled={!interactionsReady || Boolean(activeFeature)}
              key={feature.id}
              onClick={(event) => selectFeature(feature.id, event)}
              style={hotspotStyle(feature.bounds)}
              type="button"
            />
          ))}
        </nav>
      </div>
    </main>
  );
}
