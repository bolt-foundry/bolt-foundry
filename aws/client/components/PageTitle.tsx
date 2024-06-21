import { React } from "aws/client/deps.ts";
import Logo from "aws/client/images/bf-logo.tsx";
import O from "aws/client/images/bf-o.tsx";
import { Link } from "aws/client/components/Link.tsx";

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
function PageTitle({ collapsed }: PageTitleType) {
  return (
    <div style={styles.container}>
      <div style={collapsed ? styles.collapsed : styles.uncollapsed}>
        <Link to="/">
          {collapsed ? <O /> : <Logo />}
        </Link>
      </div>
    </div>
  );
}

export default PageTitle;
