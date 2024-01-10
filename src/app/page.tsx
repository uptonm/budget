import { ContentContainer } from "~/app/_components/containers/ContentContainer";
import { SidebarContainer } from "~/app/_components/containers/SidebarContainer";

export default function HomePage() {
  return (
    <SidebarContainer>
      <ContentContainer header="Home"></ContentContainer>
    </SidebarContainer>
  );
}
