import mixpanel from "mixpanel-browser"
import { ENVS } from "./config"


export const initMixpanel = () => {
    mixpanel.init(ENVS.MIXPANEL_PROJECT_TOKEN, {
        persistence: "localStorage"
    })
}


export const trackEvent = (eventName: string, props?: Record<string, any>) => {
    mixpanel.track(eventName, props)
}