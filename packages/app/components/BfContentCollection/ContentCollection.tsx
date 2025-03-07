import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { getLogger } from "packages/logger.ts";
import { BlogFrame } from "packages/app/components/BfBlog/BlogFrame.tsx";

const _logger = getLogger(import.meta);

export const ContentCollection = iso(`
  field BfContentCollection.ContentCollection @component {
    __typename
    items {
      nodes {
        ContentItem
        id
      }
    }

  }
`)(function ContentCollection({ data }) {
  const collection = data;
  const items = collection?.items?.nodes || [];

  const itemElements = items
    .map((item) => item && <item.ContentItem key={item.id} />)
    .filter(Boolean) as React.ReactNode[];

  return (
    <BlogFrame>
      {itemElements}
    </BlogFrame>
  );
});
