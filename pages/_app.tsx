import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/createEmotionCache'
import { AppPropsWithLayout } from '../src/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import { SnackbarProvider } from 'notistack'
import { SessionProvider } from 'next-auth/react'
import { CookiesProvider } from 'react-cookie'

const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props: AppPropsWithLayout) {
    const {
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps: { session, ...pageProps },
    } = props

    const Layout = Component.Layout ?? DefaultLayout

    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />

                <CookiesProvider>
                    <SessionProvider session={session}>
                        <SnackbarProvider
                            autoHideDuration={5000}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </SnackbarProvider>
                    </SessionProvider>
                </CookiesProvider>
            </ThemeProvider>
        </CacheProvider>
    )
}
