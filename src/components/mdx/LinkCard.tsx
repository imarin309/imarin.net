import Image from "next/image";

interface LinkCardProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export function LinkCard({
  url,
  title,
  description,
  image,
  favicon,
}: LinkCardProps) {
  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();

  return (
    <div className="not-prose my-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors overflow-hidden shadow-sm"
      >
        <div className="flex flex-col justify-between p-3 flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground line-clamp-1 leading-snug">
            {title}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            {favicon && (
              <Image
                src={favicon}
                alt=""
                width={14}
                height={14}
                className="w-3.5 h-3.5"
                unoptimized
              />
            )}
            <span className="text-xs text-gray-400 truncate">{domain}</span>
          </div>
        </div>
        {image && (
          <div className="w-24 sm:w-32 flex-shrink-0">
            <Image
              src={image}
              alt={title}
              width={192}
              height={192}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        )}
      </a>
    </div>
  );
}
