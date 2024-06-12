import { React } from "deps.ts";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { BfSymbol } from "packages/bfDs/static/BfSymbol.tsx";
import { Link } from "packages/bfDs/Link.tsx";

type InternalBfPageTitleType = {
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
export function InternalBfPageTitle({ collapsed }: InternalBfPageTitleType) {
  return (
    <div style={styles.container}>
      <div style={{marginLeft: 20}}>{collapsed ? "" : "Internal"}</div>
      <div style={collapsed ? styles.collapsed : styles.uncollapsed}>
        <Link to="/">
          {collapsed ? <BfSymbol/>  : <BfLogo/>}
        </Link>
      </div>
    </div>
  );
}
