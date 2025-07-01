import { useRouter } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";

type LinkProps =
  & {
    to: string;
  }
  & React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >;

export function RouterLink({ to, children, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
