"use client";

import { useState, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function FileDropZone({
  onFileDrop,
  children,
  accept = ".glb,.gltf",
  label = "File",
  disabled = false,
}: {
  onFileDrop: (file: File) => void;
  children: React.ReactNode;
  accept?: string;
  label?: string;
  disabled?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";

      if (accept.includes(fileExtension)) {
        onFileDrop(file);
      } else {
        alert(`Please upload a valid ${label} file (${accept})`);
      }
    }
  };

  return (
    <Box
      ref={dropZoneRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        position: "relative",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {isDragging && !disabled && (
        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            border: "2px dashed #1976d2",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <CloudUpload sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
          <Typography variant="body1" color="primary">
            Drop {label} here
          </Typography>
        </Paper>
      )}
      {children}
    </Box>
  );
}
