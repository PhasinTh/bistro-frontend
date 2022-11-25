import { LayoutProps } from './AppLayout'

export default function DefaultLayout({ children }: LayoutProps) {
    return <div id="main">{children}</div>
}
