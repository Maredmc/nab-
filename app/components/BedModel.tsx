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
  const [bedPosition, setBedPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [bedSize, setBedSize] = useState<{ width: number; length: number; height: number }>({
    width: 0,
    length: 0,
    height: 0,
  });

  // Calcoliamo posizione e dimensioni del letto nel Canvas
  useEffect(() => {
    if (gltfBed.scene) {
      const boundingBox = new Box3().setFromObject(gltfBed.scene);
      const center = new Vector3();
      boundingBox.getCenter(center);

      // Otteniamo dimensioni reali del letto
      const width = (boundingBox.max.x - boundingBox.min.x) / 2;
      const length = (boundingBox.max.z - boundingBox.min.z) / 2;
      const height = boundingBox.max.y - boundingBox.min.y;

      // Posizioniamo il letto al centro e salviamo posizione e dimensioni
      gltfBed.scene.position.sub(center);
      setBedPosition([0, -boundingBox.min.y, 0]);
      setBedSize({ width, length, height });

      // Spostiamo la camera in posizione ottimale
      camera.position.set(0, 1, 3);
    }
  }, [gltfBed, camera]);

  // Posizioni precise dei piedini/piedone basate sulla posizione del letto
  const legPositions = [
    [-bedSize.width, bedPosition[1], -bedSize.length], // Angolo sinistro posteriore
    [bedSize.width, bedPosition[1], -bedSize.length],  // Angolo destro posteriore
    [-bedSize.width, bedPosition[1], bedSize.length],  // Angolo sinistro anteriore
    [bedSize.width, bedPosition[1], bedSize.length]   // Angolo destro anteriore
  ];

  return (
    <group ref={bedRef}>
      {/* Modello principale */}
      <primitive object={gltfBed.scene} position={bedPosition} />

      {/* Piedini o Piedoni agganciati direttamente al letto */}
      {selectedAddon === "piedini" &&
        legPositions.map((pos, index) => (
          <primitive key={index} object={gltfPiedini.scene.clone()} position={pos} />
        ))}

      {selectedAddon === "piedone" &&
        legPositions.map((pos, index) => (
          <primitive key={index} object={gltfPiedone.scene.clone()} position={pos} />
        ))}
    </group>
  );
}
