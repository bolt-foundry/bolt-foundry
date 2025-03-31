import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";
import { BfDsButton } from "apps/bfDs/components/BfDsButton.tsx";
import { BfDsTooltip } from "apps/bfDs/components/BfDsTooltip.tsx";
import { useMutation } from "apps/boltFoundry/hooks/isographPrototypes/useMutation.tsx";
import mutation from "apps/boltFoundry/__generated__/__isograph/Mutation/LoginAsDemoPerson/entrypoint.ts";
import { getLogger } from "packages/logger/logger.ts";
import { useState } from "react";

const logger = getLogger(import.meta);

export const DemoButton = iso(`
  field BfCurrentViewer.DemoButton @component {
    __typename
  }
`)(function DemoButton() {
  const { commit: loginAsDemoPerson } = useMutation(mutation);
  const [isInFlight, setIsInFlight] = useState(false);

  const handleLogin = () => {
    setIsInFlight(true);
    loginAsDemoPerson({}, {
      onComplete: (data) => {
        logger.debug("Got demo login response", data);
        globalThis.location.pathname = "/formatter/voice";
        setIsInFlight(false);
      },
    });
  };

  return (
    <BfDsTooltip text="Try the demo">
      <div className="center">
        <BfDsButton
          text="Try the demo"
          xstyle={{ width: "80%" }}
          onClick={handleLogin}
          showSpinner={isInFlight}
        />
      </div>
    </BfDsTooltip>
  );
});
