'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TagFilterProps {
  tags: string[]
  selectedTag?: string | null
  className?: string
}

export function TagFilter({ tags, selectedTag, className }: TagFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleTagClick = (tag: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (tag === null || tag === selectedTag) {
      // Clear the tag filter
      params.delete('tag')
    } else {
      params.set('tag', tag)
    }

    const queryString = params.toString()
    router.push(queryString ? `${pathname}?${queryString}` : pathname)
  }

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button
        onClick={() => handleTagClick(null)}
        className={cn(
          'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
          !selectedTag
            ? 'bg-orange-600 text-white'
            : 'bg-run-gray-100 text-run-gray-700 hover:bg-run-gray-200'
        )}
      >
        All
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={cn(
            'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            selectedTag === tag
              ? 'bg-orange-600 text-white'
              : 'bg-run-gray-100 text-run-gray-700 hover:bg-run-gray-200'
          )}
        >
          #{tag}
        </button>
      ))}
    </div>
  )
}
