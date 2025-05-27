import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext/AuthContext"
import { useEffect, useState } from "react"
import { apiProtected, getAxiosErrorMessage } from "../../utils/axiosManager"


export default function Profile() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState<boolean>(true)
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")


    useEffect(() => {
        setFirstName(user?.firstName || "")
        setLastName(user?.lastName || "")
        setLoading(false)

    }, [user])


    const handleNameUpdate = async () => {
        setLoading(true)

        try {
            const response = await apiProtected.patch("/api/update-fullname", {
                firstName,
                lastName
            })

            setUser(response.data.user)
        }
        catch (err) {
            const errMessage = getAxiosErrorMessage(err)
            console.error(errMessage)
        }
        finally {
            setLoading(false)
        }
    }


    if (!user) {
        return (
            <div className="text-xl w-full h-full bg-bg flex flex-col justify-center items-center gap-8">
                <p>User not logged in 🔒</p>

                <button
                    className="w-64 p-4 flex justify-center items-center gap-4 rounded-xl text-button-special-text disabled:text-button-special-text-disabled bg-button-special-500 hover:bg-button-special-600 active:bg-button-special-700 disabled:bg-button-special-disabled disabled:cursor-not-allowed"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </div>
        )
    }


    return (
        <div className="text-xl w-full h-full bg-bg flex flex-col justify-center items-center gap-8">
            <p>Welcome, <span className="font-semibold">{user.firstName || user.username}</span></p>

            <form
                className="sm:w-md w-sm flex flex-col gap-3"
                onSubmit={handleNameUpdate}
            >
                <input
                    className="w-full text-xl rounded-lg px-6 py-3 outline-0 border-2 border-primary-500 hover:border-primary-600 active:border-primary-700 focus:border-primary-700 disabled:bg-bg-muted disabled:border-border-muted disabled:text-text-muted disabled:cursor-not-allowed"
                    type="text"
                    placeholder="First Name"
                    required
                    disabled={loading}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                />

                <input
                    className="w-full text-xl rounded-lg px-6 py-3 outline-0 border-2 border-primary-500 hover:border-primary-600 active:border-primary-700 focus:border-primary-700 disabled:bg-bg-muted disabled:border-border-muted disabled:text-text-muted disabled:cursor-not-allowed"
                    type="text"
                    placeholder="Last Name"
                    required
                    disabled={loading}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                />

                <button
                    className="w-full p-4 flex justify-center items-center gap-4 rounded-xl text-button-special-text disabled:text-button-special-text-disabled bg-button-special-500 hover:bg-button-special-600 active:bg-button-special-700 disabled:bg-button-special-disabled disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                >
                    Update
                </button>
            </form>
        </div>
    )
}
