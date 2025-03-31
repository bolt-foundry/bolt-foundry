import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { useRouter } from "apps/boltFoundry/contexts/RouterContext.tsx";
import { useEffect } from "react";

export const LoggedInView = iso(`
  field BfCurrentViewerLoggedIn.LoggedInView @component {
    __typename
    
  }
`)(function LoggedInView() {
  const { replace } = useRouter();
  useEffect(function LoggedInViewEffect() {
    replace("/formatter");
  }, []);
  return <div></div>;
});
