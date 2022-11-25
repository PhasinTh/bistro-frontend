import AppLayout from '@/components/layouts/AppLayout'
import { CtxOrReq } from 'next-auth/client/_utils'
import React, { useState } from 'react'
import cookie from 'cookie'
import axios from '@/src/axios'
import QRCodeList from '@/components/qrcode/QRCodeList'
import { getSession } from 'next-auth/react'
import QRCodeDialog from '@/components/qrcode/QRCodeDialog'
import QRCodeAddDialog from '@/components/qrcode/QRCodeAddDialog'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useCookies } from 'react-cookie'

export interface IQRCode {
    id: string
    name: string
    bistroId: string
}

type QRCodeProps = {
    qrcodeItems?: IQRCode[]
}

export default function QRCode({ qrcodeItems }: QRCodeProps) {
    const [open, setOpen] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)
    const [selectedItem, setSelectedItem] = useState<IQRCode | null>(null)
    const [cookies, setCookie] = useCookies(['bistroInfo'])
    const [items, setItems] = useState(qrcodeItems)

    const selectedItemHandler = (item: IQRCode) => {
        setSelectedItem(item)
        setOpen(true)
    }

    const fetchData = async () => {
        const bistro = cookies.bistroInfo
        const response = await axios.get(`/qrcode-service/bistro/${bistro.id}`)
        // console.log(response)
        if (response.data && Array.isArray(response.data.items)) {
            setItems(response.data.items || [])
        }
    }

    const onCloseHandler = async () => {
        await fetchData()
        setOpenAdd(false)
        setOpen(false)
    }

    return (
        <>
            <QRCodeList items={items} onItemSelected={selectedItemHandler} />
            <QRCodeDialog
                item={selectedItem}
                open={open}
                onClose={() => setOpen(false)}
                onEdit={() => setOpenAdd(true)}
            />
            <QRCodeAddDialog
                item={selectedItem}
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onDatUpdated={() => onCloseHandler()}
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
                onClick={() => {
                    setSelectedItem(null)
                    setOpenAdd(true)
                }}
            >
                <AddIcon />
            </Fab>
        </>
    )
}

QRCode.Layout = AppLayout

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

    const response = await axios.get(`/qrcode-service/bistro/${bistroInfo.id}`)
    let qrcodeItems: IQRCode[] = []

    if (response.data && Array.isArray(response.data.items)) {
        // console.log(response.data)
        qrcodeItems = response.data.items || []
    }
    // console.log(qrcodeItems)

    // Pass data to the page via props
    return { props: { qrcodeItems } }
}
