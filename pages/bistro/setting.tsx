import {
    Box,
    Button,
    Card,
    CardActionArea,
    Container,
    Slide,
    Stack,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Controller, useForm } from 'react-hook-form'
import React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import { useSnackbar } from 'notistack'
import AppLayout from '@/components/layouts/AppLayout'
import { openWidget } from '@/src/uploadWidget'
import { getSession, useSession } from 'next-auth/react'
import { CtxOrReq } from 'next-auth/client/_utils'
import axios from '@/src/axios'
import { useLocalStorage } from 'usehooks-ts'
import { useCookie } from 'react-use'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

export interface IBistro {
    id: string
    name: string
    image?: string
    description?: string
    ownerId: string
}

type SettingProps = {
    bistro: IBistro
}

export default function Setting({ bistro }: SettingProps) {
    const [imageUrl, setImageUrl] = useState(bistro?.image || '')
    const { data: session, status } = useSession()
    const { enqueueSnackbar } = useSnackbar()
    // const [bistroInfo, setBistroInfo] = useLocalStorage('bistroInfo', {})
    const [bistroInfo, setBistroInfo, deleteCookie] = useCookie('bistroInfo')

    const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            name: '',
            description: '',
            image: imageUrl,
        },
    })

    useEffect(() => {
        if (bistro) {
            setValue('name', bistro.name)
            setValue('description', bistro.description || '')
            setValue('image', bistro.image || '')
            setBistroInfo(JSON.stringify(bistro))
        } else {
            reset({})
        }
    }, [bistro, reset, setBistroInfo, setValue])

    const onSubmit = async (data: any) => {
        let response = null
        if (bistro.id) {
            response = await axios.put(`/bistro-service/${bistro.id}`, {
                id: bistro.id,
                name: data.name,
                description: data.description,
                image: data.image,
                ownerId: session?.user.sub,
            })
        } else {
            response = await axios.post('/bistro-service', {
                name: data.name,
                description: data.description,
                image: data.image,
                ownerId: session?.user.sub,
            })
        }

        if (response.data) {
            // console.log(response.data)
            enqueueSnackbar('บันทึกข้อมูลเรียบร้อยแล้ว', { variant: 'success' })
        }
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
        <Container
            sx={{
                mt: 2,
            }}
        >
            <Card
                onClick={() => {
                    openWidget(widgetHandler)
                }}
            >
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
                        rules={{ required: 'กรุณาระบุชื่อร้าน' }}
                        render={({ field, fieldState: { error, invalid } }) => (
                            <TextField
                                {...field}
                                placeholder={'กรุณาระบุชื่อร้าน'}
                                label={'ชื่อร้าน'}
                                helperText={error?.message}
                                error={invalid}
                            />
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState: { error, invalid } }) => (
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
                        name="image"
                        control={control}
                        render={({ field, fieldState: { error, invalid } }) => (
                            <input hidden {...field} />
                        )}
                    ></Controller>
                    <Button variant="contained" type="submit" color="success">
                        บันทึก
                    </Button>
                </Stack>
            </Box>
        </Container>
    )
}

Setting.Layout = AppLayout

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

    const response = await axios.get(
        '/bistro-service/owner/' + session?.user.sub
    )

    let bistro = {
        id: '',
        name: '',
        image: '',
        description: '',
        ownerId: session?.user.sub,
    }

    if (response.data) {
        const item = response.data
        bistro = {
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            ownerId: item.ownerId,
        }
    }

    // Pass data to the page via props
    return { props: { bistro } }
}
