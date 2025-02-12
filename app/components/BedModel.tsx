"use client";
import { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"; // Importa OBJLoader
import { TextureLoader } from "three";
import { MeshStandardMaterial, Box3, Vector3 } from "three";

interface BedModelProps {
  size: string;
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
  const bedRef = useRef<any>(null); // Riferimento al modello
  const obj = useLoader(OBJLoader, "/models/Lettino EARTH _senza sponde.obj"); // Carica il file OBJ
  const woodTexture = useLoader(TextureLoader, "/textures/wood.jpg"); // Carica la texture del legno

  // Debug: Verifica il caricamento della texture
  useEffect(() => {
    if (woodTexture) {
      console.log("Wood texture loaded successfully:", woodTexture);
    } else {
      console.error("Failed to load wood texture.");
    }
  }, [woodTexture]);

  // Funzione per centrare il modello
  useEffect(() => {
    if (obj && obj.children.length > 0) {
      const boundingBox = new Box3().setFromObject(obj);
      const center = new Vector3();
      boundingBox.getCenter(center);
      obj.position.sub(center); // Sposta il modello al centro
    }
  }, [obj]);

  // Rotazione automatica lenta intorno all'asse Y
  useFrame((state, delta) => {
    if (bedRef.current) {
      bedRef.current.rotation.y += delta * 0.01; // Rotazione molto lenta
    }
  });

  return (
    <group>
      {/* Gruppo contenitore centrato */}
      <mesh ref={bedRef} position={[0, 0, 0]}>
        <primitive object={obj} scale={[1, 1, 1]} />
        {/* Applica il materiale corretto in base allo stato */}
        <meshStandardMaterial
          attach="material"
          map={isBioPaint ? null : woodTexture} // Usa la texture del legno se non è bio paint
          color={isBioPaint ? "white" : "#F5DEB3"} // Colore bianco se bio paint
          roughness={0.7} // Simula il legno ruvido
          metalness={0.1} // Riduce l'effetto metallico
        />
      </mesh>

      {/* Dimensioni visualizzate se richieste */}
      {showDimensions && obj && (
        <>
          <Text
            position={[0, -0.1, obj.geometry.boundingSphere.radius + 0.1]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.1}
            color="yellow"
          >
            {"190 cm"}
          </Text>
          <Text
            position={[0.5, -0.1, 0]}
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
