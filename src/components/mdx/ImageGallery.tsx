"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const columns = Math.min(images.length, 4) as 1 | 2 | 3 | 4;

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
  };

  const imageSizes = {
    1: "100vw",
    2: "(min-width: 640px) 50vw, 85vw",
    3: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 85vw",
    4: "(min-width: 768px) 25vw, (min-width: 640px) 50vw, 85vw",
  };

  return (
    <>
      <div
        className={
          columns === 1
            ? "not-prose my-6 mx-auto grid max-w-2xl grid-cols-1 gap-4"
            : `not-prose my-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:snap-none sm:overflow-visible sm:pb-0 ${gridCols[columns]}`
        }
      >
        {images.map((image, index) => (
          <figure
            key={index}
            className={`m-0${columns === 1 ? "" : " w-[85%] shrink-0 snap-center sm:w-auto sm:shrink"}`}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500${columns === 1 ? "" : " aspect-square"}`}
            >
              {columns === 1 ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={800}
                  sizes={imageSizes[columns]}
                  className="m-0 max-h-[70vh] h-auto w-auto max-w-full mx-auto rounded-lg transition-transform hover:scale-105"
                />
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={imageSizes[columns]}
                  className="m-0 object-cover transition-transform hover:scale-105"
                />
              )}
            </button>
            {image.caption && (
              <figcaption className="mt-1 text-center text-sm italic text-stone-500">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute right-4 top-4 text-white hover:text-zinc-300"
            onClick={() => setSelectedIndex(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            className="absolute left-4 text-white hover:text-zinc-300 disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : prev,
              );
            }}
            disabled={selectedIndex === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            className="flex max-h-[90vh] max-w-[90vw] flex-col items-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              width={1200}
              height={800}
              className="min-h-0 max-w-full w-auto shrink object-contain"
            />
            {images[selectedIndex].caption && (
              <p className="mt-2 shrink-0 text-center italic text-white/80">
                {images[selectedIndex].caption}
              </p>
            )}
          </div>

          <button
            className="absolute right-4 text-white hover:text-zinc-300 disabled:opacity-30"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) =>
                prev !== null && prev < images.length - 1 ? prev + 1 : prev,
              );
            }}
            disabled={selectedIndex === images.length - 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
