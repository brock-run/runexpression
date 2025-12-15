import { HeroSection } from '@/components/home/hero-section'
import { ManifestoChapters } from '@/components/home/manifesto-chapters'
import { FlowPreview } from '@/components/home/flow-preview'
import { ClubhouseTeaser } from '@/components/home/clubhouse-teaser'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ManifestoChapters />
      <FlowPreview />
      <ClubhouseTeaser />
    </>
  )
}
