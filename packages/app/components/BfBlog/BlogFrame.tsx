import type * as React from "react";
import { RouterLink } from "packages/app/components/Router/RouterLink.tsx";
import { CfLogo } from "packages/bfDs/static/CfLogo.tsx";
import { BlogPageNavbar } from "packages/app/components/BfBlog/BlogPageNavBar.tsx";

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
          <div className="logo_container cf">
            <RouterLink to="/">
              <CfLogo
                boltColor={post ? "white" : "var(--text)"}
                foundryColor={post ? "white" : "var(--text)"}
              />
            </RouterLink>
            {post && (
              <div className="blog-post-header-back">
                <RouterLink to="/blog">&larr; Blog</RouterLink>
              </div>
            )}
          </div>
          <BlogPageNavbar additionalClassName={additionalClassNameForNavbar} />
        </div>
      </div>
      {children}
    </div>
  );
}
