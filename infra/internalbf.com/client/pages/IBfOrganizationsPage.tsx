import { React, ReactRelay } from "deps.ts";
import { IBfFrame } from "infra/internalbf.com/client/components/IBfFrame.tsx";
import { Columns, Table } from "packages/bfDs/Table.tsx";
import { TableCell } from "packages/bfDs/TableCell.tsx";
import { graphql } from "infra/internalbf.com/client/deps.ts";
import { IBfOrganizationsPage_BfOrganization$key } from "infra/__generated__/IBfOrganizationsPage_BfOrganization.graphql.ts";

import { IBfOrganizationsPageQuery } from "infra/__generated__/IBfOrganizationsPageQuery.graphql.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { useBfDs } from "packages/bfDs/hooks/useBfDs.tsx";
import { Example } from "packages/bfDs/BfDsForm.tsx";

const { useFragment, useLazyLoadQuery } = ReactRelay;

const columns: Columns<IBfOrganizationsPage_BfOrganization$key> = [
  {
    title: "Name",
    width: "2fr",
    renderer: (bfOrganization$key) => {
      const data = useFragment(fragment, bfOrganization$key);
      return <TableCell text={data?.name ?? "Unnamed Organization"} />;
    },
  },
];

const query = await graphql`
  query IBfOrganizationsPageQuery {
    organizations(first: 10) {
      edges {
        node {
          ...IBfOrganizationsPage_BfOrganization
        }
      }
    }
  }
`;

const fragment = await graphql`
  fragment IBfOrganizationsPage_BfOrganization on BfOrganization {
    name
  }
`;

function CreateOrgModal() {
  return <Example />;
}

export function IBfOrganizationsPage() {
  const queryData = useLazyLoadQuery<IBfOrganizationsPageQuery>(query, {});
  const organization$keys =
    queryData?.organizations?.edges?.map((edge) => edge?.node).filter(
      Boolean,
    ) ?? [];
  const { showModal } = useBfDs();

  return (
    <IBfFrame
      header="Organizations"
      headerAction={
        <Button
          text="Add organization"
          kind="secondary"
          onClick={() => showModal(<CreateOrgModal />)}
        />
      }
    >
      <Table
        columns={columns}
        data={organization$keys as Array<
          IBfOrganizationsPage_BfOrganization$key
        >}
      />
    </IBfFrame>
  );
}
