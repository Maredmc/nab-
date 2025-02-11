"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Text } from "@react-three/drei"

interface BedModelProps {
  size: string
  sideRails: string
  evolutionKit: string
  color: string
  showDimensions: boolean
}

export default function BedModel({ size, sideRails, evolutionKit, color, showDimensions }: BedModelProps) {
  const bedRef = useRef()

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
      {/* Bed frame */}
      <Box args={[width, height, length]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={bedColor} />
      </Box>

      {/* Mattress */}
      <Box args={[width - 0.05, 0.2, length - 0.05]} position={[0, height + 0.1, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>

      {/* Side rails */}
      {sideRails !== "none" && (
        <>
          {/* Left rail */}
          <Box
            args={[0.05, 0.3, sideRails === "half" ? length / 2 : length]}
            position={[-width / 2, height + 0.25, sideRails === "half" ? length / 4 : 0]}
          >
            <meshStandardMaterial color={bedColor} />
          </Box>

          {/* Right rail */}
          <Box
            args={[0.05, 0.3, sideRails === "half" ? length / 2 : length]}
            position={[width / 2, height + 0.25, sideRails === "half" ? length / 4 : 0]}
          >
            <meshStandardMaterial color={bedColor} />
          </Box>

          {/* Headboard */}
          {(sideRails === "full" || sideRails === "ends") && (
            <Box args={[width, 0.5, 0.05]} position={[0, height + 0.35, -length / 2]}>
              <meshStandardMaterial color={bedColor} />
            </Box>
          )}

          {/* Footboard */}
          {(sideRails === "full" || sideRails === "ends") && (
            <Box args={[width, 0.5, 0.05]} position={[0, height + 0.35, length / 2]}>
              <meshStandardMaterial color={bedColor} />
            </Box>
          )}
        </>
      )}

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

