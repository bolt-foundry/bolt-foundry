import { React } from "aws/client/deps.ts";
import Logo from "aws/client/images/bf-logo.tsx";
import { colors } from "aws/client/ui_components/ui_const.tsx";

type Props = {
  cover?: string;
};

export default function ContentFrame(
  { children, cover }: React.PropsWithChildren<Props>,
) {
  return (
    <div className="blog_page">
      {cover && (
        <div
          className="blog_post_cover_bg"
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      <div className="blog_page_header">
        <div className="blog_page_header_inner">
          <div className="logo">
            <Logo
              boltColor={colors.textSecondary}
              foundryColor={colors.textSecondary}
            />
          </div>
          <div className="logo_text">Open mic</div>
        </div>
      </div>
      {cover && (
        <div
          className="blog_post_cover"
          style={{ backgroundImage: `url(${cover})` }}
        />
      )}
      {children}
    </div>
  );
}
