import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import SettingsIcon from '@mui/icons-material/Settings'
import QrCodeIcon from '@mui/icons-material/QrCode'
import { useRouter } from 'next/router'
import {
    Button,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
// import { signIn, signOut } from 'next-auth/react'

type AppBarProps = {
    window?: () => Window
}
const drawerWidth = 240

export default function CustomAppBar({ window }: AppBarProps) {
    const router = useRouter()
    const { data: session, status } = useSession()

    const menuItems = [
        {
            name: 'home',
            display: 'Home',
            link: '/bistro',
            icon: <HomeIcon />,
        },
        {
            name: 'menu',
            display: 'Menu',
            link: '/bistro/menu',
            icon: <MenuBookIcon />,
        },
        {
            name: 'qrcode',
            display: 'QRCode',
            link: '/bistro/qrcode',
            icon: <QrCodeIcon />,
        },
        {
            name: 'order',
            display: 'Orders',
            link: '/bistro/orders',
            icon: <ReceiptLongIcon />,
        },
        {
            name: 'setting',
            display: 'Setting',
            link: '/bistro/setting',
            icon: <SettingsIcon />,
        },
    ]

    const menuClickHandler = (url: string) => {
        router.push(url)
        if (mobileOpen) {
            setMobileOpen(false)
        }
    }

    const drawer = (
        <div>
            <Toolbar>
                {status === 'authenticated' ? (
                    <Typography sx={{ mx: 'auto' }}>
                        {session?.user?.name}
                    </Typography>
                ) : (
                    <></>
                )}
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem
                        key={item.name}
                        disablePadding
                        onClick={() => menuClickHandler(item.link)}
                    >
                        <ListItemButton selected={router.asPath === item.link}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.display} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    )

    const [mobileOpen, setMobileOpen] = React.useState(false)
    const container =
        window !== undefined ? () => window().document.body : undefined

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                    {status === 'authenticated' ? (
                        <Button color="error" onClick={() => signOut()}>
                            ออกจากระบบ
                        </Button>
                    ) : (
                        <></>
                    )}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                    {status === 'authenticated' ? (
                        <Button color="error" onClick={() => signOut()}>
                            ออกจากระบบ
                        </Button>
                    ) : (
                        <></>
                    )}
                </Drawer>
            </Box>
        </>
    )
}
