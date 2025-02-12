"use client";
import { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshStandardMaterial, Box3, Vector3, sRGBEncoding } from "three";

interface BedModelProps {
  size: string;
  sideRails: string;
  evolutionKit: string;
  color: string; // Colore del letto
  showDimensions: boolean;
}

export default function BedModel({
  size,
  sideRails,
  evolutionKit,
  color,
  showDimensions,
}: BedModelProps) {
  const bedRef = useRef<any>(null); // Riferimento al modello principale
  const [mainModel, setMainModel] = useState<any>(null); // Stato per il modello principale
  const [kitPiedini, setKitPiedini] = useState<any>(null); // Stato per Kit_piedini.gltf
  const [kitPiedoni, setKitPiedoni] = useState<any>(null); // Stato per Kit_piedoni.gltf

  // Caricamento del modello principale
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/models/EARTH_senza_sponde.gltf",
      (gltf) => {
        setMainModel(gltf);
      },
      undefined,
      (error) => {
        console.error("Errore durante il caricamento di EARTH_senza_sponde.gltf:", error);
      }
    );
  }, []);

  // Caricamento dei modelli aggiuntivi
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/models/Kit_piedini.gltf", setKitPiedini);
    loader.load("/models/Kit_piedoni.gltf", setKitPiedoni);
  }, []);

  // Funzione per centrare e ridimensionare il modello
  useEffect(() => {
    if (mainModel && mainModel.scene) {
      const boundingBox = new Box3().setFromObject(mainModel.scene);
      const center = new Vector3();
      boundingBox.getCenter(center);

      // Sposta il modello al centro
      mainModel.scene.position.sub(center);

      // Ottieni le dimensioni del modello
      const size = new Vector3();
      boundingBox.getSize(size);

      console.log("Dimensioni del modello:", size);

      // Ridimensiona il modello in modo proporzionale
      const maxDimension = Math.max(size.x, size.y, size.z);
      if (maxDimension > 0) { // Evita divisioni per zero
        mainModel.scene.scale.setScalar(3 / maxDimension); // Adegua la scala al campo visivo
      }
    }
  }, [mainModel]);

  // Rotazione automatica lenta intorno all'asse Y
  useFrame((state, delta) => {
    if (bedRef.current) {
      bedRef.current.rotation.y += delta * 0.01; // Rotazione molto lenta
    }
  });

  return (
    <group>
      {/* Spinner di caricamento */}
      {!mainModel && (
        <mesh position={[0, 0, -5]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="gray" wireframe />
          <Text position={[0, 1, 0]} fontSize={0.5}>
            Caricamento...
          </Text>
        </mesh>
      )}

      {/* Modello principale */}
      {mainModel && (
        <mesh ref={bedRef} position={[0, 0, -3]}>
          <primitive object={mainModel.scene} scale={mainModel ? [1, 1, 1] : [0, 0, 0]} />
          {/* Applica un materiale con colore del legno naturale */}
          {color && (
            <meshStandardMaterial
              attach="material"
              color={color}
              roughness={0.7} // Simula il legno ruvido
              metalness={0.1} // Riduce l'effetto metallico
            />
          )}
        </mesh>
      )}

      {/* Mostra Kit_piedini se evolutionKit === "piedini" */}
      {evolutionKit === "piedini" && kitPiedini && (
        <primitive object={kitPiedini.scene} position={[0, -0.5, -3]} scale={1} />
      )}

      {/* Mostra Kit_piedoni se evolutionKit === "piedoni" */}
      {evolutionKit === "piedoni" && kitPiedoni && (
        <primitive object={kitPiedoni.scene} position={[0, -0.5, -3]} scale={1} />
      )}

      {/* Dimensioni visualizzate se richieste */}
      {showDimensions && mainModel && (
        <>
          <Text
            position={[
              0,
              -0.1,
              -3 + mainModel.scene.children[0].geometry.boundingSphere.radius + 0.1,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.1}
            color="yellow"
          >
            {"190 cm"}
          </Text>
          <Text
            position={[0.5, -0.1, -3]}
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
