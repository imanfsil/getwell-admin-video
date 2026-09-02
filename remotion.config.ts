import { Config } from "@remotion/cli/config";

/**
 * Getwell Admin Promo - render configuration.
 *
 * setEntryPoint() is a safety net: even if a command is run without the
 * `src/index.ts` argument, Remotion still knows where the entry point is.
 */
Config.setEntryPoint("./src/index.ts");

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(17);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
