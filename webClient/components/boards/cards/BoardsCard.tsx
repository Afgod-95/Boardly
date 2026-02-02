import React, { ReactEventHandler, useState } from 'react'
import Image from 'next/image'
import { BoardsCardProps } from '../types/boardItem'
import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'



const BoardsCard = ({ board, previewPins, onBoardClick, onEdit }: BoardsCardProps) => {
    const pinCount = board.pinIds.length // Use total pins from board, not just preview
    const displayPins = previewPins.slice(0, 5)


    const [isHovered, setIsHovered] = useState<boolean>(false);


    return (
        <div className="group cursor-pointer"
            onClick={onBoardClick}
        >
            {/* Board Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-4/3"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* 1 IMAGE */}
                {displayPins.length === 1 && (
                    <div className="flex gap-0.5 h-full">
                        <div className="relative flex-2 overflow-hidden group/image">
                            <Image
                                src={displayPins[0].img}
                                alt={displayPins[0].title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-200" />
                        </div>

                        <div className="flex-1 flex flex-col gap-0.5">
                            <div className="flex-1 bg-neutral-300" />
                            <div className="flex-1 bg-neutral-400" />
                        </div>
                    </div>
                )}

                {/* 2 IMAGES */}
                {displayPins.length === 2 && (
                    <div className="flex gap-0.5 bg-muted h-full">
                        <div className="relative flex-2 overflow-hidden group/image">
                            <Image
                                src={displayPins[0].img}
                                alt={displayPins[0].title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-0.5">
                            <div className="relative flex-1 overflow-hidden group/image ">
                                <Image
                                    src={displayPins[1].img}
                                    alt={displayPins[1].title}
                                    fill
                                    className="object-cover"
                                />

                            </div>

                            <div className="relative flex-1 bg-accent overflow-hidden group/image" />
                        </div>
                    </div>
                )}


                {/* 3 IMAGES */}
                {displayPins.length === 3 && (
                    <div className="flex gap-0.5 h-full">
                        <div className="relative flex-2 overflow-hidden group/image">
                            <Image
                                src={displayPins[0].img}
                                alt={displayPins[0].title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-0.5">
                            {displayPins.slice(1).map((pin) => (
                                <div
                                    key={pin.id}
                                    className="relative flex-1 overflow-hidden group/image"
                                >
                                    <Image
                                        src={pin.img}
                                        alt={pin.title}
                                        fill
                                        className="object-cover"
                                    />

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4 IMAGES */}
                {displayPins.length === 4 && (
                    <div className="flex gap-0.5 h-full">
                        <div className="relative flex-2 overflow-hidden group/image">
                            <Image
                                src={displayPins[0].img}
                                alt={displayPins[0].title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-0.5">
                            {displayPins.slice(1).map((pin) => (
                                <div
                                    key={pin.id}
                                    className="relative overflow-hidden group/image"
                                >
                                    <Image
                                        src={pin.img}
                                        alt={pin.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5+ IMAGES */}
                {displayPins.length >= 5 && (
                    <div className="flex gap-0.5 h-full">
                        {/* Left big image */}
                        <div className="relative flex-2  overflow-hidden group/image">
                            <Image
                                src={displayPins[0].img}
                                alt={displayPins[0].title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Right grouped images */}
                        <div className="flex-1 grid grid-cols-2 gap-0.5">
                            {displayPins.slice(1, 5).map((pin, index) => (
                                <div
                                    key={pin.id}
                                    className="relative overflow-hidden group/image"
                                >
                                    <Image
                                        src={pin.img}
                                        alt={pin.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isHovered && (
                    <div className='absolute bg-black/40 inset-0 transition-opacity duration-300 rounded-2xl ' >
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white/90 p-2.5 rounded-xl transition-colors absolute right-2 bottom-2"
                            onClick={(e: React.MouseEvent) => { 
                                e.stopPropagation()
                                onEdit?.(board)
                            }}
                            aria-label="Share pin"
                        >
                            <Pencil size={20} color="black" />
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Board Info */}
            <div className="mt-3 px-1">
                <h3 className="font-semibold text-base line-clamp-1">
                    {board.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {pinCount} {pinCount === 1 ? 'pin' : 'pins'}
                </p>
            </div>
        </div>
    )
}

export default BoardsCard