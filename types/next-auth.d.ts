import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

/** Example on how to extend the built-in session types */
declare module 'next-auth' {
    interface User {
        accessToken?: string
        role?: string
    }
    interface Session {
        user: {
            accessToken?: string
            role?: string
        } & DefaultSession['user']
    }
}

/** Example on how to extend the built-in types for JWT */
declare module 'next-auth/jwt' {
    interface JWT {
        role?: string
    }
}
