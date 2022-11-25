import {
    AppBar,
    Box,
    Button,
    Container,
    Dialog,
    IconButton,
    Slide,
    Stack,
    TextField,
    Toolbar,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import CloseIcon from '@mui/icons-material/Close'
import { useSnackbar, VariantType } from 'notistack'
import axios from '@/src/axios'
import { useCookies } from 'react-cookie'
import { IQRCode } from 'pages/bistro/qrcode'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

type QRCodeAddDialogProps = {
    item?: IQRCode | null
    open: boolean
    onClose: (value: boolean) => void
    onDatUpdated?: () => void
}

export default function QRCodeAddDialog({
    item,
    open,
    onClose,
    onDatUpdated,
}: QRCodeAddDialogProps) {
    const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            name: '',
        },
    })
    const [cookies, setCookie] = useCookies(['bistroInfo'])
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (item) {
            setValue('name', item.name)
        } else {
            reset({})
        }
    }, [item, reset, setValue])

    const onSubmit = async (data: any) => {
        let response = null
        if (item?.id) {
            response = await axios.put(`/qrcode-service/${item?.id}`, {
                id: item.id,
                name: data.name,
                bistroId: item?.bistroId,
            })
        } else {
            const bistro = cookies.bistroInfo
            response = await axios.post('/qrcode-service', {
                name: data.name,
                bistroId: bistro.id,
            })
        }

        // console.log(response)

        if (response.data) {
            // console.log(response.data)
            enqueueSnackbar('บันทึกข้อมูลเรียบร้อยแล้ว', { variant: 'success' })
            if (onDatUpdated) {
                onDatUpdated()
            }
            return
        }
        enqueueSnackbar('โปรดตรวจสอบข้อมูล', { variant: 'error' })
    }

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
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2} sx={{ mt: 5 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'กรุณาระบุชื่อ' }}
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => (
                                    <TextField
                                        {...field}
                                        placeholder={'กรุณาระบุชื่อ'}
                                        label={'ชื่อ'}
                                        helperText={error?.message}
                                        error={invalid}
                                    />
                                )}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                color="success"
                            >
                                บันทึก
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Dialog>
        </>
    )
}
