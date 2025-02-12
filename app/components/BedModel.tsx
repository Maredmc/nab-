"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync("/models/EARTH_senza_sponde.gltf");

        if (gltf.scene) {
          // Centra il modello
          const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          gltf.scene.position.sub(center);

          // Normalizza le dimensioni
          const sizeX = boundingBox.max.x - boundingBox.min.x;
          const sizeZ = boundingBox.max.z - boundingBox.min.z;
          const scaleFactor = 1.9 / Math.max(sizeX, sizeZ); // Scala in base alla lunghezza di 190cm
          gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

          // Sposta il modello sopra il pavimento
          gltf.scene.position.setY(-boundingBox.min.y * scaleFactor + 0.1);

          // Aggiungi il modello al gruppo
          if (bedRef.current) {
            bedRef.current.add(gltf.scene);
          }
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
    <group ref={bedRef} position={[0, 0, 0]} scale={1}>
      {/* Pavimento */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="gray" roughness={0.8} />
      </mesh>
    </group>
  );
}
