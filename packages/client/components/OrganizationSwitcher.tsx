import { graphql } from "packages/client/deps.ts";
import { ReactRelay } from "packages/client/deps.ts";
import { OrganizationSwitcher_bfOrganization$key } from "packages/__generated__/OrganizationSwitcher_bfOrganization.graphql.ts";
import { OrganizationSwitcherSubscription } from "packages/__generated__/OrganizationSwitcherSubscription.graphql.ts";
const { useFragment, useSubscription } = ReactRelay;
import { useMemo } from "react";

const fragment = await graphql`
  fragment OrganizationSwitcher_bfOrganization on BfOrganization {
      name
      id
  }
`;

const subscription = await graphql`
  subscription OrganizationSwitcherSubscription($id: ID!) {
    node(id: $id) {
      ...OrganizationSwitcher_bfOrganization
    }
  }
`;
type Props = {
  bfOrganization$key: OrganizationSwitcher_bfOrganization$key;
};
export function OrganizationSwitcher({ bfOrganization$key }: Props) {
  const data = useFragment<OrganizationSwitcher_bfOrganization$key>(
    fragment,
    bfOrganization$key,
  );
  const id = data?.id;
  useMemo(() => {
    useSubscription<OrganizationSwitcherSubscription>({
      variables: { id: data?.id },
      subscription,
    });
  }, [id]);

  return data?.name;
}
