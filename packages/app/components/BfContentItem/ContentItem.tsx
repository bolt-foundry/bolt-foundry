import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { marked } from "marked";

export const ContentItem = iso(`
  field BfContentItem.ContentItem @component {
    __typename
    title
    body
    href
  }
`)(function ContentItem({ data }) {
  return (
    <div className="content-item">
      {data?.body && (
        <div className="content-item-body">
          <div dangerouslySetInnerHTML={{__html: marked.parse(data.body)}} />
        </div>
      )}
    </div>
  );
});
