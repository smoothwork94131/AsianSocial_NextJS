import { Modal, Button, Group, Box, Grid, Image, Flex, Text } from '@mantine/core';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FC } from 'react';
import { Category, Item } from '@/types/elements';
import GoogleMapReact from 'google-map-react';
interface Props {
    images: string[],
    isMobile: boolean,
    data: Item,
    category: Category,
    isLoader: boolean
}
const Events:FC<Props> = ({
    images,
    isMobile,
    data,
    category,
    isLoader
}) => {
    return (
        <Box
            mt={100}
            sx={(theme) => ({
                width: isMobile ? '100%' : '80%',
                margin: 'auto'
            })}>
            
            <Grid gutter={80} >
                <Grid.Col lg={8} sm={12} md={8}>
                    <Grid gutter='md'>
                        <Grid.Col lg={6} sm={12} md={6}>
                            <Image src={images[0]} alt='' />
                        </Grid.Col>
                        <Grid.Col lg={6} sm={12} md={6}>
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{ 350: 1, 500: 1, 750: 1, 900: 1 }}
                            >
                                <Masonry>
                                    <Image src={images[1]} alt='' />
                                    <Image src={images[2]} alt='' />

                                </Masonry>
                            </ResponsiveMasonry>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col lg={4} sm={12} md={4}>
                    <Flex
                        gap='lg'
                        direction={'column'}
                    >
                        <Flex
                            align='center'
                            justify='space-between'
                        >
                            <Button>
                                Save
                            </Button>
                        </Flex>
                        <Text size='1.2rem' weight='bold'>
                            {data.name}
                        </Text>
                        <Text pt={15} pb={15} align='center' weight='bold' size={'1.4rem'}>
                            {
                                category.name
                            }
                        </Text>
                        <Box>
                            <Text size='1rem' weight='bold'>
                                {data.sites_url}
                            </Text>
                            <Text size='1rem' weight='bold'>
                                {data.address}
                            </Text>
                            <Text size='1rem' weight='bold'>
                                {data.phone_number}
                            </Text>
                            <Text size='1rem' weight='bold'>
                                {data.email}
                            </Text>
                        </Box>
                        <Box
                        >
                            <Text size='1.1rem' weight='bold'>
                                Map
                            </Text>
                            <Box
                                sx={(theme) =>({height: '300px',  width: '100%'})}
                            >
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: "AIzaSyB6hZIv8mG7cOvX-AGUbB-vLeR5qZ1-QXI" }}
                                    defaultCenter={{lat: 44.900209366013954,
                                        lng: -102.56077483176705}}
                                    defaultZoom={11}
                                    yesIWantToUseGoogleMapApiInternals
                                >

                                </GoogleMapReact>
                            </Box>
                        </Box>
                        <Box>
                            <Text size='1rem' weight='bold'>
                                Details: 
                            </Text>
                            <Text size='1rem' weight='bold'>
                                {data.details}
                            </Text>
                        </Box>
                    </Flex>
                    
                </Grid.Col>
            </Grid>
        </Box>
    )
}

export default Events;

