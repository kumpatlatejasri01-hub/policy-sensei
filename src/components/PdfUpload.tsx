import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, Plus } from "lucide-react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

function isAcceptedFile(file: File) {
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  return ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
}

interface SingleUploadProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const SingleFileUpload = React.forwardRef<HTMLDivElement, SingleUploadProps>(({ label, file, onFileChange }, ref) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = Array.from(e.dataTransfer.files).find(isAcceptedFile);
      if (dropped) onFileChange(dropped);
    },
    [onFileChange]
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).find(isAcceptedFile);
    if (selected) onFileChange(selected);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="mb-1 block text-sm font-semibold text-foreground">{label}</label>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => onFileChange(null)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {!file && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary/40 hover:bg-muted/50"
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Drop your file here or click to upload</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, TXT</p>
          </div>
        </div>
      )}
    </div>
  );
});
SingleFileUpload.displayName = "SingleFileUpload";

interface PdfUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const PdfUpload = ({ files, onFilesChange }: PdfUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = Array.from(e.dataTransfer.files).filter(isAcceptedFile);
      if (dropped.length) onFilesChange([...files, ...dropped]);
    },
    [files, onFilesChange]
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(isAcceptedFile);
    if (selected.length) onFilesChange([...files, ...selected]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="mb-2 block text-sm font-semibold text-foreground">
        Upload Legal Document(s)
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <motion.div
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary/40 hover:bg-muted/50"
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={handleSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          {files.length > 0 ? (
            <Plus className="h-5 w-5 text-primary" />
          ) : (
            <Upload className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {files.length > 0 ? "Add more documents" : "Drop your documents here or click to upload"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX, TXT • Upload as many as you need</p>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;
