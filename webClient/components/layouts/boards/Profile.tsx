
import React from 'react'
import Searchbar from '@/components/searchbar/Searchbar'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'



const Profile = () => {

    const profileIcon = (
        <>
            <div className='w-24 h-24 md:w-28 md:h-28 rounded-full p-4 flex items-center justify-center bg-teal-500'>
                <span className='text-white font-bold text-3xl'>G</span>
            </div>
        </>
    )

    return (
        <>
            {/** mobile */}
            <motion.div
                className='flex md:hidden  p-5 hover:accent transition-all flex-col gap-4 items-center justify-center text-center'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
               {profileIcon}
                <div className='text-center text-sm text-gray-500'>
                    {/** name */}
                    <h2 className='text-center font-bold text-2xl'>Godwin</h2>
                    <span>afgod98</span>
                </div>
                <div className='flex flex-row items-center justify-center gap-4'>
                    <Button className='px-4 bg-accent text-foreground hover:bg-muted cursor-pointer'>Share</Button>
                    <Button className='px-4 bg-accent text-foreground hover:bg-muted cursor-pointer'>Edit Profile</Button>
                </div>
            </motion.div>

             {/** desktop */}
             <motion.div
                className='hidden md:flex flex-row items-center justify-center text-center p-5 hover:accent transition-all gap-8 '
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className='flex flex-row items-center gap-3'>
                    {profileIcon}
                     <div className='text-center text-sm text-gray-500'>
                    {/** name */}
                    <h2 className='text-center font-bold text-2xl'>Godwin</h2>
                    <span>afgod98</span>
                </div>
                </div>
                <div className='flex flex-row items-center justify-center gap-4'>
                    <Button className='px-4 bg-accent text-foreground hover:bg-muted cursor-pointer'>Share</Button>
                    <Button className='px-4 bg-accent text-foreground hover:bg-muted cursor-pointer'>Edit Profile</Button>
                </div>
            </motion.div>
        </>

    )
}


export default Profile