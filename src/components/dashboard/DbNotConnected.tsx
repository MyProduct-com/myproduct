import { DatabaseZap } from "lucide-react";

export default function DbNotConnected({ message, command }: { message: string; command?: string }) {
  return (
    <div className="min-h-screen bg-org-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-org-surface rounded-org-card shadow-org-card p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-org-warning/15 text-org-warning flex items-center justify-center mx-auto mb-4">
          <DatabaseZap size={22} />
        </div>
        <h2 className="text-org-md font-org-semibold text-org-text-primary mb-2">Database not ready</h2>
        <p className="text-org-sm text-org-text-secondary mb-4">{message}</p>
        {command && (
          <pre className="text-left bg-org-surface-alt border border-org-border rounded-org-sm p-3 text-org-xs text-org-text-primary overflow-x-auto">
            {command}
          </pre>
        )}
      </div>
    </div>
  );
}
