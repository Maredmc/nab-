"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

interface BedModelProps {
  size: string; // Dimensioni del letto (es. "190x80", "160x80", ecc.)
  sideRails: string;
  evolutionKit: string;
  isBioPaint: boolean; // Stato per Bio Paint
  showDimensions: boolean;
}

export default function BedModel({
  size,
  sideRails,
  evolutionKit,
  isBioPaint,
  showDimensions,
}: BedModelProps) {
  const bedRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Carica il file .obj
        const objLoader = new OBJLoader();
        const model = await objLoader.loadAsync("/models/EARTH _senza_sponde.obj");

        if (model && model.children.length > 0) {
          // Applica un materiale semplice a tutte le mesh del modello
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Colore bianco uniforme
            }
          });

          // Centra il modello
          const boundingBox = new THREE.Box3().setFromObject(model);
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          model.position.sub(center);

          // Normalizza le dimensioni del modello
          const sizeX = boundingBox.max.x - boundingBox.min.x;
          const sizeZ = boundingBox.max.z - boundingBox.min.z;
          const scaleFactor = Math.max(sizeX, sizeZ) / 1.9; // Scala in modo che il letto sia ~190cm lungo
          model.scale.set(1 / scaleFactor, 1 / scaleFactor, 1 / scaleFactor);

          // Aggiungi il modello al riferimento
          if (bedRef.current) {
            bedRef.current.add(model);
          }
        }
      } catch (error) {
        console.error("Errore durante il caricamento del modello:", error);
      }
    };

    loadModel();
  }, []);

  // Funzione per calcolare la scala basata sulle dimensioni selezionate
  const getScaleFactor = (size: string): number => {
    const sizeMap: { [key: string]: number } = {
      "190x80": 1, // Dimensione predefinita
      "160x80": 0.84, // Scala proporzionale
      "200x90": 1.05, // Scala proporzionale
    };
    return sizeMap[size] || 1; // Valore predefinito
  };

  // Rotazione automatica lenta intorno all'asse Y
  useFrame((state, delta) => {
    if (bedRef.current) {
      bedRef.current.rotation.y += delta * 0.01; // Rotazione molto lenta
    }
  });

  return (
    <group ref={bedRef} scale={getScaleFactor(size)}>
      {/* Dimensioni visualizzate se richieste */}
      {showDimensions && (
        <>
          <Text
            position={[0, -0.1, 0.95]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.1}
            color="yellow"
          >
            {"190 cm"}
          </Text>
          <Text
            position={[0.4, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            fontSize={0.1}
            color="yellow"
          >
            {"80 cm"}
          </Text>
        </>
      )}
    </group>
  );
}
