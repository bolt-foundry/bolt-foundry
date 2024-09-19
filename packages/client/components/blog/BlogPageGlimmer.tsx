import { BfDsGlimmer } from "packages/bfDs/BfDsGlimmer.tsx";

export function BlogPageGlimmer() {
  const blogPostList: Array<JSX.Element> = [];
  Array.from({ length: 4 }, (_, index) => {
    const leftOrRightSideOfPage: string = index % 2 === 0
      ? "blog-page-list-item-right"
      : "blog-page-list-item-left";
    if (index === 0) {
      blogPostList.push(
        <BfDsGlimmer className="blog-page-hero" height="auto" />,
      );
    } else {
      blogPostList.push(
        <div>
          <PostGlimmer
            additionalClassName={leftOrRightSideOfPage}
            orderStart={index - 1}
          />
        </div>,
      );
    }
  });
  return blogPostList;
}

type PostProps = {
  additionalClassName: string;
  orderStart: number;
};

function PostGlimmer({ additionalClassName, orderStart }: PostProps) {
  let order = orderStart;
  return (
    <div className={`blog-page-list-item ${additionalClassName || ""}`}>
      <div className="blog-page-item-info" style={{ gap: 8 }}>
        <BfDsGlimmer height="65px" order={order} />
        <div className="blog_author">
          <BfDsGlimmer
            width="24px"
            xstyle={{ borderRadius: "50%" }}
            order={order++}
          />
          <BfDsGlimmer height="25px" width="100px" order={order++} />
        </div>
        <BfDsGlimmer className="blog_meta" height="65px" order={order++} />
        <BfDsGlimmer className="blog-list-item-summary" order={order++} />
      </div>
      <BfDsGlimmer width="50%" order={order++} />
    </div>
  );
}
