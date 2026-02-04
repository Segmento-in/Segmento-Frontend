"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface SearchableListProps {
    items: Array<{ id: string; label: string; description?: string }>
    onSelect: (id: string) => void
    selectedIds?: string[]
    placeholder?: string
    emptyMessage?: string
}

/**
 * Searchable list component (alternative to Radix Command)
 * Provides search and filter functionality for competitor selection
 */
export function SearchableList({
    items,
    onSelect,
    selectedIds = [],
    placeholder = "Search...",
    emptyMessage = "No results found.",
}: SearchableListProps) {
    const [search, setSearch] = React.useState("")

    const filteredItems = React.useMemo(() => {
        if (!search) return items
        const lowerSearch = search.toLowerCase()
        return items.filter(
            (item) =>
                item.label.toLowerCase().includes(lowerSearch) ||
                item.description?.toLowerCase().includes(lowerSearch)
        )
    }, [items, search])

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-9"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="max-h-100 overflow-y-auto">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {filteredItems.map((item) => {
                            const isSelected = selectedIds.includes(item.id)
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => !isSelected && onSelect(item.id)}
                                    disabled={isSelected}
                                    className={cn(
                                        "w-full text-left p-4 rounded-lg border-2 transition-all",
                                        isSelected
                                            ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-50"
                                            : "border-gray-200 hover:border-primary-500 hover:bg-primary-50/30 cursor-pointer"
                                    )}
                                >
                                    <div className="font-semibold text-base">{item.label}</div>
                                    {item.description && (
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {item.description}
                                        </div>
                                    )}
                                    {isSelected && (
                                        <div className="text-xs text-primary-600 mt-2 font-medium">
                                            ✓ Already selected
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
