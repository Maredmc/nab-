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

  const { camera } = useThree();

  // Allineare il modello principale alla base
  useEffect(() => {
    if (gltfBed.scene) {
      const boundingBox = new Box3().setFromObject(gltfBed.scene);
      const center = new Vector3();
      boundingBox.getCenter(center);
      gltfBed.scene.position.sub(center);

      // Troviamo il punto più basso del letto
      const minY = boundingBox.min.y;
      gltfBed.scene.position.y -= minY; // Allineiamo il letto al suolo

      // Spostiamo la camera più vicina al modello
      camera.position.set(0, 1, 3);
    }
  }, [gltfBed, camera]);

  return (
    <group ref={bedRef}>
      {/* Modello principale */}
      <primitive object={gltfBed.scene} />

      {/* Piedini e Piedone inclusi come mesh */}
      <group visible={selectedAddon === "piedini"}>
        <primitive object={gltfPiedini.scene} />
      </group>
      <group visible={selectedAddon === "piedone"}>
        <primitive object={gltfPiedone.scene} />
      </group>
    </group>
  );
}
