import { Button } from '@/shared/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/ui/sheet'
import { CommunitySidebar } from '@/widgets/communitySidebar'
import { Sidebar } from '@/widgets/sidebar'
import { Menu } from 'lucide-react'

interface BurgerMenuProps {
  communityId: string
}

export const BurgerMenu = ({ communityId }: BurgerMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-[72px]">
          <Sidebar />
        </div>
        <CommunitySidebar communityId={communityId} />
      </SheetContent>
    </Sheet>
  )
}
