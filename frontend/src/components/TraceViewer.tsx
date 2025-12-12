import { Card } from "./common/Card";
import { ExternalLink } from "lucide-react";

const JAEGER_URL = import.meta.env.VITE_JAEGER_URL || "http://localhost:16686";

export function TraceViewer() {
  return (
    <Card
      title="Distributed Traces (Jaeger)"
      action={
        <a
          href={JAEGER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Open Jaeger</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      }
    >
      <div className="space-y-4">
        {/* Embedded Jaeger UI */}
        <div className="relative w-full h-[600px] bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
          <iframe
            src={JAEGER_URL}
            className="w-full h-full"
            title="Jaeger Tracing UI"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`${JAEGER_URL}/search?service=delineate-api`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">API Traces</span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </a>

          <a
            href={`${JAEGER_URL}/dependencies`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Service Map</span>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </a>
        </div>

        {/* Info */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-400">
            💡 Jaeger displays distributed traces from OpenTelemetry
            instrumentation. Traces show request flows across services.
          </p>
        </div>
      </div>
    </Card>
  );
}
