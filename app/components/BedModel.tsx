"use client"
import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface BedModelProps {
  size: string
  sideRails: string
  evolutionKit: string
  color: string
  showDimensions: boolean
}

export default function BedModel({ size, sideRails, evolutionKit, color, showDimensions }: BedModelProps) {
  const bedRef = useRef() // Riferimento al modello
  const gltf = useLoader(GLTFLoader, "/models/EC19080.gltf");

  // Aggiorniamo la rotazione solo del modello, non del gruppo
  useFrame((state, delta) => {
    if (bedRef.current) {
      bedRef.current.rotation.y += delta * 0.2; // Ruota il modello intorno all'asse Y
    }
  })

  return (
    <group>
      {/* Gruppo contenitore per il modello */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* Modello 3D con rotazione dinamica */}
        <mesh ref={bedRef}>
          <primitive object={gltf.scene} scale={[1, 1, 1]} />
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
    </group>
  )
}
