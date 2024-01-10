import { Suspense } from "react";
import { ContentContainer } from "~/app/_components/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/containers/SidebarContainer";
import { CategoryTableServer } from "~/app/_components/categories/CategoryTable.server";
import Link from "next/link";
import { Button } from "antd";
import { LoadingDetail } from "../_components/shared/LoadingDetail";

export default function HomePage() {
  return (
    <SidebarContainer>
      <ContentContainer
        header="Categories"
        action={
          <Link href="/categories/create">
            <Button type="primary">Create Category</Button>
          </Link>
        }
      >
        <Suspense
          fallback={
            <LoadingDetail
              title="Loading Categories"
              description="This may take a few seconds"
            />
          }
        >
          <CategoryTableServer />
        </Suspense>
      </ContentContainer>
    </SidebarContainer>
  );
}
