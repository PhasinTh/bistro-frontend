import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material'
import { width } from '@mui/system'
import { useRouter } from 'next/router'
import { IQRCode } from 'pages/bistro/qrcode'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { IOrder, IOrderItem } from '../../pages/bistro/orders'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'
import QRCodeDialog from './QRCodeDialog'

type OrderListProps = {
    items?: IQRCode[]
    onItemSelected: (item: IQRCode) => void
}

export default function QRCodeList({ items, onItemSelected }: OrderListProps) {
    const router = useRouter()
    // const [qrcode, setQRcode] = useState()

    return (
        <>
            <Grid container spacing={2}>
                {items ? (
                    items.map((item: IQRCode) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <Card>
                                <CardActionArea
                                    onClick={() => onItemSelected(item)}
                                >
                                    <CardMedia
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                        }}
                                    >
                                        <QRCodeCanvas
                                            value={
                                                process.env.NEXTBACKED_URL ||
                                                'http://178.128.26.253' +
                                                    '/makeorder?bistroId=' +
                                                    item.bistroId +
                                                    '&qrcodeId=' +
                                                    uuidv4() +
                                                    '&qrcodeName=' +
                                                    item.name
                                            }
                                            size={200}
                                        />
                                    </CardMedia>
                                    <CardContent
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                        }}
                                    >
                                        <Typography
                                            component="div"
                                            variant="h6"
                                            sx={{ mx: 'auto' }}
                                        >
                                            {item?.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <></>
                )}
            </Grid>
        </>
    )
}
