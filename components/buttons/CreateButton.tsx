import clsx from 'clsx'
import { PopoverTrigger, PopoverContent, Popover } from '../ui/popover'

const CreateButton = () => {
    const createButtonAction = [
        { id: 1, label: 'Pin', onclick: () => console.log('Pin action to be implemented')},
        { id: 2, label: 'Board', onclick: () => console.log('Board action to be implemented')}
    ]
    return (
        <Popover>
            <PopoverTrigger asChild>
              <button className={clsx('bg-violet-800 py-3 px-8 rounded-full cursor-pointer ')}>
                 <span className="text-lg text-white">Create</span>
                </button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="start"
              className="w-48 p-4 rounded-2xl shadow-xl border-0"
            >
              <div className="flex flex-col gap-1">
                {createButtonAction.map((item, index) => {
                    return (
                      <button key = {index}  
                        onClick={item.onclick}
                        className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
                      >
                        <span className='text-xl font-medium'>{item.label}</span>
                      </button>
                    )
                })}
              </div>
            </PopoverContent>
          </Popover>
    )
}

export default CreateButton