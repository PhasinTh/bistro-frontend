import { Box, Container, Fab } from '@mui/material'
import MenuList, { IMenuItem } from '@/components/menu/MenuList'
import AppLayout from '@/components/layouts/AppLayout'
import AddIcon from '@mui/icons-material/Add'
import { useState } from 'react'
import MenuCreateForm from '@/components/menu/MenuCreateForm'
import axios from '@/src/axios'
import { CtxOrReq } from 'next-auth/client/_utils'
import cookie from 'cookie'
import { useCookies } from 'react-cookie'
import { getSession } from 'next-auth/react'

type MenuProps = {
    menuItems?: IMenuItem[]
}

export default function Menu({ menuItems }: MenuProps) {
    const [open, setOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null)
    const [cookies, setCookie] = useCookies(['bistroInfo'])
    const [items, setItems] = useState(menuItems)

    const itemSelectHandler = (item: IMenuItem) => {
        setSelectedItem(item)
        setOpen(true)
    }

    const onAddClick = () => {
        setSelectedItem(null)
        setOpen(true)
    }

    const fetchData = async () => {
        const bistro = cookies.bistroInfo
        const response = await axios.get(`/menu-service/bistro/${bistro.id}`)
        if (response.data && Array.isArray(response.data.items)) {
            setItems(response.data.items || [])
        }
    }

    const onCloseHandler = async (val: boolean) => {
        await fetchData()
        setOpen(false)
    }

    return (
        <>
            <MenuList
                items={items}
                onItemSelected={(item: IMenuItem) => itemSelectHandler(item)}
            />
            <MenuCreateForm
                item={selectedItem}
                open={open}
                onClose={onCloseHandler}
            />
            <Fab
                sx={{
                    position: 'absolute',
                    bottom: {
                        xs: 16,
                        md: 32,
                    },
                    right: {
                        xs: 8,
                        md: 16,
                    },
                }}
                color={'secondary'}
                onClick={onAddClick}
            >
                <AddIcon />
            </Fab>
        </>
    )
}

Menu.Layout = AppLayout

export async function getServerSideProps(context: CtxOrReq) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        }
    }

    const bistroInfo = JSON.parse(
        cookie.parse(context.req?.headers.cookie || '')?.bistroInfo
    )

    const response = await axios.get(`/menu-service/bistro/${bistroInfo.id}`)
    let menuItems: IMenuItem[] = []

    if (response.data && Array.isArray(response.data.items)) {
        // console.log(response.data)
        menuItems = response.data.items || []
    }

    // Pass data to the page via props
    return { props: { menuItems } }
}
