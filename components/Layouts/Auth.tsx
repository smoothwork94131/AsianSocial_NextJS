import cx from 'clsx';
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
    IconPlayerPause,
    IconTrash,
    IconSwitchHorizontal,
    IconChevronDown,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useContext, FC, useEffect, useState } from 'react';
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/app/supabase-client";
import HomeContext from '@/state/index.context';

interface Props {
    setType: (type: string) => void
}

const Auth: FC<Props> = ({
    setType
}) => {
    const user = useUser();
    const router = useRouter();
    const theme = useMantineTheme();
    const [opened, { toggle }] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);

    const {
        state: { avatar_url },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    }

    useEffect(() => {
        const fetch_user = async () => {
            if(user) {
                try {
                    const res = await fetch('/api/user/profile/get_profile', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: user?.id }),
                    })
                    if (res.status == 200) {
                        const data = await res.json();
                        homeDispatch({
                            field: 'avatar_url',
                            value: data.avatar_url
                        })
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }

        fetch_user();
    }, [user])

    return (
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
                                    <Avatar src={avatar_url} radius="40px" size={40} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown>
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
                    <Flex
                        gap="md"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap"
                    >
                        <Text
                            sx={(theme) => ({
                                color: theme.colors.gray[7],
                                '&:hover': {
                                    color: theme.colors.gray[9],
                                },
                                cursor: 'pointer'
                            })}
                            size='lg'
                            weight='500'
                            onClick={() => { setType('login') }}
                        >
                            Log in
                        </Text>
                        <Button
                            onClick={() => { setType('signup') }}
                        >
                            Sign up
                        </Button>
                    </Flex>
            }
        </Box>
    )
}

export default Auth;

