"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onTextExtracted: (text: string, filename: string) => void;
  isLoading: boolean;
}

export function FileUpload({ onTextExtracted, isLoading }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file) return;

    setFilename(file.name);

    if (file.type === "application/pdf") {
      const { extractTextFromPDF } = await import("@/lib/pdfExtract");
      const text = await extractTextFromPDF(file);
      onTextExtracted(text, file.name);
    } else {
      const text = await file.text();
      onTextExtracted(text, file.name);
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
        transition-colors duration-200
        ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"}
        ${isLoading ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {filename ? (
        <div className="flex flex-col items-center gap-2">
          <FileText className="w-10 h-10 text-primary" />
          <p className="text-sm font-medium">{filename}</p>
          <p className="text-xs text-muted-foreground">Click to change file</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-10 h-10 text-muted-foreground" />
          <p className="text-sm font-medium">Drop PDF or text file here</p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
        </div>
      )}
    </div>
  );
}