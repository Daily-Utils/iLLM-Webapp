import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { AlertCircle, FileCheck, Trash2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

export default function DragDropPDFUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: File[]) => {
    setError(null);
    const validFiles = newFiles.filter((file) => {
      if (file.type !== "application/pdf") {
        setError("Please select only PDF files.");
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("One or more files exceed the 20MB limit.");
        return false;
      }
      return true;
    });

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFiles(acceptedFiles);
    },
    [handleFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
    noClick: true,
  });

  const handleDelete = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      handleFiles(Array.from(event.target.files));
    }
  };

  return (
    <ScrollArea className="h-[60vh]">
      <div className="w-full max-w-md mx-auto space-y-6 p-4">
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf"
            multiple
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag 'n' drop some PDF files here
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Only PDF files up to 20MB each are accepted)
          </p>
          <Button
            onClick={handleSelectFiles}
            type="button"
            variant="outline"
            className="mt-4"
          >
            Select Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Uploaded PDFs:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-900 p-3 rounded-lg w-full"
              >
                <div className="flex items-center space-x-3 truncate w-[60%]">
                  <FileCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="truncate flex-1 w-[50%]">{file.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {(files.length > 0 || error) && (
          <>
            <Button onClick={handleReset} variant="destructive" className="w-full">
              Reset
            </Button>

            <Button variant="default" className="w-full">
              Upload
            </Button>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
