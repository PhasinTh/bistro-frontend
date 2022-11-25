import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function index() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: session } = useSession()

    return (
        <>
            <AppBar position="relative">
                <Toolbar></Toolbar>
            </AppBar>
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            ยินดีต้อนรับเข้าสู่ Bistro4.0
                        </Typography>
                        <Typography
                            variant="h5"
                            align="center"
                            color="text.secondary"
                            paragraph
                        >
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Vero quasi quaerat placeat natus, at
                            voluptatem explicabo eaque dolorem sunt temporibus,
                            alias architecto animi nihil sit nobis
                            necessitatibus, recusandae reprehenderit culpa.
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            {session ? (
                                <Link href="/bistro">
                                    <Button variant="contained" sx={{ px: 5 }}>
                                        เข้าหน้าหลัก
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href='/auth/signup'>
                                        <Button variant="outlined">
                                            สมัครสมาชิก
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="contained"
                                        sx={{ px: 5 }}
                                        onClick={() => signIn()}
                                    >
                                        เข้าสู่ระบบ
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Container>
                </Box>
            </main>
        </>
    )
}
