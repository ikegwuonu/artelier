"use client";

import { useEffect, useState, Suspense, useMemo, JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box, Typography, CircularProgress } from "@mui/material";
import * as THREE from "three";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function PlaceholderMesh() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
}

type ModelProps = {
  url: string;
  clothingUrl?: boolean;
  color?: string;
  visible?: boolean;
} & Partial<JSX.IntrinsicElements["primitive"]>;

export function Model({
  url,
  clothingUrl,
  color = "#fff",
  visible = true,
  ...props
}: ModelProps) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => scene.clone(), [scene]);
  useEffect(() => {
    if (!clothingUrl) return;

    clonedScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        (node as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
        });
      }
    });
  }, [clothingUrl, color, clonedScene]);

  return <primitive {...props} object={clonedScene} visible={visible} />;
}

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
              <Model url={avatarUrl} color="#1976d2" clothingUrl={false} />
              {clothingUrl && showClothing && (
                <Model
                  clothingUrl={true}
                  url={clothingUrl}
                  color={clothingColor}
                  visible={showClothing}
                  scale={[1.5, 1.27, 1.8]}
                  position={[-0.01, -0.063, 0.06]}
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
