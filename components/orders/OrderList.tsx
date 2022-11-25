import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { IOrder, IOrderItem } from '../../pages/bistro/orders'
import { IMenuItem } from '../menu/MenuList'
import moment from 'moment'

type OrderListProps = {
    items?: IOrder[]
    onItemSelected: (item: IOrder) => void
}

export default function OrderList({ items, onItemSelected }: OrderListProps) {
    const router = useRouter()
    const calTotal = (items: IOrderItem[]) => {
        Array.isArray(items)
        return Array.isArray(items)
            ? items.map((i) => i.menuPrice * i.quantity).reduce((a, b) => a + b)
            : null
    }

    return (
        <Grid container spacing={2}>
            {items?.map((item: IOrder) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    onClick={() => {}}
                    key={item.id}
                    alignItems="stretch"
                >
                    <Card>
                        <CardActionArea onClick={() => onItemSelected(item)}>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Typography component="div" variant="h6">
                                        {item.qrcodeName}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="h6"
                                        color={item.isPaid ? 'primary' : ''}
                                    >
                                        {item.isPaid ? 'สำเร็จ' : 'รอ'}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography component="div" variant="body1">
                                        {moment(item?.createAt).format(
                                            'DD/MM/yyyy HH:mm'
                                        )}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                {Array.isArray(item?.items) ? (
                                    item?.items.map((i) => (
                                        <Grid container key={i.id}>
                                            <Grid item xs={5}>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                >
                                                    {i.menuName}
                                                </Typography>
                                            </Grid>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                            />
                                            <Grid item xs={2}>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    sx={{ textAlign: 'center' }}
                                                >
                                                    {i.menuPrice}
                                                </Typography>
                                            </Grid>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                            />

                                            <Grid item xs={2}>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    sx={{ textAlign: 'center' }}
                                                >
                                                    {'x'} {i.quantity}
                                                </Typography>
                                            </Grid>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                            />

                                            <Grid item xs={2}>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    sx={{ textAlign: 'center' }}
                                                >
                                                    {i.menuPrice * i.quantity}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    ))
                                ) : (
                                    <></>
                                )}

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mt: 1,
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mx: 2,
                                        }}
                                    >
                                        ราคารวม
                                    </Typography>
                                    <Typography variant="body1">
                                        {'฿'} {calTotal(item.items)}
                                    </Typography>
                                </Box>
                            </CardContent>

                            {/* <Box sx={{ display: 'flex' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography
                                            component="div"
                                            variant="h6"
                                        >
                                            {item.qrcodeName}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Box> */}
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}
