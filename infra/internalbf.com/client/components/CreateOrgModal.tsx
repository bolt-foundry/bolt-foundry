import * as React from "react";
import { ReactRelay } from "deps.ts";
import {
  BfDsForm,
  BfDsFormSubmitButton,
  BfDsFormTextInput,
} from "packages/bfDs/BfDsForm.tsx";
import { getLogger } from "deps.ts";
import { graphql } from "infra/internalbf.com/client/deps.ts";
import type { ModalHandles } from "packages/bfDs/BfDsModal.tsx";
const logger = getLogger(import.meta);

const { useMutation } = ReactRelay;

const mutation = await graphql`
  mutation CreateOrgModalMutation($name: String!, $youtubePlaylistUrl: String, $domainName: String!) {
    createOrg(name: $name, youtubePlaylistUrl: $youtubePlaylistUrl, domainName: $domainName) {
      name
    }
  }
`;

type Props = {
  modalRef: React.RefObject<ModalHandles>;
};

export function CreateOrgModal({ modalRef }: Props) {
  const [commit, mutationInFlight] = useMutation(mutation);

  function onSubmit(data) {
    logger.info("submit");
    commit({
      variables: {
        name: data.name ?? "No name",
        domainName: data.domainName ?? "No domain",
        youtubePlaylistUrl: data.youtubePlaylistUrl ??
          "https://www.youtube.com/watch?v=tS77-WDtuFo&list=PLlaN88a7y2_rUZ4ojREfC3XbmWABADnHc",
      },
      optimisticResponse: {
        name: data.name,
        domainName: data.domainName,
        youtubePlaylistUrl: data.youtubePlaylistUrl,
      },
      onCompleted: (...data) => {
        logger.info(data);
        modalRef.current?.closeModal();
      },
    });
  }
  return (
    <BfDsForm onSubmit={onSubmit} initialData={{}}>
      <BfDsFormTextInput id="name" title="Organization name?" />
      <BfDsFormTextInput id="domainName" title="Domain name?" />
      <BfDsFormTextInput
        id="youtubePlaylistUrl"
        title="Youtube playlist URL?"
      />
      <BfDsFormSubmitButton text="Submit" showSpinner={mutationInFlight} />
    </BfDsForm>
  );
}
