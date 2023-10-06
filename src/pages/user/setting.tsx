import { 
    Grid, 
    Box, 
    useMantineTheme,
    Avatar, 
    Flex, 
    Text, 
    Button, 
    Tabs, 
    Textarea, 
    Loader, 
    Image, 
    NavLink, 
    Card,
    Group
} from "@mantine/core";
import { IconChevronRight } from '@tabler/icons-react';
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { CategoryType, CollectionType, CollectionState, ElementState, ItemType, ItemState, CityType, ElementType } from "@/types/elements";
import Block from "@/components/Home/Block";
import { Dropzone } from '@mantine/dropzone';
import HomeContext from '@/state/index.context';
import InfoModal from "@/components/Item/InfoModal";
import { useMediaQuery } from '@mantine/hooks';
import { IconEdit, IconTable, IconTrash } from "@tabler/icons-react";


const Setting = () => {
    const user = useUser();
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: 760px)`);
    const theme = useMantineTheme();

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(0);
    
    const {
        state: { avatar_url },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    useEffect(() => {
        if (user) {
            getUserProfile();
        } else {
            router.push('/');
        }
        window.addEventListener('resize', function () {
            setWindow();
        });
        setWindow();
    }, [])

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
            console.log(e);
        }
    }

    const setWindow = () => {
        setScreenWidth(window.innerWidth);
    }

    return (
        user && 
        <Grid>
            <Grid.Col span={2}>
                <Box
                    style={{
                        borderRadius: 5,
                        border: '1px solid',
                        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                        width: '100%',
                        height: 80,
                        padding: '0 20px'
                    }}
                >
                    <Flex
                        align='center'
                        style={{
                            height: '100%'
                        }}
                    >
                        <Avatar color="blue" radius="50px" size={50}>
                        {
                            avatar_url != '' && avatar_url != null ?
                            <Image src={avatar_url} alt="" /> : null
                        }
                        </Avatar>
                        <Text
                            sx={(theme) => ({
                                color: theme.colors.gray[8],
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginLeft: 20
                            })}
                            size='1rem'
                            weight={800}
                        >
                            {
                                user.email
                            }
                        </Text>
                    </Flex>
                </Box>
                <Box 
                    style={{
                        marginTop: 15,
                        width: '100%',
                    }}
                >
                    <NavLink 
                        label="Account"
                        rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                        style={{
                            height: 50,
                            border: '1px solid',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                            borderBottom: 'hidden',
                        }}
                        // active
                    />
                    <NavLink
                        label="Profile"
                        rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                        style={{
                            height: 50,
                            border: '1px solid',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                            borderBottom: 'hidden',
                        }}
                        // active
                    />
                    <NavLink 
                        label="Pro Membership"
                        rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                        style={{
                            height: 50,
                            border: '1px solid',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                            borderBottom: 'hidden',
                        }}
                        // active
                    />
                    <NavLink 
                        label="Social Profiles"
                        rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                        style={{
                            height: 50,
                            border: '1px solid',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                            borderBottom: 'hidden',
                        }}
                        // active
                    />
                    <NavLink 
                        label="Privacy & Data"
                        rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                        style={{
                            height: 50,
                            border: '1px solid',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                            borderBottom: 'hidden',
                        }}
                        // active
                    />
                    <NavLink
                        label="Email Notifications"
                        rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                        style={{
                            height: 50,
                            border: '1px solid',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                        }}
                        // active
                    />
                </Box>
            </Grid.Col>
            <Grid.Col span={10}>
                <Card withBorder shadow="sm" radius="md">
                    <Card.Section withBorder inheritPadding pl="md" py="md" >
                        <Group position="apart">
                            <Text weight={500}>Account</Text>
                        </Group>
                    </Card.Section>

                    <Card.Section m="md">
                        <Text component="span" inherit color="blue">
                        200+ images uploaded
                        </Text>{' '}
                        since last visit, review them to select which one should be added to your gallery
                    </Card.Section>
                </Card>
            </Grid.Col>
        </Grid>
    )
}

export default Setting;