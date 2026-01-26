import { HeroSection } from '@/components/home/hero-section'
import { ManifestoChapters } from '@/components/home/manifesto-chapters'
import { FlowPreview } from '@/components/home/flow-preview'
import { ClubhouseTeaser } from '@/components/home/clubhouse-teaser'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  // Fetch recent approved Flow expressions for the preview
  const supabase = createClient()
  const { data: flowPosts } = await supabase
    .from('expression_events')
    .select('content')
    .eq('moderation_status', 'approved')
    .not('content', 'is', null)
    .order('created_at', { ascending: false })
    .limit(30)

  // Extract just the content strings
  const expressions = flowPosts
    ?.map(post => post.content)
    .filter((content): content is string => Boolean(content))

  return (
    <>
      <HeroSection />
      <ManifestoChapters />
      <FlowPreview expressions={expressions} />
      <ClubhouseTeaser />
    </>
  )
}
