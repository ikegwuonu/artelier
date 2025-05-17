"use client";

import type React from "react";

import { useRef } from "react";
import {
  Paper,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, Refresh } from "@mui/icons-material";
import ColorPicker from "./color-picker";
import FileDropZone from "./file-drop-zone";

interface ControlPanelProps {
  onAvatarUpload: (file: File) => void;
  onClothingUpload: (file: File) => void;
  showClothing: boolean;
  setShowClothing: (value: boolean) => void;
  onReset: () => void;
  clothingColor: string;
  setClothingColor: (color: string) => void;
  isLoading: boolean;
  hasAvatar: boolean;
  hasClothing: boolean;
}

export default function ControlPanel({
  onAvatarUpload,
  onClothingUpload,
  showClothing,
  setShowClothing,
  onReset,
  clothingColor,
  setClothingColor,
  isLoading,
  hasAvatar,
  hasClothing,
}: ControlPanelProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarUpload(e.target.files[0]);
    }
  };

  const handleClothingFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onClothingUpload(e.target.files[0]);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Controls
      </Typography>

      <Divider sx={{ my: 2 }} />

      <FileDropZone
        onFileDrop={onAvatarUpload}
        accept=".glb,.gltf"
        label="Avatar"
        disabled={isLoading}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          Upload Avatar
          <input
            ref={avatarInputRef}
            type="file"
            hidden
            accept=".glb,.gltf"
            onChange={handleAvatarFileChange}
          />
        </Button>
      </FileDropZone>

      <FileDropZone
        onFileDrop={onClothingUpload}
        accept=".glb,.gltf"
        label="Clothing"
        disabled={isLoading || !hasAvatar}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          fullWidth
          disabled={isLoading || !hasAvatar}
          sx={{ mb: 2 }}
        >
          Upload Clothing
          <input
            ref={clothingInputRef}
            type="file"
            hidden
            accept=".glb,.gltf"
            onChange={handleClothingFileChange}
          />
        </Button>
      </FileDropZone>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={
          <Switch
            checked={showClothing}
            onChange={(e) => setShowClothing(e.target.checked)}
            disabled={!hasClothing || isLoading}
          />
        }
        label="Show Clothing"
        sx={{ mb: 2, width: "100%" }}
      />

      <ColorPicker
        color={clothingColor}
        onChange={setClothingColor}
        disabled={!hasClothing || isLoading || !showClothing}
      />

      <Divider sx={{ my: 2 }} />

      <Button
        variant="outlined"
        color="error"
        startIcon={<Refresh />}
        fullWidth
        onClick={onReset}
        disabled={isLoading || (!hasAvatar && !hasClothing)}
      >
        Reset Scene
      </Button>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Paper>
  );
}
