import { storagePut } from "../storage";

export async function uploadSchoolImage(
  file: Buffer,
  schoolId: number,
  fileName: string,
  contentType: string
): Promise<{ key: string; url: string }> {
  // Validate file
  if (!file || file.length === 0) {
    throw new Error("File is empty");
  }

  if (file.length > 10 * 1024 * 1024) {
    throw new Error("File exceeds 10MB limit");
  }

  // Validate content type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(contentType)) {
    throw new Error("Invalid image format. Allowed: JPEG, PNG, GIF, WebP");
  }

  // Generate unique file name
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = contentType.split("/")[1];
  const uniqueFileName = `school-${schoolId}-${timestamp}-${randomStr}.${extension}`;
  const key = `schools/${schoolId}/images/${uniqueFileName}`;

  try {
    const result = await storagePut(key, file, contentType);
    return result;
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error("Failed to upload image to storage");
  }
}

export async function uploadSchoolLogo(
  file: Buffer,
  schoolId: number,
  contentType: string
): Promise<{ key: string; url: string }> {
  // Validate logo file size (smaller than gallery images)
  if (file.length > 5 * 1024 * 1024) {
    throw new Error("Logo exceeds 5MB limit");
  }

  const timestamp = Date.now();
  const extension = contentType.split("/")[1];
  const uniqueFileName = `logo-${schoolId}-${timestamp}.${extension}`;
  const key = `schools/${schoolId}/logo/${uniqueFileName}`;

  try {
    const result = await storagePut(key, file, contentType);
    return result;
  } catch (error) {
    console.error("Logo upload error:", error);
    throw new Error("Failed to upload logo to storage");
  }
}

export function validateImageFile(
  file: File
): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: "Image exceeds 10MB limit" };
  }

  // Check allowed formats
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Image format not supported" };
  }

  return { valid: true };
}
