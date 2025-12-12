import { memo, useState } from 'react';
import { Download, Trash2, File, Image, FileText, Archive, Loader2 } from 'lucide-react';
import { Attachment } from '@/types';
import { attachmentsApi } from '@/api/attachments';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export interface AttachmentItemProps {
  attachment: Attachment;
  onDelete?: (attachmentId: string) => void;
  className?: string;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <Image size={16} className="text-blue-500" />;
  }

  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
    return <FileText size={16} className="text-red-500" />;
  }

  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
    return <Archive size={16} className="text-yellow-500" />;
  }

  return <File size={16} className="text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const AttachmentItem = memo(function AttachmentItem({
  attachment,
  onDelete,
  className,
}: AttachmentItemProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const blob = await attachmentsApi.download(attachment.id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download attachment:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || isDeleted || !onDelete) return;

    if (!confirm(`Are you sure you want to delete "${attachment.originalName}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await attachmentsApi.delete(attachment.id);
      setIsDeleted(true);
      onDelete(attachment.id);
    } catch (error) {
      console.error('Failed to delete attachment:', error);
      // Don't set isDeleted on error, so user can try again
    } finally {
      setIsDeleting(false);
    }
  };

  if (isDeleted) {
    return null; // Don't render deleted attachments
  }

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 bg-bg-secondary rounded-md border border-border',
      'hover:border-border-hover transition-colors',
      isDeleting && 'opacity-50',
      className
    )}>
      {/* File Icon */}
      {getFileIcon(attachment.mimeType)}

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {attachment.originalName}
        </p>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>{formatFileSize(attachment.size)}</span>
          <span>•</span>
          <span>{formatDate(attachment.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
          className="p-1 text-text-secondary hover:text-accent"
          title="Download file"
        >
          {isDownloading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
        </Button>

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-text-secondary hover:text-red-500"
            title="Delete file"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </Button>
        )}
      </div>
    </div>
  );
});
