import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "~/server/upload";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: "/api/upload",
});
export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: "/api/upload",
});

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: "/api/upload",
});
