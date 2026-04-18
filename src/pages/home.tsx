import PageTransition from "@/components/layout/PageTransition";
import LogoIntro from "@/components/home/LogoIntro";
import AboutPreview from "@/components/home/AboutPreview";
import VerticalsSection from "@/components/home/VerticalsSection";
import ProjectsPreview from "@/components/home/ProjectsPreview";

interface Props {
  onLogoAnimationComplete?: () => void;
}

export default function Home({ onLogoAnimationComplete }: Props) {
  return (
    <PageTransition>
      <LogoIntro onAnimationComplete={onLogoAnimationComplete} />
      <AboutPreview />
      <VerticalsSection />
      <ProjectsPreview />
    </PageTransition>
  );
}
