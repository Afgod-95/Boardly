"use client"

import { Pin, LayoutPanelLeft, Layers } from 'lucide-react';
import CreateBoardModal from '../modals/CreateBoardModal';
import { Dialog, DialogTrigger } from './dialog';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect } from 'react';

const createItems = [
    { id: 1, icon: Pin, title: "Pin", description: "Upload photos or videos", href: "/dashboard/create/pin" },
    { id: 2, icon: LayoutPanelLeft, title: "Board", description: "Organize your ideas", href: null },
    { id: 3, icon: Layers, title: "Collage", description: "Create a visual mix", href: "/dashboard/create/collage" },
];

interface CreateProp {
    onClick?: () => void
    hideBottomSheet?: boolean
    setHideBottomSheet?: () => void
}

const Create = ({ onClick, hideBottomSheet, setHideBottomSheet }: CreateProp) => {
    useEffect(() => {
        const hideBottomSht = () => {
            if(onClick) {
                setHideBottomSheet
            }
        }
    },[])
    return (
        <div className="p-4">
            <h2 className="text-xl text-center font-semibold pb-4">Create</h2>
            <div className="flex flex-col gap-2">
                {createItems.map(item => (
                    <div key={item.id}>
                        {item.id === 2 ? (
                            <Dialog>
                                <DialogTrigger 
                                    className={clsx(
                                        "flex gap-4 items-center rounded-xl p-3 hover:bg-muted transition-colors w-full text-left"
                                    )}
                                >
                                    <div className="p-4 rounded-xl bg-accent">
                                        <item.icon size={22} />
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </DialogTrigger>
                                <CreateBoardModal />
                            </Dialog>
                        ) : (
                            <Link
                                href={item.href as string}
                                onClick={onClick}
                                className="flex gap-4 items-center rounded-xl p-3 hover:bg-muted transition-colors"
                            >
                                <div className="p-4 rounded-xl bg-accent">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Create