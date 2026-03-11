"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const LiveBackground = () => {
  const [init, setInit] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (_container?: Container): Promise<void> => {};

  const isDark = resolvedTheme === "dark";

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: isDark ? "#050a10" : "#f0f4ff",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 150,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: isDark ? "#06b6d4" : "#6366f1",
        },
        links: {
          color: isDark ? "#0e7490" : "#818cf8",
          distance: 150,
          enable: true,
          opacity: isDark ? 0.3 : 0.25,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 1.5,
          straight: false,
        },
        number: {
          density: { enable: true },
          value: 60,
        },
        opacity: {
          value: isDark ? 0.4 : 0.35,
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 4 },
        },
      },
      detectRetina: true,
    }),
    [isDark]
  );

  if (init) {
    return (
      <Particles
        key={resolvedTheme} // re-mount on theme change
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="fixed top-0 left-0 w-full h-full z-[-1]"
      />
    );
  }

  return <></>;
};

export default LiveBackground;
