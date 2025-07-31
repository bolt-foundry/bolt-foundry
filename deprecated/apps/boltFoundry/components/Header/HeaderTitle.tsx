export function HeaderTitle({ children }: React.PropsWithChildren) {
  return <title className="dynamic">{children}</title>;
}
