"use client";
import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshStandardMaterial } from "three";

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
  const bedRef = useRef<any>(null); // Riferimento al modello
  const gltf = useLoader(GLTFLoader, "/models/EC19080.gltf");

  // Centra il modello nel mondo
  const centerModel = () => {
    if (gltf.scene && gltf.scene.children.length > 0) {
      const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
      const center = boundingBox.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center); // Sposta il modello al centro
    }
  };

  // Ruota il modello intorno al proprio asse
  useFrame((state, delta) => {
    if (bedRef.current) {
      bedRef.current.rotation.y += delta * 0.1; // Rotazione lenta intorno all'asse Y
    }
  });

  return (
    <group>
      {/* Gruppo contenitore centrato */}
      <mesh ref={bedRef} position={[0, 0, 0]} onBeforeRender={centerModel}>
        <primitive object={gltf.scene} scale={[1, 1, 1]} />
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

      {/* Dimensioni visualizzate se richieste */}
      {showDimensions && (
        <>
          <Text
            position={[0, -0.1, gltf.scene.children[0].geometry.boundingSphere.radius + 0.1]}
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
