"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { processPdfForAccount } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloudIcon, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function PdfUploadButton({ accountId }: { accountId: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // When a file is chosen:
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    // Don't upload yet, just select.
  };

  // On confirm:
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("pdfStatement", selectedFile);
    try {
      const result = await processPdfForAccount(formData, accountId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        router.refresh();
      }
      setSelectedFile(null); // Clear file after attempt
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove selected file (before confirm)
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf"
        disabled={isUploading}
      />

      {/* Upload Button */}
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        variant={selectedFile ? "outline" : "default"}
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UploadCloudIcon className="mr-2 h-4 w-4 text-violet-400" />
        )}
        {selectedFile ?<p className="text-black">Change Pdf</p> : "Upload Pdf"}
      </Button>

      {/* Show filename and confirm/cancel if a file is ready */}
      {selectedFile && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-violet-900/10 to-blue-800/5 rounded-full px-3 py-1.5 border border-violet-400/25 text-sm shadow-sm">
          <span className="truncate max-w-[160px] text-violet-800 dark:text-violet-100 font-medium" title={selectedFile.name}>
            {selectedFile.name}
          </span>
          <Button
            size="sm"
            className="ml-2 bg-green-600 hover:bg-green-800 text-white"
            onClick={handleConfirmUpload}
            disabled={isUploading}
            title="Confirm upload"
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Confirm
          </Button>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="ml-1 text-gray-400 hover:text-red-500"
            title="Remove file"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
