import { RouterLink } from "@bfmono/apps/boltFoundry/components/Router/RouterLink.tsx";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";

type Crumb = {
  name: string;
  link: string;
  back?: boolean;
};

type BreadcrumbsProps = {
  crumbs: Array<Crumb>;
  homeLink?: string;
};
export function BfDsBreadcrumbs({ crumbs, homeLink }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumbs">
      <ul className="breadcrumbs">
        {homeLink && (
          <li className="breadcrumb-item">
            <RouterLink to={homeLink}>
              {<BfDsIcon name="home" size={16} />}
            </RouterLink>
          </li>
        )}
        {crumbs.map((crumb, index) => {
          return (
            <li className="breadcrumb-item" key={index}>
              <RouterLink to={crumb.link}>
                {crumb.back && <BfDsIcon name="arrowLeft" />}
                {crumb.name}
              </RouterLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Example() {
  const crumbs = [
    { name: "A page", link: "/ui?page=a" },
    { name: "Another page", link: "/ui?page=b" },
    { name: "Yet another page", link: "/ui?page=c" },
  ];
  const homeLink = "/ui";
  return <BfDsBreadcrumbs crumbs={crumbs} homeLink={homeLink} />;
}
