import { EmbeddedTweet } from "react-tweet";
import { getTweet } from "react-tweet/api";
import { LinkCard } from "./LinkCard";

interface TweetProps {
  id: string;
  url: string;
}

export async function Tweet({ id, url }: TweetProps) {
  // 非公開の syndication API を使っているので、取れなくてもビルドは止めずリンクだけ残す
  const tweet = await getTweet(id).catch(() => undefined);
  if (!tweet) return <LinkCard url={url} title={url} />;

  return (
    // サイトにダークモードが無いので、OS がダークでもツイートだけ暗くならないよう固定する
    <div data-theme="light" className="not-prose my-6 flex justify-center">
      <EmbeddedTweet tweet={tweet} />
    </div>
  );
}
