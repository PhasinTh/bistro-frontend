import React, { useState } from 'react'
import AppLayout from '@/components/layouts/AppLayout'
import OrderDialog from '@/components/orders/OrderDialog'
import OrderList from '@/components/orders/OrderList'
import cookie from 'cookie'
import { CtxOrReq } from 'next-auth/client/_utils'
import axios from '@/src/axios'
import { getSession } from 'next-auth/react'
import { useCookies } from 'react-cookie'

type OrderProps = {
    ordderList: IOrder[]
}

export interface IOrder {
    id: string
    qrcodeId: string
    qrcodeName: string
    isPaid: boolean
    items: IOrderItem[]
    createAt?: string
}

export interface IOrderItem {
    id: string
    menuId: string
    menuName: string
    menuImage: string
    menuPrice: number
    quantity: number
}

export default function Order({ ordderList }: OrderProps) {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState(ordderList)
    const [selectedItem, setSelectedItem] = useState<IOrder | null>(null)
    const [cookies, setCookie] = useCookies(['bistroInfo'])

    const selectedItemHandler = (item: IOrder) => {
        setSelectedItem(item)
        setOpen(true)
    }

    const fetchData = async () => {
        const bistro = cookies.bistroInfo
        const response = await axios.get(`/order-service/bistro/${bistro.id}`)
        if (response.data && Array.isArray(response.data.items)) {
            setItems(response.data.items || [])
        }
    }

    const dataUpdater = () => {
        fetchData()
        setOpen(false)
    }

    return (
        <div>
            <OrderList items={items} onItemSelected={selectedItemHandler} />
            <OrderDialog
                item={selectedItem}
                open={open}
                onClose={() => setOpen(false)}
                onDataUpdated={dataUpdater}
            />
        </div>
    )
}

Order.Layout = AppLayout

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
    const response = await axios.get(`/order-service/bistro/${bistroInfo.id}`)
    let ordderList: IOrder[] = []

    if (response.data && Array.isArray(response.data.items)) {
        console.log(response.data)
        ordderList = response.data.items || []
    }

    // Pass data to the page via props
    return { props: { ordderList } }
}
