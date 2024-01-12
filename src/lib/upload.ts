import { generateComponents } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "~/server/upload";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>({
    url: (process.env.VERCEL_URL ?? window.location.origin) + "/api/upload",
  });

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: (process.env.VERCEL_URL ?? window.location.origin) + "/api/upload",
});
