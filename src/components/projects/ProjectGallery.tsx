"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/data/projects";
import ProjectMotion from "./ProjectMotion";
import projects from "./projects.module.css";

type Props = {
  projectName: string;
  images: ProjectImage[];
};

export default function ProjectGallery({ projectName, images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const selectedImage = selectedIndex === null ? null : images[selectedIndex];

  const close = () => setSelectedIndex(null);
  const showPrevious = () => setSelectedIndex((index) => index === null ? index : (index - 1 + images.length) % images.length);
  const showNext = () => setSelectedIndex((index) => index === null ? index : (index + 1) % images.length);

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") setSelectedIndex((index) => index === null ? index : (index - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setSelectedIndex((index) => index === null ? index : (index + 1) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, images.length]);

  return <>
    <ProjectMotion className={projects.gallery}>
      {images.map((image, index) => {
        const layoutId = `project-gallery-${projectName}-${index}`;
        return <figure key={image.src}>
          <motion.button
            type="button"
            className={projects.galleryButton}
            layoutId={layoutId}
            onClick={() => setSelectedIndex(index)}
            aria-haspopup="dialog"
            aria-label={`Open ${image.alt} full screen`}
          >
            <div className={projects.galleryImage} data-project-frame>
              <div className={projects.cardImage} data-project-image><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
              <span className={projects.galleryExpand} aria-hidden="true">↗</span>
            </div>
          </motion.button>
          <figcaption>0{index + 2} / {projectName}</figcaption>
        </figure>;
      })}
    </ProjectMotion>
    <AnimatePresence>
      {selectedImage && selectedIndex !== null && <motion.div className={projects.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button type="button" className={projects.lightboxBackdrop} onClick={close} aria-label="Close full-screen image" />
        <motion.div className={projects.lightboxDialog} role="dialog" aria-modal="true" aria-label={`Expanded image: ${selectedImage.alt}`} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} exit={{ opacity: 0.7 }}>
          <motion.div className={projects.lightboxImage} layoutId={`project-gallery-${projectName}-${selectedIndex}`} transition={{ type: "spring", stiffness: 280, damping: 30 }}>
            <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="100vw" priority />
          </motion.div>
          <div className={projects.lightboxBar}>
            <p>{String(selectedIndex + 2).padStart(2, "0")} / {String(images.length + 1).padStart(2, "0")} · {projectName}</p>
            <div className={projects.lightboxControls}>
              {images.length > 1 && <><button type="button" onClick={showPrevious} aria-label="Previous image">←</button><button type="button" onClick={showNext} aria-label="Next image">→</button></>}
              <button ref={closeButton} type="button" onClick={close} aria-label="Close full-screen image">Close ×</button>
            </div>
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
