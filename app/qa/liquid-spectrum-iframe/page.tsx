export const metadata = {
  title: "Liquid Spectrum iframe QA",
};

export default function LiquidSpectrumIframeQaPage() {
  return (
    <main
      style={{
        width: 1265,
        height: 712,
        margin: 0,
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <iframe
        aria-label="Liquid Spectrum experience QA frame"
        src="/liquid-spectrum"
        style={{ width: 1265, height: 712, border: 0, display: "block" }}
        title="Liquid Spectrum experience QA frame"
      />
    </main>
  );
}
