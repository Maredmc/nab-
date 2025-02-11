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
  const bedRef = useRef()
  const gltf = useLoader(GLTFLoader, "/models/EC19080.gltf");

  useFrame((state, delta) => {
    if (bedRef.current) {
      bedRef.current.rotation.y += delta * 0.2;
    }
  })

  return (
    <group ref={bedRef}>
      <primitive object={gltf.scene} scale={[1, 1, 1]} />
      {/* Dimensions */}
      {showDimensions && (
        <>
          <Text position={[0, -0.1, 1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="#c29467">
            {"190 cm"}
          </Text>
          <Text
            position={[0.5, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            fontSize={0.1}
            color="black"
          >
            {"80 cm"}
          </Text>
        </>
      )}
    </group>
  )
}

