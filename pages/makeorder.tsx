import axios from '@/src/axios'
import { AppBar, Toolbar, Container, Typography, Paper } from '@mui/material'
import { CtxOrReq } from 'next-auth/client/_utils'
import { getSession } from 'next-auth/react'
import React, { useState } from 'react'
import MenuList, { IMenuItem } from '@/components/menu/MenuList'
import { IBistro } from './bistro/setting'
import MakeOrderDialog from '@/components/makeOrders/MakeOrderDialog'
import { Box } from '@mui/system'
import cookie from 'cookie'
import MakerOrderCartDialog from '@/components/makeOrders/MakerOrderCartDialog'
import QrCode from '@mui/icons-material/QrCode'
import OrderSuccessDialog from '@/components/makeOrders/OrderSuccessDialog'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { useSnackbar } from 'notistack'

type MakerOrderProps = {
    qrcode: any
    bistro: IBistro
    menuItems: IMenuItem[]
}

export interface IOrderItem {
    menuId: string
    menuPrice: number
    menuName: string
    menuImage: string
    quantity: number
}

export default function MakeOrder({
    bistro,
    qrcode,
    menuItems,
}: MakerOrderProps) {
    const [selectItem, setSelectItem] = useState<IMenuItem | null>()
    const [cart, setCart] = useState<IOrderItem[] | null>()
    const [open, setOpen] = useState(false)
    const [cartOpen, setCartOpen] = useState(false)
    const [responseItem, setResponseItem] = useState()
    const [openSuccesDialog, setOpenSuccesDialog] = useState(false)
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()

    const AddtoCartHandler = (item: IOrderItem) => {
        setCart((prev) => {
            if (prev) {
                const idx = prev.findIndex((p) => p.menuId == item.menuId)
                if (idx > -1) {
                    const temp = prev.filter((p) => p.menuId != item.menuId)
                    const match = prev[idx]
                    match.quantity += item.quantity
                    return [...temp, match]
                }
                return [...prev, item]
            } else {
                return [item]
            }
        })
        setOpen(false)
    }

    const itemSelectedHandler = (item: IMenuItem) => {
        setSelectItem(item)
        setOpen(true)
    }

    const submitData = async (items: IOrderItem[]) => {
        const response = await axios.post('/order-service', {
            bistroId: bistro.id,
            qrcodeId: uuidv4(), // TODO: tracking order by qrcode
            qrcodeName: qrcode.name,
            items: items,
        })
        if (response.data) {
            console.log('success', response.data)
            setResponseItem(response.data)
            setCartOpen(false)
            setOpenSuccesDialog(true)
        }
    }

    const onSuccess = () => {
        enqueueSnackbar('บันทึกข้อมูลเรียบร้อย', { variant: 'success' })
        setOpenSuccesDialog(false)

        setTimeout(() => {
            router.push('/')
        }, 3000)
    }

    return (
        <>
            <AppBar position="fixed" sx={{ top: 0 }}>
                <Toolbar
                    sx={{
                        mx: 'auto',
                    }}
                >
                    <Typography variant="h5">{bistro.name}</Typography>
                </Toolbar>
            </AppBar>
            <Container
                sx={{
                    my: 10,
                }}
            >
                <MenuList
                    items={menuItems}
                    onItemSelected={itemSelectedHandler}
                />
            </Container>
            <MakeOrderDialog
                item={selectItem}
                open={open}
                onClose={() => setOpen(false)}
                onAddToCart={AddtoCartHandler}
            />

            <MakerOrderCartDialog
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cart || []}
                onSubmitData={submitData}
            />
            <Paper
                onClick={() => setCartOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    bgcolor: 'green',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    py: 1,
                    px: 1,
                    cursor: 'pointer',
                }}
            >
                <Typography>
                    x {cart?.map((c) => c.quantity).reduce((a, b) => a + b)}
                </Typography>
                <Typography>ดูตะกร้า</Typography>
                <Typography>
                    {cart
                        ?.map((c) => c.menuPrice * c.quantity)
                        .reduce((a, b) => a + b)}{' '}
                    บาท
                </Typography>
            </Paper>
            <OrderSuccessDialog
                item={responseItem}
                open={openSuccesDialog}
                onClose={onSuccess}
            />
        </>
    )
}

export async function getServerSideProps(context: any) {
    let menuItems = null
    let bistro = null
    let qrcode = null

    if (context.query) {
        // bistroId
        // qrcodeId
        // qrcodeName

        qrcode = {
            id: context.query['qrcodeId'],
            name: context.query['qrcodeName'],
        }

        let response = await axios.get(
            '/menu-service/bistro/' + context.query['bistroId']
        )

        const { data } = response

        if (data) {
            menuItems = data.items
        }

        response = await axios.get(
            '/bistro-service/' + context.query['bistroId']
        )
        if (response.data) {
            bistro = response.data
        }
    }

    return {
        props: {
            qrcode,
            menuItems,
            bistro,
        },
    }
}
