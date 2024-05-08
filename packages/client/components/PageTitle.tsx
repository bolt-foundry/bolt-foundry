import { React } from "deps.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Link } from "packages/bfDs/Link.tsx";

type PageTitleType = {
  collapsed: boolean;
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "100%",
    height: 50,
  },
  collapsed: {
    margin: 10,
  },
  uncollapsed: {
    margin: "10px 20px",
  },
};
export function PageTitle({ collapsed }: PageTitleType) {
  return (
    <div style={styles.container}>
      <div style={collapsed ? styles.collapsed : styles.uncollapsed}>
        <Link to="/">
          {collapsed ? <BfSymbol /> : <BfLogo />}
        </Link>
      </div>
    </div>
  );
}
