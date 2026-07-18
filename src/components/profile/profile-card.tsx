"use client";

import type { User } from "@prisma/client";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { UploadButton } from "~/lib/upload";
import { api } from "~/trpc/react";

export function ProfileCard({ user: initialUser }: { user: User }) {
  const utils = api.useUtils();
  const { data: user } = api.user.getCurrentUser.useQuery(undefined, {
    initialData: initialUser,
  });

  const updateProfileImage = api.user.updateProfileImage.useMutation({
    onSuccess: async () => {
      toast.success("Profile photo updated");
      await utils.user.getCurrentUser.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("") ?? "?";

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Separator />
        <div>
          <h3 className="mb-1 font-medium text-sm">Profile photo</h3>
          <p className="mb-3 text-muted-foreground text-sm">
            Upload a new photo (max 4MB).
          </p>
          <UploadButton
            endpoint="uploadProfileImage"
            onClientUploadComplete={(res) => {
              const uploaded = res.at(0);
              if (uploaded) {
                updateProfileImage.mutate({ imageUrl: uploaded.ufsUrl });
              }
            }}
            onUploadError={(error) => {
              toast.error(error.message);
            }}
            appearance={{
              button:
                "bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium h-9 px-4 rounded-md w-fit ut-uploading:bg-primary/60",
              allowedContent: "text-muted-foreground text-xs",
              container: "items-start",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
