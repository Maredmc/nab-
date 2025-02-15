import { Html } from "@react-three/drei"

interface MeasurementsOverlayProps {
  bedSize: string
}

export function MeasurementsOverlay({ bedSize }: MeasurementsOverlayProps) {
  const bedDimensions = {
    single: { width: 80, length: 190, height: 90 },
    one_and_half: { width: 120, length: 190, height: 90 },
    reduced_single: { width: 80, length: 160, height: 90 },
  }

  const dimensions = bedDimensions[bedSize]

  return (
    <group>
      <Html position={[0, 0.5, 1]} center>
        <div className="bg-white/90 px-2 py-1 rounded-md text-sm shadow-md">Larghezza: {dimensions.width}cm</div>
      </Html>
      <Html position={[1, 0.5, 0]} center>
        <div className="bg-white/90 px-2 py-1 rounded-md text-sm shadow-md">Lunghezza: {dimensions.length}cm</div>
      </Html>
      <Html position={[-1, 1, 0]} center>
        <div className="bg-white/90 px-2 py-1 rounded-md text-sm shadow-md">Altezza: {dimensions.height}cm</div>
      </Html>
    </group>
  )
}
