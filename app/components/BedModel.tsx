"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

interface BedModelProps {
  size: string;
  sideRails: string;
  evolutionKit: string;
  isBioPaint: boolean;
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
  const [modelLoaded, setModelLoaded] = useState(false);

useEffect(() => {
  const loadModel = async () => {
    try {
      console.log("Caricamento del file .obj...");
      const objLoader = new OBJLoader();
      const model = await objLoader.loadAsync("/models/EARTH_senza_sponde.obj");

      if (model && model.children.length > 0) {
        console.log("Modello caricato:", model);

        // Applica un materiale visibile
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
          }
        });

        // Centra il modello
        const boundingBox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        model.position.sub(center);

        // Normalizza le dimensioni
        const sizeX = boundingBox.max.x - boundingBox.min.x;
        const sizeZ = boundingBox.max.z - boundingBox.min.z;
        const scaleFactor = 1.9 / Math.max(sizeX, sizeZ); // Scala in base alla lunghezza di 190cm
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Aggiusta la posizione per evitare che affondi nel pavimento
        model.position.setY(-boundingBox.min.y * scaleFactor + 0.1); // Sposta leggermente sopra il pavimento

        // Aggiungi il modello al gruppo
        if (bedRef.current) {
          bedRef.current.add(model);
        }

        setModelLoaded(true); // Segna il modello come caricato
      }
    } catch (error) {
      console.error("Errore durante il caricamento del modello:", error);
    }
  };

  loadModel();
}, []);

  // Rotazione automatica del letto
  useFrame((_, delta) => {
    if (bedRef.current) {
      bedRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <group ref={bedRef} scale={1}>
        {/* Debug: Aiuto visivo per vedere il bounding box */}
        {modelLoaded && (
          <mesh>
            <boxHelper args={[bedRef.current, 0xff0000]} />
          </mesh>
        )}

        {/* Pavimento */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="gray" roughness={0.8} />
        </mesh>

        {/* Dimensioni visualizzate se richieste */}
        {showDimensions && (
          <>
            <Text position={[0, -0.1, 0.95]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="yellow">
              {"190 cm"}
            </Text>
            <Text position={[0.4, -0.1, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} fontSize={0.1} color="yellow">
              {"80 cm"}
            </Text>
          </>
        )}
      </group>
    </>
  );
}

