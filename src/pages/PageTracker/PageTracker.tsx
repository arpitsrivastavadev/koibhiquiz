import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { trackEvent } from "../../utils/mixpanel"


export default function PageTracker() {
    const location = useLocation()


    useEffect(() => {
        trackEvent("Page Visited", {
            path: location.pathname
        })

    }, [location.pathname])


    return null
}
