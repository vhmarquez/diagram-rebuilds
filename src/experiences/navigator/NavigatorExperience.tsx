"use client";
/* eslint-disable @next/next/no-img-element -- recovered Ceros assets have fixed artboard geometry and local optimized variants */

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import styles from "./navigator.module.css";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

type NavigatorState = "suite" | "controller" | "apps" | "emulation";

const stateControls: Array<{
  id: NavigatorState;
  label: string;
  rect: CSSProperties;
}> = [
  {
    id: "suite",
    label: "Navigator Network Control Suite",
    rect: { left: 254, top: 115, width: 142, height: 128 },
  },
  {
    id: "controller",
    label: "Navigator Multi-Layer Controller",
    rect: { left: 147, top: 284, width: 116, height: 142 },
  },
  {
    id: "apps",
    label: "Navigator Intelligent Apps",
    rect: { left: 269, top: 283, width: 120, height: 142 },
  },
  {
    id: "emulation",
    label: "Emulation Cloud",
    rect: { left: 396, top: 283, width: 103, height: 126 },
  },
];

const ctaLinks = {
  controller:
    "https://www.ciena.com/products/navigator-mc?utm_source=ceros&utm_term=navigator_multilayer_controller&utm_medium=navigatortool",
  liquidSpectrum:
    "https://www.ciena.com/products/liquid-spectrum/?utm_source=ceros&utm_term=liquid_spectrum&utm_medium=navigatortool",
  multiLayerOperations:
    "https://www.ciena.com/products/multi-layer-operations?utm_source=ceros&utm_term=multilayer_operations&utm_medium=navigatortool",
  plannerPlus:
    "https://www.ciena.com/products/navigator-ncs/plannerplus?utm_source=ceros&utm_term=plannerplus&utm_medium=navigatortool",
  emulation:
    "https://www.ciena.com/products/emulation-cloud/?utm_term=emulation_cloud&utm_source=ceros&utm_medium=navigatortool",
};

function LearnMore({ href, className = "" }: { href: string; className?: string }) {
  return (
    <a
      className={`${styles.cta} ${className}`}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span className={styles.ctaText}>Learn more</span>
    </a>
  );
}

function SuitePanel() {
  return (
    <section aria-labelledby="navigator-suite-title" className={styles.panel}>
      <h1 className={`${styles.title} ${styles.suiteTitle}`} id="navigator-suite-title">
        Navigator Network Control Suite
      </h1>
      <p className={`${styles.body} ${styles.suiteBody}`}>
        The software provides a single point of control to visualize and optimize
        multi-layer, multi-vendor network operations—reducing costs and improving
        customer satisfaction.
      </p>
      <img
        alt="Navigator Network Control Suite network map interface"
        className={styles.suiteImage}
        decoding="async"
        draggable={false}
        src="/assets/optimized/navigator/navigator-ncs.webp"
      />
    </section>
  );
}

function ControllerPanel() {
  return (
    <section aria-labelledby="navigator-controller-title" className={styles.panel}>
      <h1
        className={`${styles.title} ${styles.controllerTitle}`}
        id="navigator-controller-title"
      >
        Navigator Multi-Layer Controller
      </h1>
      <p className={`${styles.body} ${styles.controllerBody}`}>
        Navigator Multi-Layer Controller provides comprehensive multi-layer network
        visibility and software control across Ciena and third-party infrastructure,
        so teams can efficiently coordinate lifecycle network operations, eliminating
        manual handoffs between multiple systems.
      </p>
      <img
        alt="Navigator Multi-Layer Controller dashboard"
        className={styles.controllerImage}
        decoding="async"
        draggable={false}
        src="/assets/optimized/navigator/navigator-mc.webp"
      />
      <LearnMore className={styles.controllerCta} href={ctaLinks.controller} />
    </section>
  );
}

const appRows = [
  {
    id: "liquid-spectrum",
    icon: "/assets/optimized/navigator/liquid-spectrum-icon.png",
    iconAlt: "Liquid Spectrum",
    label: "Liquid Spectrum",
    copy: (
      <>
        <strong>Liquid Spectrum</strong> apps improve visibility of the photonic layer,
        enabling you to increase network capacity and service availability from
        optical infrastructure investment, driving down cost and power per bit.
      </>
    ),
    href: ctaLinks.liquidSpectrum,
  },
  {
    id: "enhanced-ip",
    icon: "/assets/optimized/navigator/enhanced-ip-control.png",
    iconAlt: "Enhanced IP Control",
    label: "Enhanced IP Control",
    copy: (
      <>
        <strong>Enhanced IP Control</strong> apps discover, visualize, and manage IP
        connectivity and services running over Ciena routers or third-party hosts with
        Ciena pluggables, correlating to underlying Ethernet and optical layers.
      </>
    ),
  },
  {
    id: "multi-layer-operations",
    icon: "/assets/optimized/navigator/multi-layer-operations.png",
    iconAlt: "Multi-Layer Operations",
    label: "Multi-Layer Operations",
    copy: (
      <>
        <strong>Multi-Layer Operations</strong> apps provide intuitive visualization of
        correlated data across multiple network layers to simplify and automate
        repetitive tasks and mitigate network issues.
      </>
    ),
    href: ctaLinks.multiLayerOperations,
  },
  {
    id: "plannerplus",
    icon: "/assets/optimized/navigator/plannerplus-2.png",
    iconAlt: "PlannerPlus",
    label: "PlannerPlus",
    copy: (
      <>
        <strong>PlannerPlus</strong> provides online planning capabilities for accurate
        and timely network design, delivering maximum return on infrastructure
        investment. Visualize your new network sites and fibers, run link engineering,
        and generate a bill of materials in just a few steps.
      </>
    ),
    href: ctaLinks.plannerPlus,
  },
] as const;

function AppsPanel() {
  return (
    <section aria-labelledby="navigator-apps-title" className={styles.panel}>
      <h1 className={`${styles.title} ${styles.appsTitle}`} id="navigator-apps-title">
        Navigator Intelligent Apps
      </h1>
      <p className={`${styles.body} ${styles.appsIntro}`}>
        Navigator Intelligent Apps deliver proactive insights based on a wealth of
        real-time and historical data to drive better decisions and simplify
        troubleshooting, increase network resiliency, and optimize network performance.
      </p>
      <div className={styles.appList}>
        {appRows.map((row, index) => (
          <article
            className={`${styles.appRow} ${styles[`appRow${index + 1}`]}`}
            data-app={row.id}
            key={row.id}
          >
            <div className={styles.appIdentity}>
              <img
                alt={row.iconAlt}
                className={styles.appIcon}
                decoding="async"
                draggable={false}
                src={row.icon}
              />
              <span className={styles.appLabel}>{row.label}</span>
            </div>
            <div className={styles.appContent}>
              <p>{row.copy}</p>
              {"href" in row && row.href ? <LearnMore href={row.href} /> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmulationPanel() {
  return (
    <section aria-labelledby="emulation-title" className={styles.panel}>
      <h1 className={`${styles.title} ${styles.emulationTitle}`} id="emulation-title">
        Emulation Cloud
      </h1>
      <p className={`${styles.body} ${styles.emulationBody}`}>
        Ciena’s Emulation Cloud is an open environment that facilitates and accelerates
        integration testing and deployment of Navigator NCS APIs with other OSS. Free
        access to a community lab or subscription to a dedicated lab environment are
        available.
      </p>
      <img
        alt="Ciena Emulation Cloud lab environment"
        className={styles.emulationImage}
        decoding="async"
        draggable={false}
        src="/assets/optimized/navigator/ciena-emulation-cloud.webp"
      />
      <LearnMore className={styles.emulationCta} href={ctaLinks.emulation} />
    </section>
  );
}

function DetailPanel({ state }: { state: NavigatorState }) {
  if (state === "controller") return <ControllerPanel />;
  if (state === "apps") return <AppsPanel />;
  if (state === "emulation") return <EmulationPanel />;
  return <SuitePanel />;
}

export function NavigatorExperience() {
  const [state, setState] = useState<NavigatorState>("suite");
  const [scale, setScale] = useState(1);

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

  return (
    <main aria-label="Ciena Navigator product overview" className={styles.viewer}>
      <style>{`
        @font-face{font-family:"Aktiv Grotesk";src:url("/assets/optimized/navigator/aktiv-grotesk-light.woff") format("woff");font-style:normal;font-weight:300;font-display:swap;}
        @font-face{font-family:"Aktiv Grotesk";src:url("/assets/optimized/navigator/aktiv-grotesk-regular.woff") format("woff");font-style:normal;font-weight:400;font-display:swap;}
        @font-face{font-family:"Aktiv Grotesk";src:url("/assets/optimized/navigator/aktiv-grotesk-bold.woff") format("woff");font-style:normal;font-weight:700;font-display:swap;}
      `}</style>
      <div
        className={styles.stage}
        data-active-state={state}
        data-experience="ciena-navigator"
        style={{ "--navigator-scale": scale } as CSSProperties}
      >
        <img
          alt="Navigator Network Control Suite product architecture"
          className={styles.triangle}
          decoding="async"
          draggable={false}
          src="/assets/optimized/navigator/navigator-network-control-suite-triangle.webp"
        />
        <DetailPanel key={state} state={state} />
        <nav aria-label="Choose a Navigator product" className={styles.stateControls}>
          {stateControls.map((control) => (
            <button
              aria-label={`Show ${control.label}`}
              aria-pressed={state === control.id}
              className={styles.stateControl}
              data-state-target={control.id}
              key={control.id}
              onClick={() => setState(control.id)}
              style={control.rect}
              type="button"
            />
          ))}
        </nav>
      </div>
    </main>
  );
}
