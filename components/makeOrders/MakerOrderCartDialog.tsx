import 'primeicons/primeicons.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'

import {
    AppBar,
    Box,
    Button,
    Card,
    CardActionArea,
    Container,
    Dialog,
    Divider,
    Fab,
    Grid,
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

// Datable
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import DeleteIcon from '@mui/icons-material/Delete'
import { IOrder } from 'pages/bistro/orders'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

type MakeOrderDialogProps = {
    items: IOrderItem[]
    open: boolean
    onClose: (value: boolean) => void
    onAddToCart?: (item: IOrderItem) => void
    onSubmitData?: (items: IOrderItem[]) => void
}

export default function MakerOrderCartDialog({
    items,
    open,
    onClose,
    onAddToCart,
    onSubmitData,
}: MakeOrderDialogProps) {
    const [orderItems, setOrderItems] = useState<IOrderItem[]>([])

    useEffect(() => {
        setOrderItems(items)
    }, [items])

    const handleClose = () => {
        onClose(false)
    }

    const onRowEditComplete = (e: any) => {
        let _orderItems = [...orderItems]
        let { newData, index } = e
        _orderItems[index] = newData
        setOrderItems(_orderItems)
    }

    const textEditor = (options: any) => {
        return (
            <TextField
                type="text"
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
            />
        )
    }

    const calTemplate = (rowData: any) => {
        return rowData.quantity * rowData.menuPrice
    }

    // const [selectItem, setSelectIem] = useState<IOrderItem | null>(null)

    const deleteItem = (selectItem: any) => {
        let _orderItems = orderItems?.filter(
            (i) => i.menuId !== selectItem?.menuId
        )
        setOrderItems(_orderItems)
    }

    const onSubmit = () => {
        if (onSubmitData) {
            onSubmitData(orderItems)
        }
    }

    const confirmDeleteItem = (item: any) => {
        const confirmed = confirm('ต้องการลบข้อมูล?')
        if (confirmed) {
            deleteItem(item)
        }
    }

    const actionBodyTemplate = (rowData: any) => {
        return <DeleteIcon onClick={() => confirmDeleteItem(rowData)} />
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
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 1,
                        }}
                    >
                        รายการอาหาร
                    </Typography>
                    <DataTable
                        value={orderItems || []}
                        editMode="row"
                        dataKey="id"
                        onRowEditComplete={onRowEditComplete}
                        responsiveLayout="scroll"
                    >
                        <Column
                            field="quantity"
                            header="จำนวน"
                            editor={(options) => textEditor(options)}
                            style={{ width: '10%' }}
                        ></Column>
                        <Column
                            field="menuName"
                            header="ชื่อเมนู"
                            style={{ width: '50%' }}
                        ></Column>
                        <Column
                            body={calTemplate}
                            header=""
                            style={{ width: '10%' }}
                        ></Column>
                        <Column
                            body={actionBodyTemplate}
                            exportable={false}
                        ></Column>
                        <Column rowEditor></Column>
                    </DataTable>
                    <Grid container sx={{ mt: 1, px: 5 }}>
                        <Grid item xs={8}>
                            รวม
                        </Grid>
                        <Grid
                            item
                            xs={4}
                            sx={{
                                textAlign: 'end',
                            }}
                        >
                            <Typography variant="body1" color="green">
                                {' ฿ '}
                                {orderItems && orderItems.length > 0 ? (
                                    Array.isArray(orderItems) ? (
                                        orderItems
                                            .map(
                                                (item: any) =>
                                                    item?.menuPrice *
                                                    item?.quantity
                                            )
                                            .reduce((a, b) => a + b)
                                    ) : null
                                ) : (
                                    <></>
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
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
                    <Button
                        onClick={onSubmit}
                        color="success"
                        variant="contained"
                        sx={{
                            width: '80%',
                            mx: 'auto',
                        }}
                    >
                        ยืนยันออเดอร์
                    </Button>
                </Box>
            </Dialog>
        </>
    )
}
