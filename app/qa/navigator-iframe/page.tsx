export const metadata = {
  title: "Navigator iframe QA",
};

export default function NavigatorIframeQaPage() {
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
        aria-label="Navigator experience QA frame"
        src="/navigator"
        style={{ width: 1265, height: 712, border: 0, display: "block" }}
        title="Navigator experience QA frame"
      />
    </main>
  );
}
