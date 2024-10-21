import { useEffect } from "react";
import { MarketingFrame } from "packages/client/components/MarketingFrame.tsx";
import { ComingSoonHero } from "packages/client/components/ComingSoonHero.tsx";
import { MarketingCallToAction } from "packages/client/components/MarketingCallToAction.tsx";

import { Room } from "livekit-client";
import { useAppEnvironment } from "packages/client/contexts/AppEnvironmentContext.tsx";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

async function initalizeConnection(wsUrl: string, token: string) {
  const room = new Room();
  await room.connect(wsUrl, token);
  logger.info("connected to room", room.name);

  // Publish local camera and mic tracks
  await room.localParticipant.enableCameraAndMicrophone();
}

export function AgentPage(): React.ReactElement {
  const { LIVEKIT_URL, LIVEKIT_TEST_TOKEN } = useAppEnvironment();
  if (!LIVEKIT_TEST_TOKEN || !LIVEKIT_URL) {
    return (
      <MarketingFrame
        showLoginLink={false}
        showFooter={true}
      >
        <div className="header-section">
          Missing environment variables.
        </div>
        <MarketingCallToAction />
      </MarketingFrame>
    );
  }
  useEffect(() => {
    initalizeConnection(LIVEKIT_URL, LIVEKIT_TEST_TOKEN);
  }, []);
  return (
    <MarketingFrame
      showLoginLink={false}
      showFooter={true}
    >
      <div className="header-section">
        <ComingSoonHero />
      </div>
      <MarketingCallToAction />
    </MarketingFrame>
  );
}
