import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api, getAxiosErrorMessage, getAxiosErrorStatus } from "../../utils/axiosManager"
import { useAuth } from "../../contexts/AuthContext/AuthContext"

export default function Login() {
    const navigate = useNavigate()
    const { setAccessToken, setUser } = useAuth()

    const [step, setStep] = useState<"sendOtp" | "verifyOtp">("sendOtp")
    const [busy, setBusy] = useState<boolean>(false)
    const [userExist, setUserExist] = useState<boolean>(true)
    const [errors, setErrors] = useState<{
        sendOtp?: string
        verifyOtp?: string
    }>({})

    // Send OTP Form
    const [email, setEmail] = useState<string>("")

    // Verify OTP Form
    const [otp, setOtp] = useState<string>("")


    const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setBusy(true)
        setUserExist(true)
        setErrors({})

        try {
            await api.post("/api/login-send-otp", { email })

            setStep("verifyOtp")
        }
        catch (err) {
            const errMessage = getAxiosErrorMessage(err)
            const status = getAxiosErrorStatus(err)

            // Set error
            console.error("Error:", errMessage)
            setErrors(prev => ({
                ...prev,
                sendOtp: errMessage
            }))

            // Check if user exists or not
            if (status === 404) {
                setUserExist(false)
            }
        }
        finally {
            setBusy(false)
        }
    }


    const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setBusy(true)
        setErrors({})

        try {
            const response = await api.post("/api/verify-otp", { email, otp }, { withCredentials: true })

            setAccessToken(response.data.accessToken)
            setUser(response.data.user)

            navigate("/")
        }
        catch (err) {
            const errMessage = getAxiosErrorMessage(err)
            console.error("Error:", errMessage)

            setErrors(prev => ({
                ...prev,
                verifyOtp: errMessage
            }))
        }
        finally {
            setBusy(false)
        }
    }


    // Send OTP Form
    if (step === "sendOtp") {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <form
                    className="w-md flex flex-col gap-3"
                    onSubmit={handleSendOtp}
                >
                    <input
                        className="w-full text-xl rounded-lg px-6 py-3 outline-0 border-2 border-primary-500 hover:border-primary-600 active:border-primary-700 focus:border-primary-700 disabled:bg-bg-muted disabled:border-border-muted disabled:text-text-muted disabled:cursor-not-allowed"
                        type="email"
                        placeholder="Email"
                        disabled={busy}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <button
                        className="p-4 flex justify-center items-center gap-4 rounded-xl text-button-special-text disabled:text-button-special-text-disabled bg-button-special-500 hover:bg-button-special-600 active:bg-button-special-700 disabled:bg-button-special-disabled disabled:cursor-not-allowed"
                        type="submit"
                        disabled={busy}
                    >
                        Continue
                    </button>

                    {
                        errors.sendOtp && <p className="mt-4 px-6 text-error text-center">
                            {errors.sendOtp}
                        </p>
                    }

                    {
                        userExist === false && (
                            <p className="mt-4 px-6 text-center">
                                Create an account
                                <Link
                                    className="ml-1 font-medium underline text-text hover:text-text-muted"
                                    to="/signup"
                                >
                                    here
                                </Link>
                            </p>
                        )
                    }
                </form>
            </div>
        )
    }


    // Verify OTP Form
    if (step === "verifyOtp") {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <form
                    className="w-md flex flex-col gap-3"
                    onSubmit={handleVerifyOtp}
                >
                    <input
                        className="w-full text-xl rounded-lg px-6 py-3 outline-0 border-2 border-primary-500 hover:border-primary-600 active:border-primary-700 focus:border-primary-700 disabled:bg-bg-muted disabled:border-border-muted disabled:text-text-muted disabled:cursor-not-allowed"
                        type="text"
                        placeholder="OTP"
                        disabled={busy}
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        required
                    />

                    <button
                        className="p-4 flex justify-center items-center gap-4 rounded-xl text-button-special-text disabled:text-button-special-text-disabled bg-button-special-500 hover:bg-button-special-600 active:bg-button-special-700 disabled:bg-button-special-disabled disabled:cursor-not-allowed"
                        type="submit"
                        disabled={busy}
                    >
                        Verify
                    </button>

                    {
                        errors.verifyOtp && <p className="mt-4 px-6 text-error text-center">
                            {errors.verifyOtp}
                        </p>
                    }
                </form>
            </div>
        )
    }


    return <></>
}
