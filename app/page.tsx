"use client";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";

// Importa dinamicamente il componente BedModel per evitare problemi con SSR
const BedModel = dynamic(() => import("./components/BedModel"), { ssr: false });

export default function BedConfigurator() {
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Contenitore principale */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sezione del modello 3D */}
        <div className="relative w-full">
          <Canvas camera={{ position: [0, 1.5, 5] }}> {/* Aumenta la distanza della telecamera */}
            {/* Luci realistiche */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[1, 2, 3]} intensity={0.8} />

            {/* Modello del letto */}
            <BedModel
              size="190x80"
              sideRails="none"
              evolutionKit="none"
              isBioPaint={false}
              showDimensions={false}
            />

            {/* OrbitControls per ruotare il modello manualmente */}
            <OrbitControls
              enableZoom={true}
              enableRotate={true}
              enablePan={false}
              target={[0, 0, 0]}
              autoRotate={false}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
