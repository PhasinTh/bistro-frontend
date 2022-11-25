import axios from '@/src/axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
    // https://next-auth.js.org/configuration/providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'email',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const response = await axios.post(
                    '/auth-service/login',
                    credentials
                )
                const { data } = response
                if (data) {
                    // const response = await axios.get(
                    //     `/bistro-service/owner/${data.user.id}`
                    // )

                    data.user['accessToken'] = data.accessToken
                    // data.user['bistro'] = response.data
                    return data.user
                }
                return null
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.JWT_SECRET_KEY || 'secret',
    },
    callbacks: {
        jwt: async ({ token, user, account }) => {
            if (account && user) {
                token.email = user?.email
                token.name = user?.name
                token.sub = user?.id
                token.accessToken = user?.accessToken
                token.role = user?.role
            }

            return token
        },
        session: async ({ session, user, token }) => {
            // console.log('session', session, user, token)
            session.user = token // Setting token in session
            // session.user.accessToken = token.accessToken
            // console.log('session', session)
            return session
        },
    },
    debug: true,
    theme: {
        colorScheme: 'light',
    },
    pages: {
        signIn: '/auth/signin',
    },
})
