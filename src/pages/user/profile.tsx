import { Box, Avatar, Flex, Text, Button, Tabs, Textarea, Loader, Image } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Collection, CollectionState, Item, ItemState } from "@/types/elements";
import Block from "@/components/Home/Block";
import { Dropzone } from '@mantine/dropzone';
import HomeContext from '@/state/index.context';
import InfoModal from "@/components/Item/InfoModal";
import { useMediaQuery } from '@mantine/hooks';
import { IconEdit, IconTable, IconTrash } from "@tabler/icons-react";


const Profile = () => {
    const user = useUser();
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [saves, setSaves] = useState<Item[]>([]);
    const [image, setImage] = useState<string>('');
    const [updatingImage, setUpdatingImage] = useState<boolean>(false);
    const [tabType, setTabType] = useState<string>('saves');
    const [selectedItem, setSelectedItem] = useState<Item>(ItemState);
    const [open, setOpen] = useState<boolean>(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isCollectionSaves, setIsCollectionSaves] = useState<boolean>(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection>(CollectionState);

    const {
        state: { avatar_url },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        if (user) {
            getUserProfile();
            getSaves();
        } else {
            router.push('/');
        }
        window.addEventListener('resize', function () {
            setWindow();
        });
        setWindow();
    }, [])

    useEffect(() => {

    }, [selectedCollection])

    useEffect(() => {
        if (tabType == 'saves') {
            getSaves();
        } else {
            getCollections();
        }
    }, [tabType])

    const getCollections = async () => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/user/profile/get_collections', {
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

    const getSaves = async () => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/user/profile/get_saves', {
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

    const getUserProfile = async () => {
        try {
            const res = await fetch('/api/user/profile/get_profile', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user?.id }),
            })

        } catch (e) {

        }
    }

    const setWindow = () => {
        setScreenWidth(window.innerWidth);
    }

    useEffect(() => {
        getCollectionItems();
    }, [selectedCollection])

    const getCollectionItems = async() => {
        setIsLoad(true)
        const res = await fetch('/api/admin/get_collection_items', {
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ collection_id: selectedCollection.id }),
        })
        if(res.status == 200) {
            const data_ = await res.json();
            setSaves(data_);
        } else {

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
            homeDispatch({
                field: 'avatar_url',
                value: image
            })
        } else {

        }
    }

    const deleteCollection = async() => {
        setIsLoad(true);
        const res = await fetch('/api/user/profile/delete_collection', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedCollection.id }),
        })

        if (res.status == 200) {
            getCollectionItems();
        } 
        setIsLoad(false);

    }

    return (
        user && <Box
        >
            {
                isCollectionSaves ?
                    <Box

                    >
                        <Text size={48} pt={80}
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
                            <IconTrash color="gray" size={15} style={{cursor: 'pointer'}} onClick={() => {
                                deleteCollection();
                            }}/>
                            <IconTable color="gray" size={15} style={{cursor: 'pointer'}} onClick={() => {setIsCollectionSaves(false); setTabType('saves')}}/>
                        </Flex>
                        <Box>
                            {
                                isLoad ? <Box mt={30} sx={(theme) => ({
                                    textAlign: 'center'
                                })}>
                                    <Loader />
                                </Box> :
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
                                    <Masonry>
                                        {
                                            saves.map((item: Item, key: number) =>
                                                <Block key={key} data={item} getSaves={() => { getSaves() }} page_type='admin' setSelectedItem={(item: Item) => { setSelectedItem(item); setOpen(true) }} />
                                            )
                                        }
                                    </Masonry>
                                </ResponsiveMasonry>
                            }
                        </Box>
                    </Box> :
                    <Box>
                        <Box
                            sx={(theme) => ({
                                margin: 'auto',
                                width: '300px'
                            })}
                        >
                            <Flex
                                gap={screenWidth > 400 ? 'lg' : 'sm'}
                                direction={screenWidth > 400 ? 'row' : 'column'}
                            >
                                <Box>
                                    <Avatar color="blue" radius="180px" size={180}>

                                        {
                                            updatingImage ? <Loader /> :
                                                avatar_url != '' && avatar_url != null ?
                                                    <Image src={avatar_url} alt="" /> : null
                                        }
                                    </Avatar>
                                    {
                                        screenWidth < 400 &&

                                        <Dropzone
                                            accept={{
                                                'image/*': [], // All images
                                                'text/html': ['.png', '.jpg'],
                                            }}
                                            sx={(theme) => ({
                                                background: theme.colors.gray[2],
                                                color: "black",
                                                position: 'relative',
                                                top: -190,
                                                left: 100,
                                                width: '130px',
                                                padding: 10
                                            })}
                                            onDrop={(files) => { convertToBase64(files[0]) }}
                                        >
                                            <Dropzone.Idle>
                                                Update Picture
                                            </Dropzone.Idle>
                                        </Dropzone>
                                    }

                                </Box>
                                <Box sx={(theme) => ({
                                    textAlign: 'center',
                                    width: '180px',
                                    marginTop: screenWidth > 400 ? '0px' : '-40px'
                                })}>
                                    <Text
                                        sx={(theme) => ({
                                            color: theme.colors.gray[8],
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        })}
                                        size='2rem'
                                        weight='bold'
                                    >
                                        {
                                            user.email
                                        }
                                    </Text>
                                    {
                                        screenWidth > 400 &&

                                        <Dropzone
                                            accept={{
                                                'image/*': [], // All images
                                                'text/html': ['.png', '.jpg'],
                                            }}
                                            sx={(theme) => ({
                                                width: '130px',
                                                padding: 10
                                            })}
                                            onDrop={(files) => { convertToBase64(files[0]) }}
                                        >
                                            <Dropzone.Idle>
                                                Update Picture
                                            </Dropzone.Idle>
                                        </Dropzone>
                                    }

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
                                isLoad ? <Box mt={30} sx={(theme) => ({
                                    textAlign: 'center'
                                })}>
                                    <Loader />
                                </Box> :

                                    tabType == 'saves' ?
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
                                                <Masonry>
                                                    {
                                                        saves.map((item: Item, key: number) =>
                                                            <Block key={key} data={item} getSaves={() => { getSaves() }} page_type='admin' setSelectedItem={(item: Item) => { setSelectedItem(item); setOpen(true) }} />
                                                        )
                                                    }
                                                </Masonry>
                                            </ResponsiveMasonry>
                                        :
                                        collections.length == 0 ?
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
                                                <Masonry>
                                                    {
                                                        collections.map((item: Collection, key: number) =>
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
                        <InfoModal open={() => { setOpen(p_o => (!p_o)) }} opened={open} data={selectedItem} isMobile={isMobile} />
                    </Box>
            }
        </Box>
    )
}

export default Profile;