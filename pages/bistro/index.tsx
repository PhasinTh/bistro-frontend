import axios from '@/src/axios'
import Typography from '@mui/material/Typography'
import { CtxOrReq } from 'next-auth/client/_utils'
import { getSession } from 'next-auth/react'
import AppLayout from '@/components/layouts/AppLayout'
import { IBistro } from './setting'

type HomeProps = {
    data: IBistro
}

export default function Home({ data }: HomeProps) {
    return (
        <>
            <Typography variant="h5" component="h5" gutterBottom>
                Welcome to Bistro Management
            </Typography>
        </>
    )
}

Home.Layout = AppLayout

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

    if (response.data) {
        return {
            props: {
                data: response.data,
            },
        }
    } else {
        return {
            redirect: {
                permanent: false,
                destination: '/bistro/settings',
            },
        }
    }
}
