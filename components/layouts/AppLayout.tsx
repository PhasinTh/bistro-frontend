import { Box, Toolbar } from '@mui/material'
import { ReactNode } from 'react'
import CustomAppBar from '../CustomAppBar'

export type LayoutProps = {
    children: ReactNode
}
const drawerWidth = 240

export default function AppLayout({ children }: LayoutProps) {
    return (
        <Box sx={{ display: 'flex' }} id="main">
            <CustomAppBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    )
}
