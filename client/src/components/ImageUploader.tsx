import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  multiple?: boolean;
}

export function ImageUploader({
  onImagesSelected,
  maxFiles = 20,
  maxSizeMB = 10,
  label = "Upload Images",
  description = "Drag and drop or click to select",
  multiple = true,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    // Check total file count
    if (selectedFiles.length + newFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    newFiles.forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxSizeMB}MB limit`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        validPreviews.push(e.target?.result as string);
        if (validPreviews.length === validFiles.length) {
          setSelectedFiles((prev) => [...prev, ...validFiles]);
          setPreviews((prev) => [...prev, ...validPreviews]);
          onImagesSelected([...selectedFiles, ...validFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onImagesSelected(newFiles);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <p className="text-xs text-gray-500 mb-3">{description} (Max {maxFiles} images, {maxSizeMB}MB each)</p>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#0055A4] hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to {maxSizeMB}MB</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {previews.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {previews.length} image{previews.length !== 1 ? "s" : ""} selected
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
