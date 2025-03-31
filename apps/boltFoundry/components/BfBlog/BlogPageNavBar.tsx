import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";

type BlogPageNavbarProps = {
  additionalClassName: string;
};

export function BlogPageNavbar({ additionalClassName }: BlogPageNavbarProps) {
  return (
    <div className={`blog-navbar ${additionalClassName}`}>
      <BfDsButton
        link="/contact-us"
        hrefTarget="_blank"
        text="Let's talk"
        size="large"
      />
    </div>
  );
}
