interface VideoProps {
  src: string;
  poster?: string;
  caption?: string;
}

export function Video({ src, poster, caption }: VideoProps) {
  return (
    <figure className="not-prose my-6 mx-auto max-w-2xl">
      {/* 本文を開いただけで動画全体をダウンロードさせないため metadata に留める */}
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg"
      />
      {caption && (
        <figcaption className="mt-1 text-center text-sm italic text-stone-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
