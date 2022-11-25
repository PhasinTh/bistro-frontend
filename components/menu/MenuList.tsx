import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from '@mui/material'

export interface IMenuItem {
    id: string
    name: string
    image?: string
    description?: string
    price: number
    bistroId: string
}

type MenuListProps = {
    items?: IMenuItem[]
    onItemSelected: (item: IMenuItem) => void
}

export default function MenuList({ items, onItemSelected }: MenuListProps) {
    return (
        <>
            <Grid container spacing={2}>
                {items ? (
                    items.map((item: IMenuItem) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <Card>
                                <CardActionArea
                                    onClick={() => onItemSelected(item)}
                                >
                                    <Box sx={{ display: 'flex' }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 150, p: 1 }}
                                            image={
                                                item?.image ||
                                                '/image_not_found.png'
                                            }
                                            alt=""
                                        />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <CardContent
                                                sx={{ flex: '1 0 auto' }}
                                            >
                                                <Typography
                                                    component="div"
                                                    variant="h6"
                                                >
                                                    {item?.name}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    component="div"
                                                >
                                                    {item?.description}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="text.primary"
                                                    component="div"
                                                >
                                                    {item?.price}
                                                </Typography>
                                            </CardContent>
                                        </Box>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <></>
                )}
            </Grid>
        </>
    )
}
