import { createRouteHandler } from "uploadthing/next";

import { env } from "~/env";
import { uploadRouter } from "~/server/upload";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
    callbackUrl: "/api/upload",
  },
});
