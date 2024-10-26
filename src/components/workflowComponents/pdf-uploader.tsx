import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { AlertCircle, FileCheck, Trash2, Upload } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
// import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { onFileUpload } from "../../server";


const MAX_FILE_SIZE = 20 * 1024 * 1024; 

export default function DragDropPDFUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    setFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectFiles = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      handleFiles(Array.from(event.target.files));
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError("Please select at least one PDF file to upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      console.log("Files to upload:", files);
      const formData = new FormData();
      files.forEach((file) => formData.append('pdfs', file));
      console.log("form",formData);
      
      const response = await onFileUpload("pdf",formData);
      console.log("response::>",response);
      

      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[60vh]">
      <form onSubmit={onSubmit} className="w-full max-w-md mx-auto space-y-6 p-4" encType="multipart/form-data" >
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
            accept="application/pdf"
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
          <button
            onClick={handleSelectFiles}
            type="button"
            className="mt-4 px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
          >
            Select Files
          </button>
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
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {(files.length > 0 || error) && (
          <div className="space-y-4">
            <button
              onClick={handleReset}
              type="button"
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md transition-colors
                ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}
      </form>
    </ScrollArea>
  );
}