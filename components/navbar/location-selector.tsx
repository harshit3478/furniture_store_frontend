"use client"

import * as React from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const locations = [
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "delhi", label: "Delhi" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "chennai", label: "Chennai" },
  { value: "kolkata", label: "Kolkata" },
  { value: "pune", label: "Pune" },
]

export function LocationSelector() {
  const [open, setOpen] = React.useState(false)
  const [selectedLocation, setSelectedLocation] = React.useState(locations[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="h-9 px-2 text-sm border-gray-200">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="hidden md:inline">{selectedLocation.label}</span>
            <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={() => {
                    setSelectedLocation(location)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLocation.value === location.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {location.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

