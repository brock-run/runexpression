'use client'

import { useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { VIBE_TAGS } from '@/lib/constants'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

interface VibeTagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
  className?: string
}

export function VibeTagSelector({
  selectedTags,
  onTagsChange,
  maxTags = 3,
  className,
}: VibeTagSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleTag = useCallback(
    (tag: string) => {
      if (selectedTags.includes(tag)) {
        onTagsChange(selectedTags.filter(t => t !== tag))
      } else if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, tag])
      }
    },
    [selectedTags, onTagsChange, maxTags]
  )

  const clearAll = useCallback(() => {
    onTagsChange([])
  }, [onTagsChange])

  const categories = [
    { name: 'Mindset', tags: VIBE_TAGS.MINDSET },
    { name: 'Context', tags: VIBE_TAGS.CONTEXT },
    { name: 'Feeling', tags: VIBE_TAGS.FEELING },
  ]

  return (
    <div className={cn('space-y-3', className)}>
      {/* Selected tags preview */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="default"
              className="cursor-pointer pr-1.5"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <X className="ml-1.5 h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Expand/collapse button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between"
      >
        <span>
          {selectedTags.length === 0
            ? 'Add vibe tags'
            : `${selectedTags.length}/${maxTags} tags selected`}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Expanded tag selector */}
      {isExpanded && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          {categories.map(category => (
            <div key={category.name}>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.tags.map(tag => {
                  const isSelected = selectedTags.includes(tag)
                  const isDisabled =
                    !isSelected && selectedTags.length >= maxTags

                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer transition-colors',
                        isDisabled && 'cursor-not-allowed opacity-50'
                      )}
                      onClick={() => !isDisabled && toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  )
                })}
              </div>
            </div>
          ))}

          {selectedTags.length >= maxTags && (
            <p className="text-xs text-muted-foreground">
              Maximum {maxTags} tags allowed. Remove a tag to add another.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
