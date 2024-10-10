type Props = {
  onClick: () => void;
  label: string;
};

export function WordMenuItem({ onClick, label }: Props) {
  return (
    <div
      onClick={onClick}
      className="word-menu-item"
    >
      <div className="word-menu-text">{label}</div>
    </div>
  );
}
