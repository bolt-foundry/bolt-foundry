type Props = {
  name: string;
  content: string;
};

export function HeaderMeta(props: Props) {
  return <meta {...props} className="dynamic" />;
}
