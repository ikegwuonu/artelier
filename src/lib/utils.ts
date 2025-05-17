import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper function to check if a file is a valid 3D model
export function isValidModelFile(file: File): boolean {
  const validExtensions = [".glb", ".gltf"];
  const extension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();
  return validExtensions.includes(extension);
}

// Helper function to position clothing on avatar
// This is a simplified version - in a real app, this would be more sophisticated
export function positionClothingOnAvatar(avatarModel: any, clothingModel: any) {
  // Basic positioning logic would go here
  return {
    avatar: avatarModel,
    clothing: clothingModel,
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
