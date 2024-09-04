import { getLogger, React, ReactRelay } from "deps.ts";
import { IBfFrame } from "infra/internalbf.com/client/components/IBfFrame.tsx";
import { type BfDsColumns, BfDsTable } from "packages/bfDs/BfDsTable.tsx";
import { BfDsTableCell } from "packages/bfDs/BfDsTableCell.tsx";
import { graphql } from "infra/internalbf.com/client/deps.ts";
import type { IBfOrganizationsPage_BfOrganization$key } from "infra/__generated__/IBfOrganizationsPage_BfOrganization.graphql.ts";

import type { IBfOrganizationsPageQuery } from "infra/__generated__/IBfOrganizationsPageQuery.graphql.ts";
import { BfDsButton } from "packages/bfDs/BfDsButton.tsx";
import { useBfDs } from "packages/bfDs/hooks/useBfDs.tsx";
import { CreateOrgModal } from "infra/internalbf.com/client/components/CreateOrgModal.tsx";
import type { ModalHandles } from "packages/bfDs/BfDsModal.tsx";

const { useFragment, useLazyLoadQuery, useMutation } = ReactRelay;
const { useState } = React;

const logger = getLogger(import.meta);

const columns: BfDsColumns<IBfOrganizationsPage_BfOrganization$key> = [
  {
    title: "Name",
    width: "2fr",
    renderer: (bfOrganization$key) => {
      const data = useFragment(fragment, bfOrganization$key);
      return <BfDsTableCell text={data?.name ?? "Unnamed Organization"} />;
    },
  },
];

const query = await graphql`
  query IBfOrganizationsPageQuery {
    organizations(first: 10) {
      count
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

export function IBfOrganizationsPage() {
  const queryData = useLazyLoadQuery<IBfOrganizationsPageQuery>(query, {});
  const modalRef = React.useRef<ModalHandles>(null);
  const organization$keys =
    queryData?.organizations?.edges?.map((edge) => edge?.node).filter(
      Boolean,
    ) ?? [];
  const { showModal } = useBfDs();

  return (
    <IBfFrame
      header={`Organizations (${queryData.organizations.count})`}
      headerAction={
        <BfDsButton
          text="Add organization"
          kind="secondary"
          onClick={() => {
            showModal(
              <CreateOrgModal modalRef={modalRef} />,
              modalRef
            );
          }}
        />
      }
    >
      <BfDsTable
        columns={columns}
        data={organization$keys as Array<
          IBfOrganizationsPage_BfOrganization$key
        >}
      />
    </IBfFrame>
  );
}
