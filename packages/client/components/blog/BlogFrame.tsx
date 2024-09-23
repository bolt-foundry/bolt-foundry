import * as React from "react";
import { Link } from "packages/client/components/Link.tsx";
import { BfLogo } from "packages/bfDs/static/BfLogo.tsx";
import { BlogPageNavbar } from "packages/client/components/blog/BlogPageNavbar.tsx";

type Props = {
  cover?: string;
  post?: boolean;
};

export function BlogFrame(
  { children, cover, post }: React.PropsWithChildren<Props>,
) {
  let classRoot = "";
  let additionalClassNameForNavbar = "";
  if (post) {
    classRoot = "blog_post";
    additionalClassNameForNavbar = "blog-post-navbar";
  } else {
    classRoot = "blog_page";
  }
  return (
    <div className={classRoot}>
      {cover && (
        <div
          className={`${classRoot}_cover_bg`}
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      <div
        className={`${classRoot}_header`}
        style={{ backgroundImage: cover ? `url(${cover})` : "" }}
      >
        <div className={`${classRoot}_header_inner`}>
          <div className="logo_container">
            <Link to="/">
              <BfLogo
                boltColor={post ? "white" : "var(--text)"}
                foundryColor={post ? "white" : "var(--text)"}
              />
            </Link>
          </div>
          <BlogPageNavbar additionalClassName={additionalClassNameForNavbar} />
        </div>
      </div>
      {children}
    </div>
  );
}
