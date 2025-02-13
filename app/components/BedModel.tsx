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

  // Calcola la posizione della base del letto e la posizione per i piedini/piedoni
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
      camera.position.set(0, 1, 2.5);
    }
  }, [gltfBed, camera]);

  // Funzione per ottenere la posizione esatta sotto il letto
  const getAddonPosition = (addonScene: any) => {
    if (!bedRef.current || !addonScene) return [0, 0, 0];

    const bedBox = new Box3().setFromObject(bedRef.current);
    const addonBox = new Box3().setFromObject(addonScene);

    const bedMinY = bedBox.min.y; // Punto più basso del letto
    const addonHeight = addonBox.max.y - addonBox.min.y; // Altezza dei piedini/piedone

    return [0, bedMinY - addonHeight / 2, 0]; // Posizioniamo i piedini/piedoni sotto il letto
  };

  return (
    <group ref={bedRef}>
      {/* Modello principale */}
      <primitive object={gltfBed.scene} />

      {/* Aggiunta dinamica del modello selezionato con posizione corretta */}
      {selectedAddon === "piedini" && (
        <primitive object={gltfPiedini.scene} position={getAddonPosition(gltfPiedini.scene)} />
      )}
      {selectedAddon === "piedone" && (
        <primitive object={gltfPiedone.scene} position={getAddonPosition(gltfPiedone.scene)} />
      )}
    </group>
  );
}
