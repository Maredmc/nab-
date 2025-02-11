"use client"

import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { Box, Text } from "@react-three/drei"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

interface BedModelProps {
  size: string
  sideRails: string
  evolutionKit: string
  color: string
  showDimensions: boolean
}

export default function BedModel({ size, sideRails, evolutionKit, color, showDimensions }: BedModelProps) {
  const bedRef = useRef()
  const obj = useLoader(OBJLoader, "/EC19080.obj");

  useFrame((state, delta) => {
    bedRef.current.rotation.y += delta * 0.2
  })

  const bedDimensions = {
    single: [1.9, 0.8],
    reduced_single: [1.6, 0.8],
    one_and_half: [1.9, 1.2],
  }

  const [length, width] = bedDimensions[size] || bedDimensions.single
  const height = evolutionKit === "large" ? 0.23 : evolutionKit === "small" ? 0.11 : 0.05
  const bedColor = color === "white" ? "#FFFFFF" : "#D4B78F"

  return (
    <group ref={bedRef}>
      <primitive object={obj} scale={1} />

      {/* Dimensions */}
      {showDimensions && (
        <>
          <Text position={[0, -0.1, length / 2 + 0.1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="black">
            {`${length * 100} cm`}
          </Text>
          <Text
            position={[width / 2 + 0.1, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            fontSize={0.1}
            color="black"
          >
            {`${width * 100} cm`}
          </Text>
        </>
      )}
    </group>
  )
}

