export const metadata = {
  title: "RLS iframe QA",
};

export default function RlsIframeQaPage() {
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
        aria-label="RLS experience QA frame"
        src="/rls"
        style={{ width: 1265, height: 712, border: 0, display: "block" }}
        title="RLS experience QA frame"
      />
    </main>
  );
}
