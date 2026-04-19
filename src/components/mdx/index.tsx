import { Pre } from "./Pre";
import { LinkCard } from "./LinkCard";

function H2({ children }: { children?: React.ReactNode }) {
  return <h2 className="border-b border-current pb-1">{children}</h2>;
}

export const mdxComponents = {
  pre: Pre,
  h2: H2,
  LinkCard,
};
