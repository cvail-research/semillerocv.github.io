// components/FinalProjects.tsx
"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Project, projects } from "@/components/projects";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Container, Engine, InteractivityDetect } from "@tsparticles/engine";
import { Navbar } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CharacterCardProps {
  project: Project;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  touchable: boolean;
}

const ParticlesBackground = memo(() => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      console.log(container);
    },
    []
  );

  const options = useMemo(
    () => ({
      fpsLimit: 120,
      particles: {
        color: { value: "#2DD4BF" },
        links: {
          enable: true,
          color: "#2DD4BF",
          distance: 120,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none" as const,
          random: false,
          straight: false,
          outModes: { default: "bounce" as const },
        },
        number: {
          value: 150,
          density: { enable: true, area: 600 },
        },
        opacity: { value: 0.3 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      interactivity: {
        detectsOn: InteractivityDetect.window,
        events: {
          onHover: { enable: true, mode: "repulse" },
        },
        modes: {
          repulse: { distance: 150, duration: 0.4 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 pointer-events-none"
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
});
ParticlesBackground.displayName = "ParticlesBackground";

const CharacterCard = memo<CharacterCardProps>(
  ({ project, isHovered, onEnter, onLeave, touchable }) => {
    const router = useRouter();
    return (
      <motion.div
        onMouseEnter={!touchable ? onEnter : undefined}
        onMouseLeave={!touchable ? onLeave : undefined}
        onTouchStart={touchable ? onEnter : undefined}
        onTouchEnd={() => {
          onLeave?.();
          router.push(`/proyectos/${project.id}`);
        }}
        onClick={() => router.push(`/proyectos/${project.id}`)}
        initial={{ scale: 1 }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-md overflow-hidden cursor-pointer aspect-square w-24 sm:w-28 md:w-32 lg:w-36"
      >
        <Image
          src={project.image}
          alt={project.title}
          width={120}
          height={120}
          className="object-cover w-full h-full"
        />
      </motion.div>
    );
  },
  (prev, next) => prev.isHovered === next.isHovered
);
CharacterCard.displayName = "CharacterCard";

export default function FinalProjects() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    const touchSupported =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setIsTouch(touchSupported);
  }, []);

  return (
    <div className="relative flex flex-col items-center bg-black text-white min-h-screen pt-24 px-4">
      <Navbar />
      <ParticlesBackground />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg mt-8 text-center">
        Selecciona tu proyecto
      </h1>

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl h-[45vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-600 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative overflow-hidden rounded-2xl"
          >
            {/* Imagen de fondo */}
            <Image
              src={projects[hoveredIdx].image}
              alt={projects[hoveredIdx].title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />

            {/* Imagen description sobrepuesta abajo */}
            <Image
              src={projects[hoveredIdx].description}
              alt={`${projects[hoveredIdx].title} descripción`}
              width={600}
              height={600}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 object-contain drop-shadow-lg"
            />

            {/* Título */}
            <div className="absolute top-4 left-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {projects[hoveredIdx].title}
              </h2>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid de Thumbnails */}
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
        {projects.map((p, idx) => (
          <CharacterCard
            key={p.id}
            project={p}
            isHovered={hoveredIdx === idx}
            onEnter={() => setHoveredIdx(idx)}
            onLeave={() => setHoveredIdx(0)}
            touchable={isTouch} // <-- aquí lo pasas
          />
        ))}
      </div>
    </div>
  );
}
