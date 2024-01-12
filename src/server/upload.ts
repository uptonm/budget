import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "./auth";
import { api } from "~/trpc/server";

const f = createUploadthing({
  /**
   * Log out more information about the error, but don't return it to the client
   * @see https://docs.uploadthing.com/errors#error-formatting
   */
  errorFormatter: (err) => {
    console.log("Error uploading file", err.message);
    console.log("  - Above error caused by:", err.cause);

    return { message: err.message };
  },
});

/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const uploadRouter = {
  uploadProfileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getServerAuthSession();
      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("File uploaded", file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
