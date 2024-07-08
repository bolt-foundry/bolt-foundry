import {
  React,
  ReactRuntime,
  remarkFrontmatter,
  remarkMdxFrontmatter,
} from "aws/client/deps.ts";
import ContentFrame from "aws/client/components/ContentFrame.tsx";
import { useRouter } from "aws/client/contexts/RouterContext.tsx";
import { useAppEnvironment } from "aws/client/contexts/AppEnvironmentContext.tsx";
import { mdxJs } from "aws/client/deps.ts";

const { Suspense } = React;

const authors = {
  randall: {
    name: "Randall Bennett",
    link: "https://twitter.com/randallb",
  },
};

export default function ContentPage() {
  const { routeParams } = useRouter();
  const { content } = useAppEnvironment();
  if (content == null) {
    return (
      <ContentFrame>
        <div>Reload (fix me)...</div>
      </ContentFrame>
    );
  }
  const Content = React.useMemo(() => {
    return mdxJs.evaluateSync(content, {
      Fragment: React.Fragment,
      baseUrl: import.meta.url,
      // @ts-expect-error this is actually there, idk why it's not in types.
      jsx: ReactRuntime.jsx,
      // @ts-expect-error this is actually there, idk why it's not in types.
      jsxs: ReactRuntime.jsxs,
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    });
  }, [content]);

  const frontMatter = (Content.frontmatter ?? {}) as Record<string, string>;
  const { title, summary, publishDate, tags, coverImage, author, socialText } =
    frontMatter;

  const rawDate = new Date(publishDate);
  const formattedDate = rawDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // TODO: make authors a real thing
  // @ts-ignore authors is temporary
  const authorLink = authors[author] != null && (
    // @ts-ignore authors is temporary
    <a href={authors[author].link}>{authors[author].name}</a>
  );

  return (
    <ContentFrame cover={coverImage}>
      <div className="blog_post">
        <h1>{title}</h1>
        <div className="blog_post_meta">
          <div className="blog_post_author">
            {authorLink} &bull; {formattedDate}
          </div>
          <div className="blog_post_tags">
            {(tags as unknown as Array<string>)?.map((tag: string) => (
              <span key={tag} className="blog_post_tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="blog_post_content">
          <Content.default />
        </div>
      </div>
    </ContentFrame>
  );
}
