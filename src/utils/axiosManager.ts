import axios, { AxiosError } from "axios";
import { ENVS } from "./config";
import { getAuthContext } from "../contexts/AuthContext/getAuthContext";


export const api = axios.create({
    baseURL: ENVS.BACKEND_URL,
    withCredentials: false
})


export const apiProtected = axios.create({
    baseURL: ENVS.BACKEND_URL,
    withCredentials: true
})


// Attach access token on every request
apiProtected.interceptors.request.use(config => {
    const token = getAuthContext().accessToken
    if (token)
        config.headers.Authorization = `Bearer ${token}`

    return config
})


// Get new access token and refresh token on 401
apiProtected.interceptors.response.use(res => res, async (err) => {
    const originalRequest = err.config

    if ((err.response?.status === 401 || err.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true

        try {
            // Use axios itself to avoid having an interceptor in the process
            const response = await axios.post("/api/refresh", null, { withCredentials: true })

            // Update access token and user information
            const { accessToken, user } = response.data

            const ctx = getAuthContext()
            ctx.setAccessToken(accessToken)
            ctx.setUser(user)

            // Rerun the previous request (using axios itself) with updated access token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return axios(originalRequest)
        }
        catch (refershError) {
            const ctx = getAuthContext()
            ctx.setAccessToken(null)
            ctx.setUser(null)

            throw new Error("Session expired. Please log in again.")
        }
    }

    return Promise.reject(err)
})


// Get axios error message
export const getAxiosErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<{ message?: string }>

        // Check for backend provided message
        const backendMessage = axiosError.response?.data?.message
        if (backendMessage)
            return backendMessage

        // Fallback to generic axios error message
        return axiosError.message || "An unknown error occurred"
    }

    // If it's native JS error
    if (error instanceof Error) {
        return error.message
    }

    return "An unknown error occurred"
}