import { Box, Text, Button, Flex, Modal, Image, Avatar } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';
import { useContext, FC, useEffect } from 'react';
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
    const {
        state: { avatar_url },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const logout = async() => {
        await supabase.auth.signOut();
    }
    useEffect(() => {
        const fetch_user = async() => {
            if(user){
                try {
                    const res = await fetch('/api/user/profile/get_profile', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: user?.id }),
                    })
                    if(res.status == 200){
                        const data = await res.json();
                        homeDispatch({
                            field: 'avatar_url',
                            value: data.avatar_url
                        })
                    }
                } catch (e) {
                    
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
                user ?
                    <Flex
                        gap="md"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap"
                    >
                        <Box onClick={() => {
                            router.push('/user/profile')
                        }}
                            sx={(theme) =>({
                                cursor: 'pointer'
                            })}
                        >
                            <Avatar color="blue" radius="xl">
                                {
                                    avatar_url != '' && avatar_url != null?
                                    <Image src={avatar_url} alt=""/>:null
                                }
                            </Avatar>
                        </Box>
                        <Button
                            onClick={() => { logout() }}
                        >
                            Logout
                        </Button>
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

