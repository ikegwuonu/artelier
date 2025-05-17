"use client";

import type React from "react";

import { useState } from "react";
import { Box, Typography, TextField, Popover } from "@mui/material";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
  disabled?: boolean;
}

export default function ColorPicker({
  color,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" gutterBottom>
        Clothing Color
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            border: "1px solid #ccc",
            backgroundColor: color,
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
            mr: 1,
          }}
          onClick={handleClick}
        />

        <TextField
          value={color}
          size="small"
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 1 }}>
          <HexColorPicker color={color} onChange={onChange} />
        </Box>
      </Popover>
    </Box>
  );
}
