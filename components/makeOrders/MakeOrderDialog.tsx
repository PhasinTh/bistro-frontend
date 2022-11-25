import {
    AppBar,
    Box,
    Button,
    Card,
    CardActionArea,
    Container,
    Dialog,
    Fab,
    IconButton,
    Slide,
    Stack,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar, VariantType } from 'notistack'
import { openWidget } from '../../src/uploadWidget'
import axios from '@/src/axios'
import { useCookies } from 'react-cookie'
import { IMenuItem } from '../menu/MenuList'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { IOrderItem } from 'pages/makeorder'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

type MakeOrderDialogProps = {
    item?: IMenuItem | null
    open: boolean
    onClose: (value: boolean) => void
    onAddToCart?: (item: IOrderItem) => void
}

export default function MakeOrderDialog({
    item,
    open,
    onClose,
    onAddToCart,
}: MakeOrderDialogProps) {
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        setQuantity(1)
    }, [item])

    const handleClose = () => {
        onClose(false)
    }

    return (
        <>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container
                    sx={{
                        mt: 2,
                    }}
                >
                    <Card>
                        <CardActionArea>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: {
                                        xs: 300,
                                        md: 400,
                                    },
                                }}
                            >
                                <Image
                                    src={item?.image || '/image_not_found.png'}
                                    fill
                                    alt={''}
                                />
                            </Box>
                        </CardActionArea>
                    </Card>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 3,
                        }}
                    >
                        {' '}
                        <Typography variant="h5">{item?.name}</Typography>
                        <Typography variant="body1">
                            {item?.description}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="primary"
                            sx={{ textAlign: 'end' }}
                        >
                            {item?.price} {'บาท'}
                        </Typography>
                    </Box>
                </Container>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        position: 'fixed',
                        bottom: 5,
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 5,
                        }}
                    >
                        <Stack direction="row" spacing={4}>
                            <Fab
                                aria-label="add"
                                size="small"
                                onClick={() =>
                                    setQuantity((prev) =>
                                        prev > 1 ? prev - 1 : 1
                                    )
                                }
                            >
                                <RemoveIcon />
                            </Fab>
                            <Typography variant="h5">{quantity}</Typography>
                            <Fab
                                aria-label="add"
                                size="small"
                                onClick={() => setQuantity((prev) => prev + 1)}
                            >
                                <AddIcon color="success" />
                            </Fab>
                        </Stack>
                    </Box>
                    <Button
                        color="success"
                        variant="contained"
                        sx={{
                            width: '80%',
                            mx: 'auto',
                        }}
                        onClick={() => {
                            if (onAddToCart) {
                                const temp: IOrderItem = {
                                    menuId: item?.id || '',
                                    menuName: item?.name || '',
                                    menuImage: item?.image || '',
                                    menuPrice: item?.price || 0,
                                    quantity: quantity || 1,
                                }
                                onAddToCart(temp)
                            }
                        }}
                    >
                        อัปเดตตะกร้า -{' '}
                        {item?.price ? item?.price * quantity : null}
                    </Button>
                </Box>
            </Dialog>
        </>
    )
}
