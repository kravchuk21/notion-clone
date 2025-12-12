import { forwardRef, useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, X, File, Image, FileText, Archive } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

export interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
}

const getFileIcon = (file: File) => {
  const type = file.type;

  if (type.startsWith('image/')) {
    return <Image size={16} className="text-blue-500" />;
  }

  if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
    return <FileText size={16} className="text-red-500" />;
  }

  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) {
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

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    onFileSelect,
    accept = '*',
    maxFiles = 5,
    maxSize = 10, // 10MB default
    disabled = false,
    className,
  }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const validateFiles = useCallback((files: File[]): File[] => {
      const validFiles: File[] = [];
      const maxSizeBytes = maxSize * 1024 * 1024;

      for (const file of files) {
        if (file.size > maxSizeBytes) {
          console.warn(`File "${file.name}" is too large. Maximum size is ${maxSize}MB.`);
          continue;
        }

        if (selectedFiles.length + validFiles.length >= maxFiles) {
          console.warn(`Maximum ${maxFiles} files allowed.`);
          break;
        }

        validFiles.push(file);
      }

      return validFiles;
    }, [selectedFiles, maxFiles, maxSize]);

    const handleFiles = useCallback((files: FileList | null) => {
      if (!files || disabled) return;

      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length > 0) {
        const newFiles = [...selectedFiles, ...validFiles];
        setSelectedFiles(newFiles);
        onFileSelect(newFiles);
      }
    }, [disabled, validateFiles, selectedFiles, onFileSelect]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }, [handleFiles]);

    const removeFile = useCallback((index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      onFileSelect(newFiles);
    }, [selectedFiles, onFileSelect]);

    const clearAll = useCallback(() => {
      setSelectedFiles([]);
      onFileSelect([]);
    }, [onFileSelect]);

    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            isDragOver
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-border-hover',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-text-secondary" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-text-secondary">
                Maximum {maxFiles} files, up to {maxSize}MB each
              </p>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-text-primary">
                Selected Files ({selectedFiles.length})
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-text-secondary hover:text-text-primary"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 p-2 bg-bg-secondary rounded-md"
                >
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-text-secondary hover:text-red-500 p-1"
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
