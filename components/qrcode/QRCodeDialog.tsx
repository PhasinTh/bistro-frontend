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
import { IQRCode } from 'pages/bistro/qrcode'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { v4 as uuidv4 } from 'uuid'

type OrderDialogProps = {
    open: boolean
    onClose?: () => void
    onEdit?: () => void
    item?: IQRCode | null
}

export default function QRCodeDialog({
    open,
    item,
    onClose,
    onEdit,
}: OrderDialogProps) {
    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current || null,
    })

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <Box ref={componentRef}>
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Typography>{item?.name}</Typography>
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
                <DialogContent
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                    }}
                >
                    <QRCodeSVG
                        value={
                            process.env.NEXTBACKED_URL ||
                            'http://178.128.26.253' +
                                '/makeorder?bistroId=' +
                                item?.bistroId +
                                '&qrcodeId=' +
                                uuidv4() +
                                '&qrcodeName=' +
                                item?.name
                        }
                        size={200}
                    />
                </DialogContent>
            </Box>
            <DialogActions>
                <Button
                    onClick={() => {
                        if (onEdit) {
                            onEdit()
                        }
                    }}
                >
                    แก้ไข
                </Button>
                <Button variant="contained" color="info" onClick={handlePrint}>
                    พิมพ์ QRCode
                </Button>
            </DialogActions>
        </Dialog>
    )
}
