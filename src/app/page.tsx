"use client";

import { useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import AvatarScene from "@/components/avatar-scene";
import ControlPanel from "@/components/control-panel";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/lib/theme";
import { extend } from "@react-three/fiber";
import { CircleGeometry } from "three";

extend({ CircleGeometry });

export default function Home() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [clothingUrl, setClothingUrl] = useState<string | null>(null);
  const [showClothing, setShowClothing] = useState(true);
  const [clothingColor, setClothingColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarUpload = (file: File) => {
    setIsLoading(true);
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    console.log("Avatar URL:", url, avatarUrl);
  };

  const handleClothingUpload = (file: File) => {
    setIsLoading(true);
    const url = URL.createObjectURL(file);
    setClothingUrl(url);
  };

  const handleReset = () => {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    if (clothingUrl) URL.revokeObjectURL(clothingUrl);
    setAvatarUrl(null);
    setClothingUrl(null);
    setShowClothing(true);
    setClothingColor("#ffffff");
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ height: "100vh", py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          3D Avatar Fitting App
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            height: "calc(100% - 80px)",
          }}
        >
          <Box sx={{ flex: 1, mb: { xs: 2, md: 0 }, mr: { md: 2 } }}>
            <Paper
              elevation={3}
              sx={{
                height: "100%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <AvatarScene
                avatarUrl={avatarUrl}
                clothingUrl={clothingUrl}
                showClothing={showClothing}
                clothingColor={clothingColor}
                onLoadingComplete={handleLoadingComplete}
              />
            </Paper>
          </Box>

          <Box sx={{ width: { xs: "100%", md: 300 } }}>
            <ControlPanel
              onAvatarUpload={handleAvatarUpload}
              onClothingUpload={handleClothingUpload}
              showClothing={showClothing}
              setShowClothing={setShowClothing}
              onReset={handleReset}
              clothingColor={clothingColor}
              setClothingColor={setClothingColor}
              isLoading={isLoading}
              hasAvatar={!!avatarUrl}
              hasClothing={!!clothingUrl}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
