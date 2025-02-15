"use client"
import { useRef, useEffect } from "react"
import { useLoader, useThree } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Box3, Vector3, TextureLoader, MeshStandardMaterial, Color } from "three"

interface BedModelProps {
  selectedSideRails: string | null
  selectedSupportKit: string | null
  bedColor: string
  bedSize: string
}

export default function BedModel({ selectedSideRails, selectedSupportKit, bedColor, bedSize }: BedModelProps) {
  const bedRef = useRef<any>(null)
  const { camera } = useThree()

  // Carica la texture del legno
  const woodTexture = useLoader(TextureLoader, "/models/wood.jpg")

  // Scurisci la texture
  useEffect(() => {
    woodTexture.repeat.set(2, 2)
    woodTexture.wrapS = woodTexture.wrapT = 1000 // Ripeti la texture
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    const img = woodTexture.image
    canvas.width = img.width
    canvas.height = img.height
    context?.drawImage(img, 0, 0)
    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
    if (imageData) {
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] *= 0.8 // Rosso
        imageData.data[i + 1] *= 0.8 // Verde
        imageData.data[i + 2] *= 0.8 // Blu
      }
      context?.putImageData(imageData, 0, 0)
    }
    woodTexture.image = canvas
    woodTexture.needsUpdate = true
  }, [woodTexture])

  // Carica i modelli base per ogni dimensione
  const singleBed = useLoader(GLTFLoader, "/models/senza_sponde_a_terra.gltf")
  // TODO: Aggiungere i modelli per il letto a una piazza e mezza e il letto singolo ridotto
  // const oneAndHalfBed = useLoader(GLTFLoader, "/models/one_and_half_bed.gltf");
  // const reducedSingleBed = useLoader(GLTFLoader, "/models/reduced_single_bed.gltf");

  // Carica i modelli per le sponde e i supporti
  const gltfPiedini = useLoader(GLTFLoader, "/models/piedini.gltf")
  const gltfPiedone = useLoader(GLTFLoader, "/models/piedone.gltf")
  const gltfSpondeMetaSuperiore = useLoader(GLTFLoader, "/models/set_sponde_meta_superiore.gltf")
  const gltfSetCompleto = useLoader(GLTFLoader, "/models/set_completo.gltf")

  useEffect(() => {
    let currentBed
    switch (bedSize) {
      case "single":
        currentBed = singleBed
        break
      case "one_and_half":
        currentBed = singleBed // Temporaneamente usiamo singleBed
        break
      case "reduced_single":
        currentBed = singleBed // Temporaneamente usiamo singleBed
        break
      default:
        currentBed = singleBed
    }

    if (currentBed.scene) {
      const boundingBox = new Box3().setFromObject(currentBed.scene)
      const center = new Vector3()
      boundingBox.getCenter(center)
      currentBed.scene.position.sub(center)
      camera.position.set(0, 1, 3)

      // Applica la texture e il colore al letto
      currentBed.scene.traverse((child) => {
        if (child.isMesh) {
          const material = new MeshStandardMaterial({
            map: woodTexture,
            color: bedColor === "white" ? new Color(0xffffff) : new Color(0xf5deb3),
          })
          child.material = material
        }
      })
    }

    // Applica la texture a tutti gli altri modelli
    const applyTextureToModel = (model: any) => {
      model.scene.traverse((child: any) => {
        if (child.isMesh) {
          const material = new MeshStandardMaterial({
            map: woodTexture,
            color: bedColor === "white" ? new Color(0xffffff) : new Color(0xf5deb3),
          })
          child.material = material
        }
      })
    }

    applyTextureToModel(gltfPiedini)
    applyTextureToModel(gltfPiedone)
    applyTextureToModel(gltfSpondeMetaSuperiore)
    applyTextureToModel(gltfSetCompleto)
  }, [
    bedSize,
    bedColor,
    singleBed,
    woodTexture,
    camera,
    gltfPiedini,
    gltfPiedone,
    gltfSpondeMetaSuperiore,
    gltfSetCompleto,
  ])

  const renderBedModel = () => {
    switch (bedSize) {
      case "single":
        return <primitive object={singleBed.scene} />
      case "one_and_half":
        return <primitive object={singleBed.scene} /> // Temporaneamente usiamo singleBed
      case "reduced_single":
        return <primitive object={singleBed.scene} /> // Temporaneamente usiamo singleBed
      default:
        return <primitive object={singleBed.scene} />
    }
  }

  const renderSideRails = () => {
    if (selectedSideRails === "SpondeMetaSuperiore") {
      return <primitive object={gltfSpondeMetaSuperiore.scene} position={[-3.55, -0.15, 1.645]} scale={1} />
    } else if (selectedSideRails === "SetCompleto") {
      return <primitive object={gltfSetCompleto.scene} position={[-3.55, -0.15, 1.645]} scale={1} />
    }
    return null
  }

  const renderSupportKit = () => {
    if (selectedSupportKit === "piedini") {
      return <primitive object={gltfPiedini.scene} position={[-3.555, -0.15, 1.6397]} scale={1} />
    } else if (selectedSupportKit === "piedone") {
      return <primitive object={gltfPiedone.scene} position={[-3.55, -0.15, -0.973]} scale={1} />
    }
    return null
  }

  return (
    <>
      <group ref={bedRef}>
        {renderBedModel()}
        {renderSideRails()}
        {renderSupportKit()}
      </group>
    </>
  )
}
