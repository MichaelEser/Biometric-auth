import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches otherwise-uncaught render/effect errors anywhere below it.
// Without this, React unmounts the whole tree on any uncaught error,
// leaving <body>'s dark background (#0a0f1e) as the only thing visible —
// which reads as the app "blacking out".
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#f8fafc",
            color: "#1e293b",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>
            Please reload the page and try again.
          </p>
          <button className="btn-primary" style={{ maxWidth: 200 }} onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
