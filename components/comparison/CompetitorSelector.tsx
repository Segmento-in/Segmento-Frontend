"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { SearchableList } from "@/components/ui/searchable-list"
import { Button } from "@/components/ui/button"
import { COMPETITORS, type Competitor } from "@/lib/comparison-data"

interface CompetitorSelectorProps {
    selectedCompetitors: string[]
    onAddCompetitor: (competitorId: string) => void
    maxCompetitors?: number
}

export function CompetitorSelector({
    selectedCompetitors,
    onAddCompetitor,
    maxCompetitors = 4,
}: CompetitorSelectorProps) {
    const [open, setOpen] = React.useState(false)

    const availableCompetitors = COMPETITORS.map((competitor) => ({
        id: competitor.id,
        label: competitor.name,
        description: competitor.tagline,
    }))

    const handleSelect = (id: string) => {
        onAddCompetitor(id)
        setOpen(false)
    }

    const isMaxReached = selectedCompetitors.length >= maxCompetitors

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={isMaxReached}
                    className="gap-2"
                    size="lg"
                >
                    <Plus className="h-5 w-5" />
                    Add Competitor
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Add Competitor to Compare</DialogTitle>
                    <DialogDescription>
                        Select a competitor to see how Segmento Sense stacks up. You can
                        compare up to {maxCompetitors} solutions at once.
                        {isMaxReached && (
                            <span className="block mt-2 text-primary-600 font-medium">
                                Maximum comparison limit reached. Remove a competitor to add another.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <SearchableList
                    items={availableCompetitors}
                    onSelect={handleSelect}
                    selectedIds={selectedCompetitors}
                    placeholder="Search for a competitor..."
                    emptyMessage="No competitors match your search."
                />
            </DialogContent>
        </Dialog>
    )
}
