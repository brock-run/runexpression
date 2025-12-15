'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { TextSubmissionForm } from './text-submission-form'
import { ImageSubmissionForm } from './image-submission-form'

type SubmissionType = 'text' | 'image'

export function FlowSubmission() {
  const [activeTab, setActiveTab] = useState<SubmissionType>('text')

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs
          defaultValue="text"
          value={activeTab}
          onValueChange={value => setActiveTab(value as SubmissionType)}
        >
          {/* Tab Selector */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>

          {/* Text Submission */}
          <TabsContent value="text">
            <TextSubmissionForm />
          </TabsContent>

          {/* Image Submission */}
          <TabsContent value="image">
            <ImageSubmissionForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
