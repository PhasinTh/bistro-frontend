import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { IOrder } from '../../pages/bistro/orders'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import axios from '@/src/axios'
import { useSnackbar } from 'notistack'
import moment from 'moment'

type OrderDialogProps = {
    open: boolean
    onClose?: () => void
    item?: IOrder
}

export default function OrderSuccessDialog({
    open,
    onClose,
    item,
}: OrderDialogProps) {
    const componentRef = useRef()
    const { enqueueSnackbar } = useSnackbar()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current || null,
    })

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <Box ref={componentRef}>
                <DialogTitle>
                    รายการสั่งอาหาร
                    {onClose ? (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="body1">ชื่อ</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                {item?.qrcodeName}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant="body1">วันเวลา</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                {moment(item?.createAt).format(
                                    'DD/MM/yyyy HH:mm'
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 1 }} />
                    <Grid container>
                        <Grid item xs={8} sx={{ textAlign: 'center' }}>
                            เมนู
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            ราคา
                        </Grid>
                    </Grid>
                    <Divider />
                    {item?.items.map((item) => (
                        <Grid container key={item.id}>
                            <Grid item xs={8}>
                                {item?.menuName} {' x ' + item?.quantity}
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'end' }}>
                                {item?.menuPrice} {'฿'}
                            </Grid>
                        </Grid>
                    ))}
                    <Divider />
                    <Grid container>
                        <Grid item xs={8} sx={{ textAlign: 'end' }}>
                            รวม
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'end' }}>
                            {item?.items
                                ?.map((item) => item.menuPrice * item.quantity)
                                .reduce((a, b) => a + b)}{' '}
                            {'฿'}
                        </Grid>
                    </Grid>
                </DialogContent>
            </Box>
            <DialogActions>
                <Button variant="contained" color="info" onClick={handlePrint}>
                    ปริ้นใบเสร็จ
                </Button>
            </DialogActions>
        </Dialog>
    )
}
