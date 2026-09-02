/**
 * ENTRY POINT.
 *
 * Every script in package.json and the GitHub Actions workflow point at this
 * exact file: src/index.ts. It must sit at <repo root>/src/index.ts.
 */
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
