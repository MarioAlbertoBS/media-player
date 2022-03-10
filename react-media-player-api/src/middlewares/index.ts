import isAuthenticated from "./auth";

export interface Middlewares {
    isAuthenticated: any
}

const middlewares: Middlewares = {
    isAuthenticated
}

export default middlewares;