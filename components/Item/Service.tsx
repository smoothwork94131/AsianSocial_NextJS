import { Modal, Button, Group, Box, Grid, Image, Flex, Text,Rating } from '@mantine/core';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FC } from 'react';
import { Category, Item } from '@/types/elements';
import GoogleMapReact from 'google-map-react';
interface Props {
    images: string[],
    isMobile: boolean,
    data: Item,
    category: Category,
    isLoad: boolean
}

const Service:FC<Props> = ({
    images,
    isMobile,
    data,
    category,
    isLoad
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
                        <Grid.Col lg={8} sm={12} md={8}>
                            <Image src={images[0]} alt='' height={500}/>
                        </Grid.Col>
                        <Grid.Col lg={4} sm={12} md={4}>
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{ 350: 1, 500: 1, 750: 1, 900: 1 }}
                            >
                                <Masonry>
                                    <Image src={images[1]} alt='' height={300} fit='fill' />
                                    <Image src={images[2]} alt='' height={300} mt={10} fit='fill' />
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
                        <Flex>
                            <Text size='1rem' color='gray'>4.9</Text>
                            
                            <Rating value={4.5} fractions={2} readOnly />
                            <Text size='1rem' color='gray'>(78)</Text>

                        </Flex>
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
                                {/* <GoogleMapReact
                                    bootstrapURLKeys={{ key: "AIzaSyB6hZIv8mG7cOvX-AGUbB-vLeR5qZ1-QXI" }}
                                    defaultCenter={{lat: 44.900209366013954,
                                        lng: -102.56077483176705}}
                                    defaultZoom={11}
                                    yesIWantToUseGoogleMapApiInternals
                                >

                                </GoogleMapReact> */}
                                <iframe
                                    width="100%"
                                    height="300"
                                    loading="lazy"
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB6hZIv8mG7cOvX-AGUbB-vLeR5qZ1-QXI
                                        &q=Space+Needle,Seattle+WA">
                                </iframe>

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

export default Service;

