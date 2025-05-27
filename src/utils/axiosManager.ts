import axios, { AxiosError } from "axios";
import { ENVS } from "./config";
import { getAuthContext } from "../contexts/AuthContext/getAuthContext";


export const SESSION_EXPIRED_ERROR_MESSAGE: string = "Session expired. Please log in again."


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


// Get new access token and refresh token on 401/403
apiProtected.interceptors.response.use(res => res, async (err) => {
    const originalRequest = err.config

    if ((err.response?.status === 401 || err.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true

        try {
            const response = await axios.post(`${ENVS.BACKEND_URL}/api/refresh`, null, { withCredentials: true })

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

            throw new Error(SESSION_EXPIRED_ERROR_MESSAGE)
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