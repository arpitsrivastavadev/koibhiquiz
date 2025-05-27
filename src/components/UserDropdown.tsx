import { useEffect, useRef, useState } from "react"
import { api, getAxiosErrorMessage } from "../utils/axiosManager"
import { useAuth } from "../contexts/AuthContext/AuthContext"
import { useNavigate } from "react-router-dom"


type UserDropdownProps = {
    user: {
        username: string,
        firstName?: string
    }
}


export default function UserDropdown({ user }: UserDropdownProps) {
    const navigate = useNavigate()
    const { setAccessToken, setUser } = useAuth()

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


    const handleProfile = () => {
        navigate("/profile")

        setOpen(false)
    }


    const handleLogout = async () => {
        try {
            await api.post("/api/logout", null, { withCredentials: true })

            setAccessToken(null)
            setUser(null)
        }
        catch (err) {
            const errMessage = getAxiosErrorMessage(err)
            console.error(errMessage)
        }
        finally {
            setOpen(false)
        }
    }


    return (
        <div
            className="relative inline-block text-left"
            ref={dropdownRef}
        >
            <button
                className="p-4 hover:cursor-pointer"
                onClick={() => setOpen(prev => !prev)}
            >
                {user.firstName || user.username}
            </button>

            {
                open && (
                    <div className="absolute right-0 mt-2 w-40 bg-primary-500 shadow-lg z-10">
                        <button
                            className="block w-full px-4 py-2 text-left bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                            onClick={handleProfile}
                        >
                            Profile
                        </button>

                        <button
                            className="block w-full px-4 py-2 text-left bg-primary-500 hover:bg-primary-600 active:bg-primary-700"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                )
            }
        </div>
    )
}