import { Box, Avatar, Flex, Text, Button, Tabs, Textarea, Loader, Image } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Item } from "@/types/elements";
import Block from "@/components/Home/Block";
import { Dropzone } from '@mantine/dropzone';
import HomeContext from '@/state/index.context';

const Profile = () => {
    const user = useUser();
    const router = useRouter();
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [saves, setSaves] = useState<Item[]>([]);
    const [image, setImage] = useState<string>('');
    const [updatingImage, setUpdatingImage] = useState<boolean>(false);

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

    return (
        user && <Box
        >
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
                                updatingImage?<Loader />:
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
                <Tabs defaultValue="saves">
                    <Tabs.List>
                        <Tabs.Tab value="saves">
                            <Text weight={600} size='1.2rem'>
                                Saves
                            </Text>
                        </Tabs.Tab>
                        {/* <Tabs.Tab value="Collections">
                            <Text weight={600} size='1.2rem'>
                                Collections
                            </Text>
                        </Tabs.Tab>
                         */}
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
                        saves.length == 0 ?
                            <Text mt={50} align="center" size='3rem' sx={(theme) => ({
                                color: theme.colors.gray[2]
                            })}>
                                No saves Found
                            </Text> :
                            <ResponsiveMasonry
                                columnsCountBreakPoints={{ 350: 2, 500: 3, 750: 3, 900: 4, 1550: 5, 1800: 6 }}
                                style={{ marginTop: '20px' }}
                            >
                                <Masonry>
                                    {
                                        saves.map((item: Item, key: number) =>
                                            <Block key={key} data={item} getSaves={() => { getSaves() }} saved='true' />
                                        )
                                    }
                                </Masonry>
                            </ResponsiveMasonry>
                }
            </Box>
        </Box>
    )
}

export default Profile;