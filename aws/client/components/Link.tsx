// Router.tsx
import { React } from "aws/client/deps.ts";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";

type LinkProps = {
  to: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export function Link({ to, children, style }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} style={style}>
      {children}
    </a>
  );
}
