import { React, ReactRelay } from "deps.ts";
// import { SettingsProjectTabQuery_me$key } from "packages/__generated__/SettingsProjectTabQuery_me.graphql.ts";
import { DEFAULT_SETTINGS, Settings } from "packages/types/settings.ts";
import { Button } from "packages/bfDs/Button.tsx";
import {
  SettingRowProps,
  SettingsForm,
} from "packages/client/components/SettingsForm.tsx";
const { useFragment, useMutation } = ReactRelay;

type Props = {
  person$key: SettingsProjectTabQuery_me$key | null | undefined;
};

// const fragment = await graphql`
//   fragment SettingsProjectTabQuery_me on Person {
//     id
//     settings {
//       ...SettingsFormQuery_settings
//     }
//   }
// `;

// const mutation = await graphql`
//   mutation SettingsProjectTabMutation($settings: ProjectSettingsInput!) {
//     updatePersonSettings(settings: $settings) {
//       id
//       settings {
//         ...SettingsFormQuery_settings
//       }
//     }
//   }
// `;

export function SettingsProjectTab({ person$key }: Props) {
  // if (!person$key) {
  //   return null;
  // }
  // const data = useFragment(fragment, person$key);
  const data = {
    id: person$key.id,
    settings: DEFAULT_SETTINGS,
  }
  const [initialSettings, setInitialSettings] = React.useState<
    Partial<Settings>
  >(DEFAULT_SETTINGS);
  const [draftSettings, setDraftSettings] = React.useState({});
  // const [commit, isInFlight] = useMutation(mutation);
  const isInFlight = false;
  const isDirty = Object.keys(draftSettings).length > 0;

  const submitChanges = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit")
    // commit({
    //   variables: {
    //     settings: draftSettings,
    //   },
    //   optimisticResponse: {
    //     updatePersonSettings: {
    //       id: data.id,
    //       settings: {
    //         ...initialSettings,
    //         ...draftSettings,
    //       },
    //     },
    //   },
    //   onCompleted: () => {
    //     // hacky way to force update project override settings
    //     window.location.reload();
    //   },
    // });
  };

  return (
    <form onSubmit={submitChanges}>
      <SettingsForm
        RowTemplate={SettingRow}
        draftSettings={draftSettings}
        setDraftSettings={setDraftSettings}
        setInitialSettings={setInitialSettings}
        settings$key={data.settings}
      />
      <div className="submitRow">
        <Button
          disabled={!isDirty}
          text="Save settings"
          type="submit"
          showSpinner={isInFlight}
        />
      </div>
    </form>
  );
}

function SettingRow({ description, name, settingElement }: SettingRowProps) {
  return (
    <div className="setting row-column">
      <div className="settingForm flexRow">
        {name && <div className="settingTitle">{name}</div>}
        {settingElement}
      </div>
      <div className="settingDescription">
        {description}
      </div>
    </div>
  );
}
