import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import { CtxOrReq } from 'next-auth/client/_utils'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import axios from '@/src/axios'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { signIn } from 'next-auth/react'

export default function SignUp() {
    const { enqueueSnackbar } = useSnackbar()

    const { control, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            name: '',
            password: '',
        },
    })

    const onSubmit = async (data: any) => {
        const response = await axios.post(`/auth-service/register`, {
            email: data.email,
            name: data.name,
            password: data.password,
        })
        if (response.status == 201) {
            enqueueSnackbar('สม้ครสมาชิกสำเร็จ', { variant: 'success' })
            signIn()
        }
    }

    return (
        <>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/papaya.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light'
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LocalDiningIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Bistro4.0: Online Menu
                        </Typography>
                        <Box
                            sx={{ mt: 1 }}
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'กรุณาใส่อีเมล์' }}
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => (
                                    <TextField
                                        {...field}
                                        type="email"
                                        placeholder={'email@email'}
                                        label={'Email'}
                                        helperText={error?.message}
                                        error={invalid}
                                        fullWidth
                                        sx={{
                                            my: 1,
                                        }}
                                    />
                                )}
                            />
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
                                        fullWidth
                                        sx={{
                                            my: 1,
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'กรุณาใส่รหัสผ่าน' }}
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => (
                                    <TextField
                                        {...field}
                                        placeholder={'password'}
                                        label={'รหัสผ่าน'}
                                        helperText={error?.message}
                                        error={invalid}
                                        type="password"
                                        fullWidth
                                        sx={{
                                            my: 1,
                                        }}
                                    />
                                )}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Link href="/auth/signin" variant="body2">
                                    {'have an account? Sign In'}
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export async function getServerSideProps(context: CtxOrReq) {
    return {
        props: {},
    }
}
