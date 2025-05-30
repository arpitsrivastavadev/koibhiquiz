import { useEffect, useRef, useState, type ReactNode } from "react"
import { CgProfile } from "react-icons/cg"


type UserDropdownProps = {
    children?: ReactNode
    user?: {
        username: string,
        firstName?: string
    }
    closeTrigger: boolean
}


export default function UserDropdown({ children, user, closeTrigger }: UserDropdownProps) {
    const [open, setOpen] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null)


    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)

    }, [])


    useEffect(() => {
        if (open)
            setOpen(false)

    }, [closeTrigger])


    return (
        <div
            className="relative inline-block text-left"
            ref={dropdownRef}
        >
            <button
                className="p-1 hover:cursor-pointer flex flex-row gap-2 items-center justify-center"
                onClick={() => setOpen(prev => !prev)}
            >
                <CgProfile className="text-4xl" />
                {user?.firstName || user?.username || ""}
            </button>

            {
                open && (
                    <div className="absolute right-0 mt-2 w-40 bg-primary-500 shadow-lg z-10">
                        {children}
                    </div>
                )
            }
        </div>
    )
}