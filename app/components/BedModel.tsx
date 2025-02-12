"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
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

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Carica il file .mtl prima del modello .obj
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath("/models/");
        const materials = await mtlLoader.loadAsync("EARTH_senza_sponde.mtl");
        materials.preload();

        // Carica il modello .obj con i materiali
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        const model = await objLoader.loadAsync("/models/EARTH_senza_sponde.obj");

        if (model && model.children.length > 0) {
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

          // Sposta il modello sopra il pavimento
          model.position.setY(-boundingBox.min.y * scaleFactor + 0.1);

          // Aggiungi il modello al gruppo
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
