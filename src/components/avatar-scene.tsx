"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box, Typography, CircularProgress } from "@mui/material";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Simple placeholder mesh when no model is loaded
function PlaceholderMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
}

// Simplified model loader
export function Model({
  url,
  color = "#fff",
  visible = true,
}: {
  url: string;
  color?: string;
  visible?: boolean;
}) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        (node as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
        });
      }
    });
  }, [color, clonedScene]);

  return <primitive object={clonedScene} visible={visible} />;
}
// Loading indicator component
function LoadingIndicator() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Loading 3D model...
      </Typography>
    </Box>
  );
}

interface AvatarSceneProps {
  avatarUrl?: string | null;
  clothingUrl?: string | null;
  showClothing?: boolean;
  clothingColor?: string;
  onLoadingComplete?: () => void;
}

export default function AvatarScene({
  avatarUrl,
  clothingUrl,
  showClothing,
  clothingColor,
  onLoadingComplete,
}: AvatarSceneProps) {
  const [placeholderMessage, setPlaceholderMessage] = useState(
    "Upload an avatar to get started"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (avatarUrl) {
      setPlaceholderMessage(clothingUrl ? "" : "Now upload a clothing item");
      setIsLoading(true);
    } else {
      setPlaceholderMessage("Upload an avatar to get started");
      setIsLoading(false);
    }

    // Simulate loading complete after a delay
    const timeout = setTimeout(() => {
      if (onLoadingComplete && (avatarUrl || clothingUrl)) {
        setIsLoading(false);
        onLoadingComplete();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [avatarUrl, clothingUrl, onLoadingComplete]);

  return (
    <>
      {!avatarUrl && (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 5,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {placeholderMessage}
          </Typography>
        </Box>
      )}

      {isLoading && <LoadingIndicator />}

      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={1}
          maxDistance={10}
        />

        <Suspense fallback={null}>
          {avatarUrl ? (
            <group position={[0, 0, 0]}>
              <Model url={avatarUrl} />
              {clothingUrl && showClothing && (
                <Model
                  url={clothingUrl}
                  color={clothingColor}
                  visible={showClothing}
                />
              )}
            </group>
          ) : (
            <PlaceholderMesh />
          )}
        </Suspense>
      </Canvas>
    </>
  );
}
