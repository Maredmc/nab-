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

  // Funzione per centrare il letto e ottenere la base
  useEffect(() => {
    if (gltfBed.scene) {
      const boundingBox = new Box3().setFromObject(gltfBed.scene);
      const center = new Vector3();
      boundingBox.getCenter(center);
      gltfBed.scene.position.sub(center);

      // Calcoliamo la posizione alla base del letto
      const minY = boundingBox.min.y;
      gltfBed.scene.position.y -= minY;

      // Spostiamo la camera più vicina al modello
      camera.position.set(0, 1, 2.5);
    }
  }, [gltfBed, camera]);

  // Funzione per posizionare i piedini/piedone
  const getAddonPosition = () => {
    if (!bedRef.current) return [0, 0, 0];

    const boundingBox = new Box3().setFromObject(bedRef.current);
    const minY = boundingBox.min.y;
    return [0, minY, 0]; // Posizioniamo il kit alla base del letto
  };

  return (
    <group ref={bedRef}>
      {/* Modello principale */}
      <primitive object={gltfBed.scene} />

      {/* Aggiunta dinamica del modello selezionato con posizione corretta */}
      {selectedAddon === "piedini" && (
        <primitive object={gltfPiedini.scene} position={getAddonPosition()} />
      )}
      {selectedAddon === "piedone" && (
        <primitive object={gltfPiedone.scene} position={getAddonPosition()} />
      )}
    </group>
  );
}
