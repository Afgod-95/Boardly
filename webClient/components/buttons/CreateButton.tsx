"use client"

import clsx from 'clsx'
import { PopoverTrigger, PopoverContent, Popover } from '../ui/popover'
import { Dialog, DialogTrigger } from '../ui/dialog'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import CreateBoardModal from '../boards/modals/CreateBoardModal'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import BottomSheet from '../ui/BottomSheet'
import Link from 'next/link'


const CreateButton = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const [openBoardDialog, setOpenBoardDialog] = useState(false);
  const handleBoardClick = () => {
    setOpenSheet(false);
    setOpenBoardDialog(true);
  };
  return (
    <>
      <Popover>
        <PopoverTrigger asChild onClick={() => setOpenSheet(true)}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx("md:px-8 md:py-3 p-2.5 bg-violet-700 hover:bg-violet-600 shadow-md rounded-full cursor-pointer ")}
          >
            <span className="text-lg text-white hidden md:block">Create</span>
            <Plus className='block md:hidden text-white' />
          </motion.button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          className="w-48 p-4 rounded-2xl shadow-xl border-0 hidden md:block"
        >
          <div className="flex flex-col gap-1">
         
            {/** Link to pin */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
            >
              <Link href={"/dashboard/create/pin"}>
                <span className='text-xl font-medium'>Pin</span>
              </Link>
            </motion.div>

            <Dialog open={openBoardDialog} onOpenChange={setOpenBoardDialog}>
              <DialogTrigger>
                <div
                  className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
                >
                  <span className='text-xl font-medium'>Board</span>
                </div>
              </DialogTrigger>
              <CreateBoardModal />
            </Dialog>

            {/** Link to pin */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
            >
              <Link href={"/dashboard/create/pin"}>
                <span className='text-xl font-medium'>Collage</span>
              </Link>
            </motion.div>

          </div>
        </PopoverContent>


        {/** mobile bottom sheet for create */}
        <BottomSheet
          isOpen={openSheet}
          onClose={() => setOpenSheet(false)}
          maxHeight="45vh"
        >
          <h1 className='text-center text-2xl font-bold py-4'>Create</h1>
          <div className="flex flex-col gap-1 px-10 pb-10">
             {/** Link to pin */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
            >
              <Link href={"/dashboard/create/pin"}>
                <span className='text-xl font-medium'>Pin</span>
              </Link>
            </motion.div>


            <motion.button onClick={handleBoardClick}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
              >
                <span className='text-xl font-medium'>Board</span>
              </div>
            </motion.button>

           {/** Link to pin */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-full flex items-center gap-4 rounded-md px-3 py-2 text-left cursor-pointer text-sm hover:bg-muted"
            >
              <Link href={"/dashboard/create/pin"}>
                <span className='text-xl font-medium'>Pin</span>
              </Link>
            </motion.div>
          </div>
        </BottomSheet>
      </Popover>

      {/* Dialog outside of BottomSheet */}
      <Dialog open={openBoardDialog} onOpenChange={setOpenBoardDialog}>
        <CreateBoardModal />
      </Dialog>

    </>
  )
}

export default CreateButton