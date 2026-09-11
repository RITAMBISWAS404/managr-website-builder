import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface State { error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Website Builder error:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-muted p-6">
        <div className="max-w-md rounded-xl border border-hair bg-card p-6 text-center shadow-card">
          <AlertTriangle className="mx-auto size-8 text-warning" />
          <h1 className="mt-3 text-section font-bold">Something went wrong on this screen</h1>
          <p className="mt-1 text-caption text-muted-foreground">
            Your website and your draft are unaffected. You can reload and carry on.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={() => this.setState({ error: null })}>
              Try again
            </Button>
            <Button variant="primary" onClick={() => (window.location.href = "/website")}>
              Return to Website
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
