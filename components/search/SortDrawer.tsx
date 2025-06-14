import { Button } from 'components/ui/Button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from 'components/ui/Drawer'
import Radio from 'components/ui/Radio'
import { SORT_OPTIONS } from 'lib/constants'
import { ArrowUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SortDrawer() {
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort_by')
  const sortBy = sort ? sort.split('.')[0] : 'popularity'
  const [selectedValue, setSelectedValue] = useState(sortBy)
  const [selectedDirection, setSelectedDirection] = useState(
    sort ? sort.split('.')[1] : 'desc',
  )
  const pathname = usePathname()
  const router = useRouter()

  const handleDirectionChange = (value: string) => {
    setSelectedDirection(value)

    const params = new URLSearchParams(searchParams)
    params.set('sort_by', `${selectedValue}.${value}`)
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  const handleSortChange = (value: string) => {
    setSelectedValue(value)

    const params = new URLSearchParams(searchParams)
    params.set('sort_by', `${value}.${selectedDirection}`)
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sort</DrawerTitle>
        </DrawerHeader>
        <div className="flex h-full flex-col gap-5 p-4">
          <div className="flex flex-col gap-2">
            <h3 className="mb-2 text-sm font-medium">Direction</h3>
            <div className="flex flex-col gap-2">
              <Radio
                values={[
                  { value: 'asc', label: 'Ascending' },
                  { value: 'desc', label: 'Descending' },
                ]}
                onChange={handleDirectionChange}
                defaultValue={selectedDirection}
              />
            </div>
            <h3 className="mb-2 text-sm font-medium">Sort by</h3>
            <div className="flex flex-col gap-2">
              <Radio
                values={Object.entries(SORT_OPTIONS).map(([key, value]) => ({
                  value: key,
                  label: value.label,
                }))}
                onChange={handleSortChange}
                defaultValue={sortBy}
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
