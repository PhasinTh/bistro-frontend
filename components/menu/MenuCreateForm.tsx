import {
    AppBar,
    Box,
    Button,
    Card,
    CardActionArea,
    Container,
    Dialog,
    IconButton,
    Slide,
    Stack,
    TextField,
    Toolbar,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import CloseIcon from '@mui/icons-material/Close'
import { IMenuItem } from './MenuList'
import { useSnackbar, VariantType } from 'notistack'
import { openWidget } from '../../src/uploadWidget'
import axios from '@/src/axios'
import { useCookies } from 'react-cookie'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

type MenuCreateFormProps = {
    item?: IMenuItem | null
    open: boolean
    onClose: (value: boolean) => void
}

export default function MenuCreateForm({
    item,
    open,
    onClose,
}: MenuCreateFormProps) {
    const [imageUrl, setImageUrl] = useState(item?.image || '')
    const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: item?.price || '',
            bistroId: '',
            image: imageUrl,
        },
    })
    const [cookies, setCookie] = useCookies(['bistroInfo'])
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (item) {
            setValue('name', item.name)
            setValue('description', item.description || '')
            setValue('price', item.price)
            setValue('image', item.image || '')
            setValue('bistroId', item.bistroId)
            setImageUrl(item.image || '')
        } else {
            reset({})
        }
    }, [item, reset, setValue])

    const onSubmit = async (data: any) => {
        let response = null
        if (item?.id) {
            response = await axios.put(`/menu-service/${item?.id}`, {
                id: item.id,
                name: data.name,
                price: data.price,
                description: data.description,
                image: data.image,
                bistroId: item?.bistroId,
            })
        } else {
            console.log(cookies.bistroInfo)
            const bistro = cookies.bistroInfo
            response = await axios.post('/menu-service', {
                name: data.name,
                description: data.description,
                image: data.image,
                price: data.price,
                bistroId: bistro.id,
            })
        }

        if (response.data) {
            console.log(response.data)
            enqueueSnackbar('บันทึกข้อมูลเรียบร้อยแล้ว', { variant: 'success' })

            handleClose()
            return
        }
        enqueueSnackbar('โปรดตรวจสอบข้อมูล', { variant: 'error' })
    }

    const handleClose = () => {
        onClose(false)
    }

    const widgetHandler = (error: any, result: any, widget: any) => {
        if (error) {
            enqueueSnackbar('กรุณาตรวจสอบข้อมูล', { variant: 'error' })
            return
        } else if (
            result.event === 'success' &&
            result.info.resource_type === 'image'
        ) {
            setImageUrl(result.info.url)
            setValue('image', result.info.url)
            widget.close()
        }
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
                    <Card onClick={() => openWidget(widgetHandler)}>
                        <CardActionArea>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: {
                                        xs: 200,
                                        md: 400,
                                    },
                                }}
                            >
                                <Image
                                    src={imageUrl || '/image_not_found.png'}
                                    fill
                                    alt={''}
                                />
                                <CloudUploadIcon
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 16,
                                    }}
                                    color={'inherit'}
                                    fontSize="medium"
                                />
                            </Box>
                        </CardActionArea>
                    </Card>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2} sx={{ mt: 5 }}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'กรุณาระบุชื่อเมนู' }}
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => (
                                    <TextField
                                        {...field}
                                        placeholder={'กรุณาระบุชื่อเมนู'}
                                        label={'ชื่อเมนู'}
                                        helperText={error?.message}
                                        error={invalid}
                                    />
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => (
                                    <TextField
                                        {...field}
                                        placeholder={'ระบุคำอธิบาย'}
                                        label={'คำอธิบาย'}
                                        multiline
                                        rows={4}
                                        helperText={error?.message}
                                        error={invalid}
                                    />
                                )}
                            />
                            <Controller
                                name="price"
                                control={control}
                                rules={{ required: 'กรุณาระบุราคา', min: 0 }}
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => (
                                    <TextField
                                        {...field}
                                        placeholder={'กรุณาระบุราคา'}
                                        label={'ราคา'}
                                        helperText={error?.message}
                                        error={invalid}
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*',
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="image"
                                control={control}
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => <input hidden {...field} />}
                            ></Controller>
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
