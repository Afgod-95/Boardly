import clsx from 'clsx'
import { PopoverTrigger, PopoverContent, Popover } from '../ui/popover'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { useRouter } from 'next/navigation'
import { DialogScrollableContent } from '../dialogs/DialogsScrollableContent'
import CreateBoardModal from '../modals/CreateBoardModal'
import { Plus } from 'lucide-react'


const CreateButton = () => {
  const router = useRouter()
  const createButtonAction = [
    { id: 1, label: 'Pin', onclick: () => router.push('/dashboard/create/pin') },
    { id: 2, label: 'Board', onclick: () => console.log('Board action to be implemented') }
  ]
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={clsx("md:px-8 md:py-3 p-3 bg-violet-700 hover:bg-violet-600 shadow-md rounded-full cursor-pointer ")}>
          <span className="text-lg text-white hidden md:block">Create</span>
          <Plus className='block md:hidden text-white'/>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="w-48 p-4 rounded-2xl shadow-xl border-0"
      >
        <div className="flex flex-col gap-1">
          <button
            onClick={createButtonAction[0].onclick}
            className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
          >
            <span className='text-xl font-medium'>{createButtonAction[0].label}</span>
          </button>

          <Dialog>
            <DialogTrigger>
              <div
                className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
              >
                <span className='text-xl font-medium'>{createButtonAction[1].label}</span>
              </div>
            </DialogTrigger>
            <CreateBoardModal />
          </Dialog>

        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CreateButton