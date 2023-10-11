import {
    Box,
    Text,
    Button, 
    Flex,
    Menu,
    Image, 
    Avatar, 
    UnstyledButton, 
    useMantineTheme, 
    Group,
    rem
} from "@mantine/core"
import {
    IconLogout,
    IconHeart,
    IconStar,
    IconMessage,
    IconSettings,
    IconExternalLink,
    IconDots
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useContext, FC, useEffect, useState } from 'react';
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/app/supabase-client";
import HomeContext from '@/state/index.context';

interface Props {
    setType: (type: string) => void,
    isMobile: boolean
}

const MyMenu:FC<Props> = ({
    setType,
    isMobile
}) => {

    const user = useUser();
    const router = useRouter();
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const {
        state: { user_profile, elements },
    } = useContext(HomeContext);

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    }

    return (
        <>
            <Box
            sx={(theme) => ({
                textAlign: 'center'
            })}
        >
            {
                user ? <Flex
                    gap="md"
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <Menu
                        width={260}
                        position="bottom-end"
                        transitionProps={{ transition: 'pop-bottom-right' }}
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                        withinPortal
                    >
                        <Menu.Target>
                            <UnstyledButton>
                                <Group spacing='md'>
                                    <Avatar src={user_profile.avatar_url} radius="40px" size={40} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {
                                isMobile && 
                                <>
                                    <Menu.Divider />
                                    {
                                        elements.map((item, key) => 
                                            <Menu.Item
                                                key={key}
                                                icon={
                                                    <IconExternalLink
                                                        style={{ width: rem(16), height: rem(16) }}
                                                        color={theme.colors.blue[6]}
                                                        stroke={1.5}
                                                    />
                                                }
                                                onClick={() => {
                                                    router.push(`/${item.name}/${item.city_name}/${item.category_name}`);
                                                }}
                                            >
                                                {item.name}
                                            </Menu.Item>
                                        )
                                    }    
                                </>
                            }
                            <Menu.Divider />
                            <Menu.Item
                                icon={
                                    <IconMessage
                                        style={{ width: rem(16), height: rem(16) }}
                                        color={theme.colors.blue[6]}
                                        stroke={1.5}
                                    />
                                }
                                onClick={() => {
                                    router.push('/user/profile')
                                }}
                            >
                                Profile
                            </Menu.Item>
                            <Menu.Item
                                icon={
                                    <IconHeart
                                        style={{ width: rem(16), height: rem(16) }}
                                        color={theme.colors.red[6]}
                                        stroke={1.5}
                                    />
                                }
                                onClick={() => {
                                    router.push('/user/profile')
                                }}
                            >
                                My Saves
                            </Menu.Item>
                            <Menu.Item
                                icon={
                                    <IconStar
                                        style={{ width: rem(16), height: rem(16) }}
                                        color={theme.colors.yellow[6]}
                                        stroke={1.5}
                                    />
                                }
                                onClick={() => {
                                    router.push('/user/profile')
                                }}
                            >
                                My Collections
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                icon={
                                    <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                }
                                onClick={() => {
                                    router.push('/user/setting')
                                }}
                            >
                                Account settings
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                icon={
                                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                }
                                onClick={() => {
                                    logout();
                                }}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
                :
                <>
                    {
                        isMobile?
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <Avatar
                                    color="gray" radius="xl"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <IconDots />
                                </Avatar>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item>
                                    <Box> 
                                        <Flex
                                            gap="xs"
                                            justify="center"
                                            align="center"
                                            direction="row"
                                            // wrap="wrap"
                                        >
                                            <Button
                                                size="xs"
                                                sx={(theme) => ({
                                                    color: theme.colors.gray[7],
                                                    '&:hover': {
                                                        color: theme.colors.gray[9],
                                                    },
                                                })}
                                                variant='white'
                                                onClick={() => { 
                                                    setType('login') 
                                                }}
                                            >
                                                Log in
                                            </Button>
                                            <Button
                                                size="xs"
                                                onClick={() => { 
                                                    setType('signup') 
                                                }}
                                            >
                                                Sign up
                                            </Button>
                                        </Flex>
                                    </Box>
                                </Menu.Item>
                                {
                                    elements.map((item, key) =>
                                        <Menu.Item
                                            key={key}
                                            icon={
                                                <IconExternalLink
                                                    style={{ width: rem(16), height: rem(16) }}
                                                    color={theme.colors.blue[6]}
                                                    stroke={1.5}
                                                />
                                            }
                                            onClick={() => {
                                                router.push(`/${item.name}/${item.city_name}/${item.category_name}`);
                                            }}
                                        >
                                            {item.name}
                                        </Menu.Item>
                                    )
                                }
                            </Menu.Dropdown>
                        </Menu>
                        :
                        <Flex
                            gap="md"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <Button
                                sx={(theme) => ({
                                    color: theme.colors.gray[7],
                                    '&:hover': {
                                        color: theme.colors.gray[9],
                                    },
                                })}
                                variant='white'
                                onClick={() => { 
                                    setType('login') 
                                }}
                            >
                                Log in
                            </Button>
                            <Button
                                onClick={() => { 
                                    setType('signup') 
                                }}
                            >
                                Sign up
                            </Button>
                        </Flex>
                    }
                </>
            }
        </Box>
        </>
    )
}

export default MyMenu;