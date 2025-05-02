'use client'

import GenreFilters from '@/components/search/GenreFilters'
import Providers from '@/components/search/Providers'
import SearchInput from '@/components/search/SearchInput'
import VoteRange from '@/components/search/VoteRange'
import ShortlistSidebarContent from '@/components/shortlist/ShortlistSidebarContent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
export default function SearchSidebarContent() {
  return (
    <Tabs defaultValue="discover" className="flex h-full w-full flex-col gap-4">
      <TabsList className="grid w-full grid-cols-2 gap-1 bg-transparent px-2">
        <TabsTrigger
          value="discover"
          className="bg-card data-[state=active]:bg-accent/50 text-accent-foreground rounded-tl-none rounded-tr-none border border-t-0 border-r-0 border-l-0"
        >
          Discover
        </TabsTrigger>
        <TabsTrigger
          value="shortlist"
          className="bg-card data-[state=active]:bg-accent/50 text-accent-foreground rounded-tl-none rounded-tr-none border border-t-0 border-r-0 border-l-0"
        >
          Shortlist
        </TabsTrigger>
      </TabsList>
      <TabsContent value="discover">
        <div className="flex flex-col gap-4 p-5">
          <h2 className="text-lg font-semibold">Discover</h2>
          <div className="flex flex-col gap-4">
            <SearchInput type="discover" />
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">
                Discover movies by keywords
              </p>
            </div>
          </div>
          <Providers />
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
              Filter by streaming providers
            </p>
          </div>
          <GenreFilters />
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">Filter by genres</p>
          </div>
          <VoteRange />
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-sm">
              Filter by vote average
            </p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="shortlist">
        <ShortlistSidebarContent />
      </TabsContent>
    </Tabs>
  )
}
