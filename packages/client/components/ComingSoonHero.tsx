export function ComingSoonHero() {
  const lines = [
    { "style": "normal", "text": "Use all of your content" },
    {
      "style": "blueWord",
      "text": "we make it easy",
    },
  ];

  const elements = lines.map(({ style, text }, index: number) => {
    const styleClass = style === "normal" ? "hero-text" : "hero-text-blue";
    return <div key={index} className={styleClass}>{text}</div>;
  });

  return (
    <div className="marketing-hero">
      <div className="marketing-title">{elements}</div>
      <div className="marketing-text">
        A new way for your whole company to organize and use video.
        <br />
        Stay tuned.
      </div>
    </div>
  );
}
