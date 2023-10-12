import { useEffect, useState, useContext } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useRouter } from 'next/router';
import { Box, Avatar, Flex, Text, Button, Tabs, Textarea, Loader, Image } from "@mantine/core";
import { notifications } from '@mantine/notifications';
import { Dropzone } from '@mantine/dropzone';
import { useMediaQuery } from '@mantine/hooks';
import { IconEdit, IconTable, IconTrash } from "@tabler/icons-react";

import { useUser } from "@supabase/auth-helpers-react";
import HomeContext from '@/state/index.context';

import { CategoryType, CollectionType, CollectionState, ElementState, ItemType, ItemState, CityType, ElementType } from "@/types/elements";
import Block from "@/components/Home/Block";
import InfoModal from "@/components/Item/InfoModal";


const Profile = () => {
    const user = useUser();
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [saves, setSaves] = useState<ItemType[]>([]);
    const [image, setImage] = useState<string>('');
    const [updatingImage, setUpdatingImage] = useState<boolean>(false);
    const [tabType, setTabType] = useState<string>('saves');
    const [selectedItem, setSelectedItem] = useState<ItemType>(ItemState);
    const [open, setOpen] = useState<boolean>(false);
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [isCollectionSaves, setIsCollectionSaves] = useState<boolean>(false);
    const [selectedCollection, setSelectedCollection] = useState<CollectionType>(CollectionState);

    const {
        state: { user_profile },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const setWindow = () => {
        setScreenWidth(window.innerWidth);
    }

    const getSaves = async () => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/item/get_saves', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user?.id }),
            })
            if (res.status == 200) {
                const data = await res.json();
                setSaves(data);
            } else {

            }
        } catch (e) {

        }
        setIsLoad(false);
    }

    const getCollections = async () => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/item/get_collections', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: user?.id }),
            })
            if (res.status == 200) {
                const data = await res.json();
                setCollections(data);
            } else {

            }
        } catch (e) {

        }
        setIsLoad(false);
    }

    const getCollectionItems = async () => {
        setIsLoad(true)
        const res = await fetch('/api/admin/get_collection_items', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ collection_id: selectedCollection.id }),
        })
        if (res.status == 200) {
            const data_ = await res.json();
            setSaves(data_);
        }

        setIsLoad(false);
    }

    const convertToBase64 = async (file: File) => {
        setUpdatingImage(true);
        const readAsDataURL = () => {
            return new Promise((resolve, reject) => {
                const FR = new FileReader();

                FR.addEventListener("load", function (evt) {
                    const event = evt as ProgressEvent<FileReader>; // Casting evt to ProgressEvent<FileReader>

                    if (event.target && typeof event.target.result === "string") { // Adding type check for result property
                        const target = event.target as FileReader & {
                            result: string; // Specify the correct type for result property
                        };

                        resolve(target.result);
                    } else {
                        reject(new Error("Invalid file format"));
                    }
                });

                FR.onerror = () => {
                    reject(new Error("Failed to read file"));
                };

                FR.readAsDataURL(file);
            });
        };
        const result = await readAsDataURL();
        setImage(result as string);
        await updatePicture(result as string);
        setUpdatingImage(false);
    }

    const updatePicture = async (image: string) => {
        const res = await fetch('/api/user/profile/update_picture', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user?.id, image }),
        })

        if (res.status == 200) {
            const data = await res.json();
            homeDispatch({
                field: 'user_profile',
                value: data[0]
            });

            notifications.show({
                message: 'Success',
                color: 'default'
            });
        }
    }

    const deleteCollection = async () => {
        setIsLoad(true);
        const res = await fetch('/api/item/delete_collection', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                collection_id: selectedCollection.id,
                user_id: user?.id
            }),
        })

        if (res.status == 200) {
            getCollectionItems();
        }
        setIsLoad(false);

    }

    useEffect(() => {
        if (tabType == 'saves') {
            getSaves();
        } else {
            getCollections();
        }
    }, [tabType])

    useEffect(() => {
        getCollectionItems();
    }, [selectedCollection])

    useEffect(() => {
        if (user) {
            getSaves();
        } else {
            router.push('/');
        }
        window.addEventListener('resize', function () {
            setWindow();
        });
        setWindow();
    }, [])

    return (
        user && <Box>
        {
            isCollectionSaves ?
            <Box>
                <Text 
                    size={48} 
                    pt={80}
                    weight={500}
                    pb={80} align="center" sx={(theme) => ({
                        color: theme.colors.gray[7]
                    })}>
                    {
                        selectedCollection.name
                    }
                </Text>
                <Flex
                    justify='flex-end'
                    align={'center'}
                    gap={'md'}
                >
                    <IconTrash 
                        color="gray" 
                        size={15} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => {
                            deleteCollection();
                        }} 
                    />
                    <IconTable 
                        color="gray" 
                        size={15} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => { 
                            setIsCollectionSaves(false); 
                            setTabType('saves') 
                        }} 
                    />
                </Flex>
                <Box>
                    {
                        isLoad ?
                        <Box mt={30} sx={(theme) => ({
                            textAlign: 'center'
                        })}>
                            <Loader />
                        </Box>
                        :
                        saves.length == 0 ?
                        <Text mt={50} align="center" size='3rem' sx={(theme) => ({
                            color: theme.colors.gray[3]
                        })}>
                            No {
                                tabType
                            } Found
                        </Text> :
                        <ResponsiveMasonry
                            columnsCountBreakPoints={{ 350: 2, 500: 3, 750: 3, 900: 4, 1550: 5, 1800: 6 }}
                            style={{ marginTop: '20px' }}
                        >
                            <Masonry gutter="10px">
                                {
                                    saves.map((item: ItemType, key: number) =>
                                        <Block
                                            key={key}
                                            data={item}
                                            setSelectedItem={(item: ItemType) => { setSelectedItem(item); setOpen(true) }}
                                        />
                                    )
                                }
                            </Masonry>
                        </ResponsiveMasonry>
                    }
                </Box>
            </Box> 
            :
            <Box>
                <Box
                    sx={(theme) => ({
                        margin: 'auto',
                        width: isMobile ? '100%': '500px' 
                    })}
                >
                    <Flex
                        justify='space-between'
                    >
                        <Flex
                            gap={screenWidth > 400 ? 'lg' : 'sm'}
                            direction={isMobile ? 'column' : 'row'}
                            align={isMobile ? 'center' : 'flex-start'}
                            // justify='between'
                        >
                            <Avatar color="blue" radius="180px" size={180}>
                                {
                                    updatingImage ?
                                    <Loader /> :
                                    user_profile.avatar_url !== '' ?
                                        <Image src={user_profile.avatar_url} alt="" /> : null
                                }
                            </Avatar>
                            <Text
                                sx={(theme) => ({
                                    color: theme.colors.gray[8],
                                })}
                                style={{
                                    marginTop: isMobile? '0' : '20px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                size='2.5rem'
                                weight='bold'
                            >
                                {
                                    user_profile.full_name
                                }
                            </Text>
                        </Flex>
                        <Box sx={(theme) => ({
                            textAlign: 'center',
                        })}>
                            <Dropzone
                                accept={{
                                    'image/*': [], // All images
                                    'text/html': ['.png', '.jpg'],
                                }}
                                sx={(theme) => ({
                                    marginTop: 30,
                                    padding: 10
                                })}
                                onDrop={(files) => { convertToBase64(files[0]) }}
                            >
                                <Dropzone.Idle>
                                    Update Picture
                                </Dropzone.Idle>
                            </Dropzone>
                        </Box>
                    </Flex>
                </Box>
                <Box sx={(theme) => ({
                    width: '250px',
                    margin: 'auto'
                })} mt='30px'>
                    <Tabs defaultValue={tabType}>
                        <Tabs.List>
                            <Tabs.Tab value="saves">
                                <Text weight={600} size='1.2rem' onClick={() => { setTabType('saves'); }}>
                                    Saves
                                </Text>
                            </Tabs.Tab>
                            <Tabs.Tab value="Collections" onClick={() => { setTabType('collections') }}>
                                <Text weight={600} size='1.2rem'>
                                    Collections
                                </Text>
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                </Box>
                <Box mt={20}>
                {
                    isLoad ? 
                    <Box mt={30} sx={(theme) => ({
                        textAlign: 'center'
                    })}>
                        <Loader />
                    </Box> 
                    :
                    tabType == 'saves' ?
                    saves.length == 0 ?
                    <Text mt={50} align="center" size='3rem' sx={(theme) => ({
                        color: theme.colors.gray[3]
                    })}>
                        No 
                        {
                            tabType
                        } 
                        Found
                    </Text> 
                    :
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 350: 2, 500: 3, 750: 4, 900: 5, 1550: 6 }}
                    >
                        <Masonry gutter="10px">
                        {
                            saves.map((item: ItemType, key: number) =>
                                <Block key={key} data={item} setSelectedItem={(item: ItemType) => { setSelectedItem(item); setOpen(true) }} />
                            )
                        }
                        </Masonry>
                    </ResponsiveMasonry>
                    :
                    collections.length == 0 ?
                    <Text mt={50} align="center" size='3rem' sx={(theme) => ({
                        color: theme.colors.gray[3]
                    })}>
                        No 
                        {
                            tabType
                        } 
                        Found
                    </Text> 
                    :
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 350: 2, 500: 3, 750: 4, 900: 5, 1550: 6 }}
                    >
                        <Masonry gutter="10px">
                            {
                                collections.map((item: CollectionType, key: number) =>
                                    <Box m={15} key={key} style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSelectedCollection(item);
                                            setIsCollectionSaves(true);
                                        }}
                                    >
                                        <Image src={item.image_url} key={key} alt="" sx={(theme) => ({
                                            '&:hover': {
                                                opacity: '0.7',
                                            },
                                            cursor: 'pointer',
                                            border: `1px solid ${theme.colors.gray[4]}`,
                                        })} />
                                        <Text
                                            weight={isMobile ? 300 : 500}
                                            size={isMobile ? '13px' : '19px'}
                                            sx={(theme) => ({
                                                color: theme.colors.gray[7],
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            })}>
                                            {
                                                item.name
                                            }
                                        </Text>
                                    </Box>
                                )
                            }
                        </Masonry>
                    </ResponsiveMasonry>
                }
                </Box>
                <InfoModal
                    open={() => { setOpen(p_o => (!p_o)) }}
                    isMobile={isMobile}
                    opened={open} 
                    data={selectedItem}
                />
            </Box>
        }
        </Box>
    )
}

export default Profile;