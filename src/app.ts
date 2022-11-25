import { EmotionCache } from '@emotion/cache'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { LayoutProps } from '../components/layouts/AppLayout'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    Layout?: ({ children }: LayoutProps) => EmotionJSX.Element
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
    emotionCache?: EmotionCache
}
