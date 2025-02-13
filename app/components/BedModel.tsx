"use client";
import { useRef, useEffect } from "react";
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

  const { camera } = useThree(); // Accesso alla camera

  // Centrare il modello principale e regolare la camera
  useEffect(() => {
    if (gltfBed.scene) {
      const boundingBox = new Box3().setFromObject(gltfBed.scene);
      const center = new Vector3();
      boundingBox.getCenter(center);
      gltfBed.scene.position.sub(center);

      // Spostiamo la camera più vicina al modello
      camera.position.set(0, 1, 2.5); // Avviciniamo il modello alla camera
    }
  }, [gltfBed, camera]);

  return (
    <group ref={bedRef}>
      <primitive object={gltfBed.scene} />
      {selectedAddon === "piedini" && <primitive object={gltfPiedini.scene} />}
      {selectedAddon === "piedone" && <primitive object={gltfPiedone.scene} />}
    </group>
  );
}
