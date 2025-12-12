import { memo } from 'react';
import { Paperclip } from 'lucide-react';
import { Attachment } from '@/types';
import { AttachmentItem } from './AttachmentItem';
import { cn } from '@/utils/cn';

export interface AttachmentListProps {
  attachments: Attachment[];
  onDeleteAttachment?: (attachmentId: string) => void;
  className?: string;
}

export const AttachmentList = memo(function AttachmentList({
  attachments,
  onDeleteAttachment,
  className,
}: AttachmentListProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Paperclip size={16} className="text-text-secondary" />
        <h4 className="text-sm font-medium text-text-primary">
          Attachments ({attachments.length})
        </h4>
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            onDelete={onDeleteAttachment}
          />
        ))}
      </div>
    </div>
  );
});
