'use client'
import { useIsMobile } from 'lib/hooks'
import SearchDialog from './SearchDialog'
import SearchDrawer from './SearchDrawer'

export default function SearchModal() {
  const isMobile = useIsMobile()
  return isMobile ? <SearchDrawer /> : <SearchDialog />
}
