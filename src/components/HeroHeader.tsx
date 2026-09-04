// public/ 直下に置いた画像を参照する。R2へ移す場合は ASSET_URL を前置する
const HERO_IMAGE = "/header.webp";

export function HeroHeader() {
  return (
    <img
      src={HERO_IMAGE}
      alt=""
      width={4461}
      height={980}
      fetchPriority="high"
      className="h-auto w-full"
    />
  );
}
