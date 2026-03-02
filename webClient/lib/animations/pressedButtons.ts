import { Transition } from "framer-motion"


const transition: Transition = {
    type: "spring", stiffness: 500, damping: 20
}
export const pressedButtons = {
    whileHover: 1.1,
    whileTap: 0.9,
    transition: transition
}

