import { IconPlus } from "@tabler/icons-react";

export interface QuickRecipient {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

interface AvatarStackProps {
  recipients: QuickRecipient[];
  onAddRecipient?: () => void;
}

export default function AvatarStack({ recipients, onAddRecipient }: AvatarStackProps) {
  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap mb-4">
        {recipients.map((r) => (
          <div key={r.id} className="flex flex-col items-center gap-1.5 w-14" title={r.name}>
            {r.avatarUrl ? (
              <img src={r.avatarUrl} alt={r.name} className="w-11 h-11 rounded-full object-cover border border-org-border" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-org-primary-light text-org-primary flex items-center justify-center font-org-semibold text-org-sm">
                {r.name.charAt(0)}
              </div>
            )}
            <span className="text-org-xs text-org-text-secondary truncate w-full text-center">{r.name.split(" ")[0]}</span>
          </div>
        ))}
      </div>
      {onAddRecipient && (
        <button
          onClick={onAddRecipient}
          className="w-full flex items-center justify-center gap-1.5 bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold py-2.5 rounded-org-sm transition-colors"
        >
          <IconPlus size={14} /> Add New Recipient
        </button>
      )}
    </div>
  );
}
