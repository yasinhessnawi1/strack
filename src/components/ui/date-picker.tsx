"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DatePickerInput({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
  className,
}: DatePickerInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate && onChange) {
      // Convert to YYYY-MM-DD format
      const year = newDate.getFullYear()
      const month = String(newDate.getMonth() + 1).padStart(2, '0')
      const day = String(newDate.getDate()).padStart(2, '0')
      onChange(`${year}-${month}-${day}`)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Keep Basic component for demo page
export const Basic = () => {
  const [value, setValue] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  )

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <DatePickerInput
        value={value}
        onChange={setValue}
        label="Select Date"
        placeholder="Pick a date"
      />
      {value && (
        <p className="mt-4 text-sm text-muted-foreground">
          Selected: {value}
        </p>
      )}
    </div>
  )
}
