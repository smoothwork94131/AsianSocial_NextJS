import { FC, useState, useEffect } from 'react';
import { Modal, Button, Group, Box, Grid, Image, Flex, Text, Rating, Loader, Textarea } from '@mantine/core';
import { Carousel, Embla, useAnimationOffsetEffect } from '@mantine/carousel';
import Link from 'next/link';

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import GoogleMapReact from 'google-map-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faFlag } from '@fortawesome/free-solid-svg-icons'

import { ItemType } from '@/types/elements';

import AuthModal from '@/components/Layouts/AuthModal';
import { IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import { GOOGLE_MAP_API_KEY } from '@/utils/app/consts';

interface Props {
    images: any,
    isMobile: boolean,
    data: ItemType,
    isLoad: boolean,
    open: () => void,
    saveItemModal: () => void,
    isSaved: boolean,
}

const Service: FC<Props> = ({
    images,
    isMobile,
    data,
    isLoad,
    open,
    saveItemModal,
    isSaved,
}) => {    
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
    const [authType, setAuthType] = useState<string>('login');

    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;


    const TRANSITION_DURATION = 200;
    const [embla, setEmbla] = useState<Embla | null>(null);
    useAnimationOffsetEffect(embla, TRANSITION_DURATION);

    const getVideoId = (url: string) => {
        const split = url.split("/");
        const video_id = split[split.length - 1];
        return video_id;
    }

    return (
        <>
            <Box
                sx={(theme) => ({
                    padding: isMobile ? '30px 10px' : '20px',
                    backgroundImage: "linear-gradient(transparent 75%, rgb(255, 255, 255) 100%), radial-gradient(at 0% 0%, rgba(39, 36, 31, 0.25) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(79, 72, 69, 0.23) 0px, transparent 50%), radial-gradient(at 40% 40%, rgba(128, 123, 121, 0.21) 0px, transparent 50%), radial-gradient(at 40% 68%, rgba(138, 94, 55, 0.2) 0px, transparent 50%), radial-gradient(at 0% 75%, rgba(217, 222, 226, 0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(255, 255, 255) 0px, transparent 50%), radial-gradient(at 80% 50%, rgb(255, 255, 255) 0px, transparent 50%), radial-gradient(at 80% 50%, rgb(255, 255, 255) 0px, transparent 50%); background-position: center center; background-size: cover; background-repeat: no-repeat"
                })}
            >
                <Box>
                    <Grid
                        gutter={20}
                        pt={20}
                        sx={(theme) => ({
                            borderBottom: `1px solid #cfcfcf`
                        })}
                    >
                        <Grid.Col lg={8} md={8} sm={12} >
                        {
                            data.image == null || data?.asian_images?.length == 0 ?
                            <Flex
                                justify={'center'}
                            >
                                <Box
                                    // w={isMobile?'100%':600}
                                    h={400}
                                    sx={(theme) => ({
                                        backgroundImage: 'linear-gradient(180deg, gray, white)',
                                        cursor: 'pointer',
                                        borderRadius: '10px'
                                    })}
                                ></Box>
                            </Flex>
                            :
                            <Flex 
                                justify={'center'}
                            >
                                <Carousel
                                    // slideSize='100%'
                                    withIndicators
                                    maw={isMobile?'100%':600}
                                    getEmblaApi={setEmbla} 
                                >
                                    {
                                        data?.asian_images?.map((image: any, key: number) =>
                                        <Carousel.Slide key={key}>
                                        {
                                            image.id == "" ?
                                            <Box
                                                w={isMobile?'100%':600}
                                                h={400}
                                                sx={(theme) => ({
                                                    backgroundImage: 'linear-gradient(180deg, gray, white)',
                                                    cursor: 'pointer',
                                                    borderRadius: '10px',
                                                    border: '1px solid gray'
                                                })}
                                            ></Box> 
                                            :
                                            <Image 
                                                src={image.url}
                                                width={isMobile?'100%':600}
                                                height={400}
                                                fit='contain'
                                                radius={5} 
                                            />
                                        }
                                        </Carousel.Slide>)
                                    }
                                </Carousel>
                            </Flex>
                        }
                        </Grid.Col>
                        <Grid.Col lg={4} md={4} sm={12}>
                            <Flex
                                gap='lg'
                                direction={'column'}
                            >
                                <Flex
                                    align='center'
                                    justify='space-between'
                                >
                                    <Button onClick={() => { saveItemModal() }}>
                                    {
                                        isSaved ? 'Edit' : 'Save'
                                    }
                                    </Button>
                                    <Flex
                                        gap='lg'
                                    >
                                        {/* <FontAwesomeIcon icon={faReply} color='gray' style={{ fontSize: '15px' }} />
                                        <FontAwesomeIcon icon={faFlag} color='gray' style={{ fontSize: '15px' }} /> */}
                                    </Flex>
                                </Flex>
                                <Text 
                                    size='20px' 
                                    weight={500}
                                    color='black'
                                    sx={(theme) => ({
                                        letterSpacing: '-.46px'
                                    })}
                                >
                                    {data.name}
                                </Text>
                                <Box>
                                    <Link href={`/${data?.asian_elements?.name}/${data?.asian_cities?.name}/${data?.asian_categories?.name}`} onClick={() => { open() }}>
                                        <Button
                                            radius={10}
                                            sx={(theme) => ({
                                                background: theme.colors.gray[3],
                                                color: "black",
                                                fontWeight: 600,
                                                '&:hover': { background: theme.colors.gray[3] }
                                            })}
                                        >
                                            {
                                                data?.asian_cities?.name
                                            }
                                        </Button>
                                    </Link>
                                </Box>
                                <Box>
                                    <Text size='1rem' weight={400} sx={(theme) => ({
                                        color: "black",
                                        textDecoration: 'underline'
                                    })}>
                                        <a href={data.sites_url} target='_blank' style={{ color: 'black' }}> {data.sites_url} </a>
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
                                    <Group mt={10}>
                                        <Text 
                                            size='1rem' 
                                            weight={400} 
                                            sx={(theme) => ({
                                                color: "black"
                                            })}
                                        >
                                            
                                            <a style={{ color: 'black' }} href={data.facebook} target='_blank'><IconBrandFacebook/></a>
                                        </Text>
                                        <Text 
                                            size='1rem' 
                                            weight={400} 
                                            sx={(theme) => ({
                                                color: "black"
                                            })}
                                        >
                                            <a style={{ color: 'black' }} href={data.instagram} target='_blank'><IconBrandInstagram /></a>
                                        </Text>
                                    </Group>
                                </Box>
                                {
                                    (data?.asian_elements?.name == "Businesses" || data?.asian_elements?.name == "Restaurants") &&
                                    <Box>
                                        <Text size='1.1rem'>
                                            Map
                                        </Text>
                                        <Box
                                            sx={(theme) => ({ height: '300px', width: '100%' })}
                                        >
                                            {
                                                
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY || '' }}
                                                    defaultCenter={{
                                                        lat: Number(data.map_url.match(regex)?.[1]),
                                                        lng: Number(data.map_url.match(regex)?.[2]),
                                                    }}
                                                    defaultZoom={11}
                                                    yesIWantToUseGoogleMapApiInternals
                                                >
                                                </GoogleMapReact>   
                                            }
                                            
                                            {/* <iframe 
                                                width='100%'
                                                src={data.map_url + "&output=embed"}
                                                style={{ border: 0 }} 
                                                height="300"
                                                loading='lazy'
                                            >
                                            </iframe> */}
                                        </Box>
                                    </Box>
                                }
                                <Box>
                                    <Text size='1rem' weight={500} sx={(theme) => ({
                                        color: "black"
                                    })}>
                                        Details:
                                    </Text>
                                    <Text size='1rem' weight={400} sx={(theme) => ({
                                        color: "black"
                                    })}>
                                        {
                                            data.details ?
                                                <div dangerouslySetInnerHTML={{
                                                    __html: data.details.replaceAll("\n", "<br>")
                                                }}></div> : <>No Detail</>
                                        }
                                    </Text>

                                </Box>
                                <Box>
                                    <Text size='1rem' weight={500} sx={(theme) => ({
                                        color: "black"
                                    })}>
                                        Hours:
                                    </Text>
                                    <Text size='1rem' weight={400} sx={(theme) => ({
                                        color: "black"
                                    })}>
                                        {
                                            data.hours ?
                                                <div dangerouslySetInnerHTML={{
                                                    __html: data.hours.replaceAll("\n", "<br>")
                                                }}></div> : <>No Hours</>
                                        }
                                    </Text>
                                </Box>
                            </Flex>

                        </Grid.Col>
                    </Grid>
                </Box>
                <Box
                    mt={40}
                >
                {
                    isLoad ? 
                    <Box sx={(theme) => ({ textAlign: 'center' })}>
                        <Loader size={'lg'}/>
                    </Box>
                    :
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 350: 1, 750: 2, 1000: 3, 1400: 4, 1600: 5 }}
                    >
                        <Masonry 
                            style={{ background: 'transparent' }}
                            gutter='20px'
                        >
                        {
                            images.videos.map((video: any, key: number) =>
                                video ?
                                <Flex w={'100%'} justify={'center'} key={key}>
                                    <iframe
                                        key={key} src={"https://www.tiktok.com/embed/v2/" + getVideoId(video.page_url)}
                                        style={{ overflow: "hidden", height: "500px", width: "300px", background: 'transparent', border: "none" }}
                                        scrolling="no"
                                    />
                                    {/* <a style={{marginTop: '10px', color: 'black', textDecorationLine:'underline'}} target='_blank' href={video.page_url}>Go to Tiktok</a> */}
                                </Flex> 
                                : 
                                <></>
                            )
                        }
                        </Masonry>
                    </ResponsiveMasonry>
                }
                </Box>
            </Box>
            <AuthModal type='login' open={() => { setOpenAuthModal(false) }} opened={openAuthModal} setType={(type) => { setAuthType(type) }} />
        </>
    )
}

export default Service;

