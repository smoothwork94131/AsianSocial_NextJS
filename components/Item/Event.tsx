import { Modal, Button, Group, Box, Grid, Image, Flex, Text, Rating, Loader } from '@mantine/core';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FC } from 'react';
import { Category, Item } from '@/types/elements';
import GoogleMapReact from 'google-map-react';
import Categories from '../Element/Categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faFlag } from '@fortawesome/free-solid-svg-icons'

interface Props {
    images: string[],
    isMobile: boolean,
    data: Item,
    categories: Category[],
    isLoad: boolean,
    selectCategory: (category: Category) => void,
    element_name: string
}

const Service: FC<Props> = ({
    images,
    isMobile,
    data,
    categories,
    isLoad,
    selectCategory,
    element_name
}) => {

    return (
        <Box
            sx={(theme) => ({
                padding: isMobile ? 0 : 20
            })}
        >
            <Grid gutter={0}>
                <Grid.Col lg={8} sm={12} md={8}>
                    <Box sx={(theme) => ({
                        margin: 'auto',
                        width: isMobile ? '100%' : 'fit-content',
                        paddingTop: isMobile ? '0px' : '100px',
                        borderBottom: `${isMobile ? `1px solid ${theme.colors.gray[2]}` : "none"}`
                    })}>
                        <Image alt='' src={data.image} style={{ width: isMobile ? '100%' : 'auto' }} />
                    </Box>
                </Grid.Col>

                <Grid.Col lg={4} sm={12} md={4} p={20}>
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
                            <Flex
                                gap='lg'
                            >
                                <FontAwesomeIcon icon={faReply} color='gray' style={{ fontSize: '15px' }} />
                                <FontAwesomeIcon icon={faFlag} color='gray' style={{ fontSize: '15px' }} />

                            </Flex>
                        </Flex>
                        <Text size='20px' weight={500} sx={(theme) => ({
                            color: "black",
                            letterSpacing: '-.46px'
                        })}>
                            {data.name}
                        </Text>

                        <Categories categories={categories}
                            selectedCategory={
                                categories.filter(category => category.id == data.category_id)[0]
                            }
                            selectCategory={selectCategory}
                        />
                        <Box>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black",
                                textDecoration: 'underline'
                            })}>
                                {data.sites_url}
                            </Text>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                {data.address}
                            </Text>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                {data.phone_number}
                            </Text>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                {data.email}
                            </Text>
                        </Box>

                        {
                            (element_name == "Businesses" || element_name == "Restaurants") &&
                            <Box
                            >
                                <Text size='1.1rem' weight={500}>
                                    Map
                                </Text>
                                <Box
                                    sx={(theme) => ({ height: '300px', width: '100%' })}
                                >
                                    <GoogleMapReact
                                        bootstrapURLKeys={{ key: "AIzaSyB6hZIv8mG7cOvX-AGUbB-vLeR5qZ1-QXI" }}
                                        defaultCenter={{
                                            lat: 44.900209366013954,
                                            lng: -102.56077483176705
                                        }}
                                        defaultZoom={11}
                                        yesIWantToUseGoogleMapApiInternals
                                    >

                                    </GoogleMapReact>


                                </Box>
                            </Box>
                        }

                        <Box>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                Details:
                            </Text>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                {data.details}
                            </Text>
                        </Box>
                    </Flex>

                </Grid.Col>
            </Grid>
            <Box p={20}
            >
                {
                    isLoad ? <Box><Loader variant='dots' alignmentBaseline='central' /></Box> :
                        <ResponsiveMasonry
                            columnsCountBreakPoints={{ 350: 3, 500: 3, 750: 3, 900: 4 }}
                        >
                            <Masonry gutter='10px'>
                                {
                                    images.map((image, key) =>
                                        <Box key={key}><Image src={image} alt='' radius={5} /></Box>
                                    )
                                }
                            </Masonry>
                        </ResponsiveMasonry>
                }

            </Box>

        </Box>
    )
}

export default Service;

