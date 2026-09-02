import React from "react";
import { Composition } from "remotion";
import {
  FPS,
  GetwellAdminPromo,
  HEIGHT,
  TOTAL_FRAMES,
  WIDTH,
} from "./GetwellAdminPromo";

/**
 * The composition id below MUST stay exactly "GetwellAdminPromo" - it is the
 * id used by `npm run render` and by the GitHub Actions workflow.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="GetwellAdminPromo"
        component={GetwellAdminPromo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
