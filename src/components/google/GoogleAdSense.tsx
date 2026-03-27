import Script from "next/script";

const ADSENSE_ID = "ca-pub-1189493113133736";

export function GoogleAdSense() {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
