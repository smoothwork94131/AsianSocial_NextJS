import { Modal, Button, Group, Box, Grid, Image, Flex, Text, Rating, Loader, Textarea } from '@mantine/core';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FC, useState, useRef, useEffect } from 'react';
import { Category, Item, Types } from '@/types/elements';
import GoogleMapReact from 'google-map-react';
import Categories from '../Element/Categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faFlag } from '@fortawesome/free-solid-svg-icons'
import { useUser } from "@supabase/auth-helpers-react";
import { notifications } from '@mantine/notifications';
import AuthModal from '../Layouts/AuthModal';
import { useRouter } from 'next/router';
import TypesComponents from '../Element/Types';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';

interface Props {
    images: any,
    isMobile: boolean,
    data: Item,
    categories: Category[],
    isLoad: boolean,
    selectCategory: (category: Category) => void,
    element_name: string,
    getSaves?: () => void | undefined,
    saved?: string | undefined
    open: () => void,
    saveItemModal: () => void,
    isSaved: boolean,
    types: Types[],
    loadCategories: boolean
}

const Service: FC<Props> = ({
    images,
    isMobile,
    data,
    categories,
    isLoad,
    element_name,
    selectCategory,
    getSaves,
    saved,
    open,
    saveItemModal,
    isSaved,
    types,
    loadCategories
}) => {

    const user = useUser();
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
    const [authType, setAuthType] = useState<string>('login');
    const router = useRouter();
    const autoplay = useRef(Autoplay({ delay: 2000 }));
    const iframeRef: any = useRef(null);
    const [iframeWidth, setIframeWidth] = useState<number>(0);
    const [iframeHeight, setIframeHeight] = useState<number>(0);
    const handleIframe = () => {
        var iframe:any = document.getElementsByClassName("tiktok-iframe");
        try{
            for(let k=0; k<iframe.length; k++){
            //    iframe[k].height = iframe[k].contentWindow.document.body.offsetHeight
            //    console.log(iframe[k].contentWindow.document.body.offsetHeight);
                // console.log(iframe[k].contentWindow)
                
            }
        }catch(e){
            console.log("--------Height-------");
            console.log(e);
        }
    }
    const deleteItem = async () => {
        if (user) {
            const res = await fetch('/api/item/delete_item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user?.id, item_id: data.id }),
            })
            const data_ = await res.json();
            if (res.status == 200) {
                notifications.show({
                    title: 'Delete',
                    message: data_.msg,
                    color: 'default'
                })
                if (getSaves) {
                    getSaves();
                    open();
                }
            } else {
                notifications.show({
                    title: 'Delete',
                    message: data_.msg,
                    color: 'red'
                })
            }
        } else {
            setOpenAuthModal(true);
        }
    }

    const getVideoId = (url: string) => {
        const split = url.split("/");
        const video_id = split[split.length - 1];
        return video_id;
    }


    return (
        <Box
            sx={(theme) => ({
                padding: isMobile ? 0 : 20,
                backgroundImage: "linear-gradient(transparent 75%, rgb(255, 255, 255) 100%), radial-gradient(at 0% 0%, rgba(39, 36, 31, 0.25) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(79, 72, 69, 0.23) 0px, transparent 50%), radial-gradient(at 40% 40%, rgba(128, 123, 121, 0.21) 0px, transparent 50%), radial-gradient(at 40% 68%, rgba(138, 94, 55, 0.2) 0px, transparent 50%), radial-gradient(at 0% 75%, rgba(217, 222, 226, 0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(255, 255, 255) 0px, transparent 50%), radial-gradient(at 80% 50%, rgb(255, 255, 255) 0px, transparent 50%), radial-gradient(at 80% 50%, rgb(255, 255, 255) 0px, transparent 50%); background-position: center center; background-size: cover; background-repeat: no-repeat"
            })}
        >
            <Grid
                gutter={0}
                pb={40}
                sx={(theme) => ({
                    borderBottom: `1px solid #cfcfcf`
                })}
            >
                <Grid.Col lg={8} sm={12} md={8}>
                    <Box sx={(theme) => ({
                        margin: 'auto',
                        width: isMobile ? '100%' : '100%',
                        paddingTop: isMobile ? '0px' : '100px',
                        borderBottom: `${isMobile ? `1px solid ${theme.colors.gray[2]}` : "none"}`
                    })}>
                        {
                            data.image == null ?
                                <Flex
                                    justify={'center'} align={'center'}
                                ><Box
                                    sx={(theme) => ({
                                        width: '300px',
                                        height: Math.floor(Math.random() * (250 - 0 + 1)) + 250,
                                        backgroundImage: 'linear-gradient(180deg, gray, white)',
                                        cursor: 'pointer',
                                        borderRadius: '10px'
                                    })}
                                ></Box>
                                </Flex> :
                                <Flex justify={'center'} align={'center'}>
                                    {/* <Image alt='' src={data.image} style={{ width: isMobile ? '100%' : '50%', height: 'auto' }} radius={5} /> */}
                                    <Carousel
                                        withIndicators
                                        onMouseEnter={autoplay.current.stop}
                                        onMouseLeave={autoplay.current.reset}
                                        sx={(theme) => ({
                                            width: isMobile ? '100%' : '50%'
                                        })}
                                    >
                                        {/* <Carousel.Slide>1</Carousel.Slide>
                                        <Carousel.Slide>2</Carousel.Slide>
                                        <Carousel.Slide>3</Carousel.Slide> */}
                                        {/* ...other slides */}
                                        {
                                            Object.keys(images).includes('videos') ?
                                                images.images.map((image: any, key: number) =>

                                                    <Carousel.Slide key={key}>
                                                        {
                                                            image == "" ?
                                                                <Box
                                                                    sx={(theme) => ({
                                                                        width: '300px',
                                                                        height: Math.floor(Math.random() * (250 - 0 + 1)) + 250,
                                                                        backgroundImage: 'linear-gradient(180deg, gray, white)',
                                                                        cursor: 'pointer',
                                                                        borderRadius: '10px'
                                                                    })}
                                                                ></Box> :
                                                                <Image alt='' src={image} style={{ width: isMobile ? '100%' : '100%', height: 'auto' }} radius={5} key={key} />
                                                        }
                                                    </Carousel.Slide>
                                                )
                                                : <></>
                                        }
                                    </Carousel>
                                </Flex>
                        }
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
                        <Text size='20px' weight={500} sx={(theme) => ({
                            color: "black",
                            letterSpacing: '-.46px'
                        })}>
                            {data.name}
                        </Text>

                        {/* <Flex>
                            <Rating value={Number(data.rating)} fractions={2} readOnly />
                            <Text size='1rem' color='gray'>({Number(data.rating)})</Text>
                        </Flex> */}
                        {/* <Categories categories={categories}
                            selectedCategory={
                                categories.filter(category => category.id == data.category_id)[0]
                            }
                            selectCategory={selectCategory}
                        /> */}

                        {/* {
                            loadCategories ? <Loader variant='dots' /> :
                                <TypesComponents
                                    element_name={element_name}
                                    types={types}
                                    type_name={''}
                                    open={open}
                                />
                        } */}
                        {
                            types.length == 0 ?
                                <></> :
                                <Box>
                                    <Link href={`/${element_name}/${types.filter((item: Types) => item.id == data.type_id)[0].name
                                        }/items`} onClick={() => { open() }}>

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
                                                types.filter((item: Types) => item.id == data.type_id)[0].name
                                            }
                                        </Button>
                                    </Link>
                                </Box>
                        }
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
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                {data.email}
                            </Text>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                <a style={{ color: 'black' }} href={data.facebook}> {data.facebook} </a>
                            </Text>
                            <Text size='1rem' weight={400} sx={(theme) => ({
                                color: "black"
                            })}>
                                <a style={{ color: 'black' }} href={data.instagram}> {data.instagram} </a>
                            </Text>
                        </Box>
                        {
                            (element_name == "Businesses" || element_name == "Restaurants") &&
                            <Box
                            >
                                <Text size='1.1rem'>
                                    Map
                                </Text>
                                <Box
                                    sx={(theme) => ({ height: '300px', width: '100%' })}
                                >
                                    {/* <GoogleMapReact
                                        bootstrapURLKeys={{ key: "AIzaSyB6hZIv8mG7cOvX-AGUbB-vLeR5qZ1-QXI" }}
                                        defaultCenter={{
                                            lat: 44.900209366013954,
                                            lng: -102.56077483176705
                                        }}
                                        defaultZoom={11}
                                        yesIWantToUseGoogleMapApiInternals
                                    >

                                    </GoogleMapReact> */}

                                    <iframe width='100%'
                                        src={data.map_url} 
                                        
                                        style={{ border: 0 }} height="300">
                                    </iframe>
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
                    </Flex>

                </Grid.Col>
            </Grid>
            <Box
                p={20}
                mt={20}
                mb={40}
            >
                {
                    isLoad ? <Box><Loader variant='dots' alignmentBaseline='central' /></Box> :
                        <ResponsiveMasonry
                            columnsCountBreakPoints={{ 350: 1, 750: 2,  1000: 3, 1400: 4, 1600: 5 }}
                        >
                            <Masonry gutter='10px' style={{ background: 'transparent' }}>
                                {
                                    images.videos.map((video: any, key: number) =>
                                        video ?
                                        <Flex w={'100%'} justify={'center'} key={key} direction={'column'}>
                                            <iframe
                                                key={key} src={"https://www.tiktok.com/embed/v2/" + getVideoId(video.page_url)}
                                                style={{overflow:"hidden", height: "500px", width:"300px", background:'transparent', border: "none"}}
                                                scrolling="no"
                                            />
                                            {/* <a style={{marginTop: '10px', color: 'black', textDecorationLine:'underline'}} target='_blank' href={video.page_url}>Go to Tiktok</a> */}
                                        </Flex>:<></>
                                    )
                                }
                            </Masonry>
                        </ResponsiveMasonry>
                }
            </Box>
            <AuthModal type='login' open={() => { setOpenAuthModal(false) }} opened={openAuthModal} setType={(type) => { setAuthType(type) }} />
        </Box>
    )
}

export default Service;

