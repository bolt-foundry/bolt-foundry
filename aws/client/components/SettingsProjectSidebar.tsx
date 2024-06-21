import { graphql, React, ReactRelay } from "aws/client/deps.ts";
import { Settings } from "aws/types/settings.ts";
import Button from "aws/client/ui_components/Button.tsx";
import SettingsForm, {
  SettingRowProps,
} from "aws/client/components/SettingsForm.tsx";
import Tooltip from "aws/client/ui_components/Tooltip.tsx";
import { SettingsProjectSidebarQuery_project$key } from "aws/__generated__/SettingsProjectSidebarQuery_project.graphql.ts";
import classnames from "aws/client/lib/classnames.ts";
const { useFragment, useMutation } = ReactRelay;

type Props = {
  project$key: SettingsProjectSidebarQuery_project$key | null | undefined;
};

const fragment = await graphql`
  fragment SettingsProjectSidebarQuery_project on Project {
    id
    effectiveSettings {
      ...SettingsFormQuery_settings
    }
    overriddenSettingsKeys
  }
`;

const mutation = await graphql`
  mutation SettingsProjectSidebarMutation($id: ID!, $settings: ProjectSettingsInput!) {
    updateProjectSettings(id: $id, settings: $settings) {
      id
      effectiveSettings {
        ...SettingsFormQuery_settings
      }
      overriddenSettingsKeys
    }
  }
`;

export default function Settings({ project$key }: Props) {
  if (!project$key) {
    return null;
  }
  const data = useFragment(fragment, project$key);

  const [initialSettings, setIntialSettings] = React.useState<
    Partial<Settings>
  >(data.effectiveSettings as Partial<Settings>);
  const [draftSettings, setDraftSettings] = React.useState({});
  const [commit, isInFlight] = useMutation(mutation);

  const changedSettings = Array.isArray(data.overriddenSettingsKeys)
    ? Object.keys(draftSettings).concat(
      data.overriddenSettingsKeys,
    ) as Array<keyof Settings>
    : Object.keys(draftSettings) as Array<keyof Settings>;

  const isDirty = Object.keys(draftSettings).length > 0;

  const submitChanges = (e?: React.FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();
    commit({
      variables: {
        id: data.id,
        settings: draftSettings,
      },
      optimisticResponse: {
        updateProjectSettings: {
          id: data.id,
          effectiveSettings: {
            ...initialSettings,
            ...draftSettings,
          },
        },
      },
      onCompleted: () => {
        setDraftSettings({});
      },
    });
  };

  return (
    <form onSubmit={submitChanges}>
      <SettingsForm
        isCollapsible={true}
        RowTemplate={SettingRow}
        draftSettings={draftSettings}
        setDraftSettings={setDraftSettings}
        changedSettings={changedSettings}
        settings$key={data.effectiveSettings}
        setInitialSettings={setIntialSettings}
      />
      <div className="submitRow">
        <Button
          disabled={!isDirty}
          text="Save project settings"
          type="submit"
          showSpinner={isInFlight}
        />
        <div className="formDescription">
          <p>
            These settings will override the project settings for this project
            only.
          </p>
          <p>
            <span className="textHighlight">Highighted settings</span>{" "}
            are overridden.
          </p>
        </div>
      </div>
    </form>
  );
}

function SettingRow(
  { changed, description, disabled, name, settingElement }: SettingRowProps,
) {
  const rowClasses = classnames([
    "settingRow",
    "flexRow",
    { changed },
    { disabled },
  ]);
  return (
    <div className={rowClasses}>
      {name && (
        <div className="settingTitle">
          <Tooltip text={description} position="left">
            {name}
          </Tooltip>
        </div>
      )}
      {settingElement}
    </div>
  );
}
