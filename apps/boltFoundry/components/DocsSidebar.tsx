import { useRouter } from "@bfmono/apps/boltFoundry/contexts/RouterContext.tsx";
import { BfDsList } from "@bfmono/apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "@bfmono/apps/bfDs/components/BfDsListItem.tsx";

interface DocSection {
  title: string;
  items: Array<{ slug: string; title: string }>;
}

const docSections: Array<DocSection> = [
  {
    title: "Getting Started",
    items: [
      { slug: "README", title: "Overview" },
      { slug: "quickstart", title: "Quickstart" },
      { slug: "getting-started", title: "Getting Started" },
    ],
  },
  {
    title: "Planning & Strategy",
    items: [
      { slug: "big-picture-strategy", title: "Big picture strategy" },
      { slug: "company-vision", title: "Company vision" },
    ],
  },
  {
    title: "Development",
    items: [
      { slug: "deck-system", title: "Deck system" },
      { slug: "improving-inference-philosophy", title: "Improving inference" },
      { slug: "evals-overview", title: "Evals" },
    ],
  },
  {
    title: "Reference",
    items: [
      { slug: "wut", title: "wut" },
    ],
  },
];

interface DocsSidebarProps {
  currentSlug?: string;
  setShowSidebar: (show: boolean) => void;
  xClassName?: string;
}

export function DocsSidebar(
  { currentSlug, setShowSidebar, xClassName }: DocsSidebarProps,
) {
  const { navigate } = useRouter();

  return (
    <div className={`docs-sidebar ${xClassName}`}>
      <nav className=" flexColumn gapLarge">
        {docSections.map((section) => (
          <BfDsList key={section.title} header={section.title}>
            {section.items.map((item) => (
              <BfDsListItem
                key={item.slug}
                content={item.title}
                isHighlighted={currentSlug === item.slug}
                onClick={() => {
                  navigate(`/docs/${item.slug}`);
                  setShowSidebar(false);
                }}
              />
            ))}
          </BfDsList>
        ))}
      </nav>
    </div>
  );
}
