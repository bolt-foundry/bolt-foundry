import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { BfDsList } from "apps/bfDs/components/BfDsList.tsx";
import { BfDsListItem } from "apps/bfDs/components/BfDsListItem.tsx";

interface DocSection {
  title: string;
  items: { slug: string; title: string }[];
}

const docSections: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      { slug: "README", title: "Overview" },
      { slug: "quickstart", title: "Quickstart" },
      { slug: "getting-started", title: "Getting Started" },
      { slug: "interactive-demo", title: "Interactive Demo" },
    ],
  },
  {
    title: "Planning & Strategy",
    items: [
      { slug: "product-plan", title: "Product Plan" },
      { slug: "big-picture-strategy", title: "Big Picture Strategy" },
      { slug: "business-vision", title: "Business Vision" },
      { slug: "company-vision", title: "Company Vision" },
      { slug: "library-vision", title: "Library Vision" },
    ],
  },
  {
    title: "Development",
    items: [
      { slug: "STATUS", title: "Status" },
      { slug: "deck-system", title: "Deck System" },
      { slug: "improving-inference-philosophy", title: "Improving Inference" },
      { slug: "measurement-strategy", title: "Measurement Strategy" },
    ],
  },
  {
    title: "Team & Culture",
    items: [
      { slug: "team-story", title: "Team Story" },
      { slug: "marketing-plan", title: "Marketing Plan" },
      { slug: "early-content-plan", title: "Content Plan" },
    ],
  },
  {
    title: "Reference",
    items: [
      { slug: "wut", title: "WUT (Technical Deep Dive)" },
      { slug: "BACKLOG", title: "Backlog" },
      { slug: "CHANGELOG", title: "Changelog" },
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
