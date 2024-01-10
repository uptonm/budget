"use server";

import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/require-await
export async function clearCachesByServerAction(path?: string) {
  try {
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/");
      revalidatePath("/[lang]");
    }
  } catch (error) {
    console.error("clearCachesByServerAction=> ", error);
  }
}
