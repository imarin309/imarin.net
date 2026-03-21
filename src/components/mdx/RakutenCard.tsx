import Image from "next/image";

interface RakutenCardProps {
  href: string;
  imgSrc: string;
  title: string;
  price: string;
}

interface RakutenCardImageProps {
  href: string;
  imgSrc: string;
  title: string;
}

export function RakutenCard({ href, imgSrc, title, price }: RakutenCardProps) {
  return (
    <div className="not-prose my-6 rounded-xl border border-accent overflow-hidden shadow-sm relative">
      <span className="absolute top-1.5 left-2 text-xs font-semibold text-gray-500 leading-none tracking-wide">
        ads
      </span>
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="flex gap-4 p-4 bg-white hover:bg-accent/30 transition-colors"
      >
        <Image
          src={imgSrc}
          alt={title}
          width={112}
          height={112}
          className="w-28 h-28 object-contain flex-shrink-0"
          unoptimized
        />
        <div className="flex flex-col justify-between min-w-0">
          <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">
            {title}
          </p>
          <div>
            <p className="text-sm font-bold text-primary mt-2">{price}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 border border-[#bf0000] text-[#bf0000] text-xs font-medium px-2.5 py-1.5 rounded-full">
              <Image
                src="https://static.affiliate.rakuten.co.jp/makelink/rl.svg"
                alt="楽天"
                width={52}
                height={16}
                className="h-4 w-auto"
                unoptimized
              />
              楽天で購入
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export function RakutenCardImage({
  href,
  imgSrc,
  title,
}: RakutenCardImageProps) {
  return (
    <div className="not-prose my-6 flex justify-center">
      <div className="relative inline-block">
        <span className="absolute top-1.5 left-2 text-xs font-semibold text-gray-500 leading-none tracking-wide z-10">
          ads
        </span>
        <a href={href} target="_blank" rel="nofollow sponsored noopener">
          <Image
            src={imgSrc}
            alt={title}
            width={400}
            height={400}
            className="object-contain"
            unoptimized
          />
        </a>
      </div>
    </div>
  );
}
