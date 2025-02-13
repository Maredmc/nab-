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
  const [bedBaseY, setBedBaseY] = useState(0);

  // Calcoliamo la posizione della base del letto
  useEffect(() => {
    if (gltfBed.scene) {
      const boundingBox = new Box3().setFromObject(gltfBed.scene);
      const center = new Vector3();
      boundingBox.getCenter(center);
      gltfBed.scene.position.sub(center);

      setBedBaseY(boundingBox.min.y); // Base del letto

      camera.position.set(0, 1, 3);
    }
  }, [gltfBed, camera]);

  return (
    <group ref={bedRef}>
      {/* Modello principale */}
      <primitive object={gltfBed.scene} />

      {/* Piedini/Piedone posizionati manualmente */}
      {selectedAddon === "piedini" && (
        <primitive object={gltfPiedini.scene} position={[-2, bedBaseY, -0.5]} />
      )}
      {selectedAddon === "piedone" && (
        <primitive object={gltfPiedone.scene} position={[-2, bedBaseY, -0.5]} />
      )}
    </group>
  );
}
