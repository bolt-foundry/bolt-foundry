import { iso } from "packages/app/__generated__/__isograph/iso.ts";
import { BlogRevision } from "packages/app/components/BfOrganization/BlogRevision.tsx";
import { BfDsList } from "packages/bfDs/components/BfDsList.tsx";

export const BlogRevisionsSidebar = iso(`
  field BfOrganization.BlogRevisionsSidebar @component {
    creation {
      revisions{
        revisionTitle
        original
        instructions
        revision
        explanation
     }
    }
  }
`)(
  function BlogRevisionsSidebar(
    { data },
  ) {
    return (
      <div className="flexColumn right-side-bar">
        <div className="revisions-container">
          <BfDsList separator mutuallyExclusive>
            {data?.creation?.revisions?.map((revision, index) => (
              <BlogRevision revision={revision} key={index} />
            ))}
          </BfDsList>
        </div>
      </div>
    );
  },
);
