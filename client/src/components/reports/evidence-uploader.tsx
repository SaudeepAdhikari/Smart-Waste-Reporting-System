'use client';

import { useId, useRef, useState } from 'react';
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  MAX_EVIDENCE_IMAGES,
  MAX_IMAGE_SIZE_BYTES,
  type EvidenceImageItem,
} from '@/types/reports';
import { validateEvidenceFile } from '@/lib/validation/report';

interface EvidenceUploaderProps {
  images: EvidenceImageItem[];
  onChange: (images: EvidenceImageItem[]) => void;
  error?: string;
  disabled?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createEvidenceItem(file: File): EvidenceImageItem {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    previewUrl: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export function EvidenceUploader({
  images,
  onChange,
  error,
  disabled = false,
}: EvidenceUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const maxMb = MAX_IMAGE_SIZE_BYTES / (1024 * 1024);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setSelectionError(null);

    const remaining = MAX_EVIDENCE_IMAGES - images.length;
    if (remaining <= 0) {
      setSelectionError(
        `You can attach up to ${MAX_EVIDENCE_IMAGES} photos. Remove one to add another.`
      );
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    const selected = Array.from(fileList).slice(0, remaining);
    const accepted: EvidenceImageItem[] = [];
    const rejectionMessages: string[] = [];

    for (const file of selected) {
      const validationError = validateEvidenceFile(file);
      if (validationError) {
        rejectionMessages.push(validationError);
        continue;
      }
      accepted.push(createEvidenceItem(file));
    }

    if (fileList.length > remaining) {
      rejectionMessages.push(
        `Only ${remaining} more photo${remaining === 1 ? '' : 's'} can be added (maximum ${MAX_EVIDENCE_IMAGES}).`
      );
    }

    if (accepted.length > 0) {
      onChange([...images, ...accepted]);
    }

    if (rejectionMessages.length > 0) {
      setSelectionError(rejectionMessages[0]);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    const target = images.find((image) => image.id === id);
    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }
    setSelectionError(null);
    onChange(images.filter((image) => image.id !== id));
  };

  const displayError = error || selectionError;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Evidence photos (optional)
        </label>
        <p id={`${inputId}-hint`} className="text-sm text-zinc-500 dark:text-zinc-400">
          Add up to {MAX_EVIDENCE_IMAGES} photos (JPEG, PNG, or WEBP). Each file may
          be up to {maxMb} MB. Photos stay on your device until cloud upload is
          connected in a later phase.
        </p>
        <input
          ref={inputRef}
          id={inputId}
          name="evidenceImages"
          type="file"
          accept={`${ACCEPTED_IMAGE_EXTENSIONS},image/jpeg,image/png,image/webp`}
          multiple
          disabled={disabled || images.length >= MAX_EVIDENCE_IMAGES}
          onChange={(event) => handleFilesSelected(event.target.files)}
          aria-describedby={
            displayError ? `${inputId}-hint ${inputId}-error` : `${inputId}-hint`
          }
          aria-invalid={displayError ? 'true' : 'false'}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-md file:border-0 file:bg-green-600 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-green-700 disabled:opacity-50 dark:text-zinc-400"
        />
        {displayError && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {displayError}
          </p>
        )}
      </div>

      {images.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((image) => (
            <li
              key={image.id}
              className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Local object-URL preview; next/image is not used for ephemeral blob URLs. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.previewUrl}
                alt={`Preview of ${image.name}`}
                className="h-40 w-full object-cover"
              />
              <div className="flex items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {image.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatFileSize(image.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  disabled={disabled}
                  aria-label={`Remove ${image.name}`}
                  className="shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
