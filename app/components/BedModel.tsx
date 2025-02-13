"use client";
import { useRef, useEffect, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Box3, Vector3 } from "three";

interface BedModelProps {
  selectedAddon: string | null; // "piedini", "piedone" o null
}

export default function BedModel({ selectedAddon }: BedModelProps) {
  const bedRef = useRef<any>(null);
  const gltfBed = useLoader(GLTFLoader, "/models/senza_sponde_a_terra.gltf");
  const gltfPiedini = useLoader(GLTFLoader, "/models/piedini.gltf");
  const gltfPiedone = useLoader(GLTFLoader, "/models/piedone.gltf");

  const { camera } = useThree();
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    if (gltfBed.scene) {
      const boundingBox = new Box3().setFromObject(gltfBed.scene);
      const center = new Vector3();
      boundingBox.getCenter(center);
      gltfBed.scene.position.sub(center);

      const minY = boundingBox.min.y;
      gltfBed.scene.position.y -= minY;

      camera.position.set(0, 1, 3);
      setModelLoaded(true);
    }
  }, [gltfBed, camera]);

  return (
    <group ref={bedRef} visible={modelLoaded}>
      {/* Modello principale */}
      <primitive object={gltfBed.scene} />

      {/* Piedini e Piedoni come parte dello stesso gruppo */}
      {modelLoaded && (
        <>
          <primitive object={gltfPiedini.scene} visible={selectedAddon === "piedini"} />
          <primitive object={gltfPiedone.scene} visible={selectedAddon === "piedone"} />
        </>
      )}
    </group>
  );
}
