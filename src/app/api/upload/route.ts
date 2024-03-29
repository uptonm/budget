import { createNextRouteHandler } from "uploadthing/next";

import { uploadRouter } from "~/server/upload";

// Edge works in prod, but our webhook doesn't due to request-loop-protection
// export const runtime = "edge";

export const { GET, POST } = createNextRouteHandler({
  router: uploadRouter,
  config: {
    callbackUrl: "/api/upload",
    uploadthingId: process.env.UPLOADTHING_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});
