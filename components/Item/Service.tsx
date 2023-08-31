import { Modal, Button, Group, Box, Grid, Image, Flex, Text, Rating, Loader } from '@mantine/core';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FC, useState } from 'react';
import { Category, Item } from '@/types/elements';
import GoogleMapReact from 'google-map-react';
import Categories from '../Element/Categories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faFlag } from '@fortawesome/free-solid-svg-icons'
import { useUser } from "@supabase/auth-helpers-react";
import { notifications } from '@mantine/notifications';
import AuthModal from '../Layouts/AuthModal';
import { useRouter } from 'next/router';

interface Props {
    images: string[],
    isMobile: boolean,
    data: Item,
    categories: Category[],
    isLoad: boolean,
    selectCategory: (category: Category) => void,
    element_name: string,
    getSaves?: () => void | undefined,
    saved?: string | undefined
    open: () =>void
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
    open
}) => {

    const user = useUser();
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
    const [authType, setAuthType] = useState<string>('login');
    const router = useRouter();
    const saveItem = async () => {
        if (user) {
            const res = await fetch('/api/item/save_item', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user?.id, item_id: data.id }),
            })
            if (res.status == 200) {
                const data = await res.json();
                notifications.show({
                    title: 'Success',
                    message: data.msg,
                    color: 'default'
                })
            } else {
                const data = await res.json();
                notifications.show({
                    title: '',
                    message: data.msg,
                    color: 'red'
                })
            }
        } else {
            setOpenAuthModal(true);
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
                if(getSaves){
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
                            {
                                saved ?
                                    <Button onClick={() => { deleteItem() }} color='red'>
                                        Delete
                                    </Button> :
                                    <Button onClick={() => { saveItem() }}>
                                        Save
                                    </Button>
                            }
                            
                            
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
                        <Flex>
                            <Text size='1rem' color='gray'>4.9</Text>
                            <Rating value={4.5} fractions={2} readOnly />
                            <Text size='1rem' color='gray'>(78)</Text>

                        </Flex>
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
                                        <Box key={key}><Image src={image} alt='' radius={5} style={{ height: '300px' }} /></Box>
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

