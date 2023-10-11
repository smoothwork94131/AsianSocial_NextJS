
import { Box, Text, Button, Flex, Modal, Image, TextInput, LoadingOverlay } from "@mantine/core"
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";
import { FC, useState, useContext, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { supabase } from "@/utils/app/supabase-client";
import { useUser } from "@supabase/auth-helpers-react";
import { notifications } from '@mantine/notifications';
import HomeContext from '@/state/index.context';

interface Props {
    open: () => void,
    opened: boolean,
    type: string,
    setType: (type: string) => void
}

const AuthModal: FC<Props> = ({ open, opened, type, setType }) => {

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const user = useUser();
    const {
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const form = useForm({
        initialValues: { email: '', password: '', name: '' },
        validate: {
            password: (value) => (value.length < 8 ? 'Password must have at least 8 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            name: (value) => (value.length == 0 ? 'Please input a name' : null),
        },
    });

    const authEmail = async () => {
        setIsLoad(true);
        try {
            if (type == 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: form.values.email,
                    password: form.values.password,
                });

                if (error) {
                    notifications.show({
                        title: type,
                        message: (error as any).message,
                        color: 'red'
                    })
                } else {
                    const user_id = data.user.id
                    getUserProfile(user_id);
                    open();
                }
                setIsLoad(false);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email: form.values.email,
                    password: form.values.password,
                    options: {
                        data: {
                            full_name: form.values.name,
                            email: form.values.email,
                        }
                    }
                });

                if (error) {
                    notifications.show({
                        title: type,
                        message: (error as any).message,
                        color: 'red'
                    })
                } else {
                    open();
                }
                setIsLoad(false);
            }
        } catch (e) {
            setIsLoad(false);
        }
    }

    const authProvider = async (provider: any) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider
        })
    }

    const getUserProfile = async (user_id:string) => {
        try {
            const res = await fetch('/api/user/profile/get_profile', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: user_id }),
            })

            if(res.ok) {
                const data = await res.json();
                homeDispatch({
                    field: 'user_profile',
                    value: data
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if(user) {
            getUserProfile(user.id);
        }
    }, [user])

    return (
        <Modal opened={opened} onClose={open} centered size='440px' className="auth-modal">
            <Flex
                gap='lg'
                direction='column'
                pl={70} pr={70} pb={20}
            >
                <Box
                    sx={(theme) => ({
                        textAlign: 'center'
                    })}
                >
                    <Image src='/logo.png' alt='logo' width={130} style={{ margin: 'auto' }} />
                </Box>
                <Text size='1.5rem' align="center" weight={600}>
                    {
                        type == 'login' ? 'Log in to your account' : 'Sign up to discover and save amazing creativity.'
                    }
                </Text>
                <form onSubmit={form.onSubmit(() => { authEmail() })} >
                    <TextInput
                        placeholder="Email"
                        style={{ border: 'none' }}
                        size="md"
                        {...form.getInputProps('email')}
                    />
                    {
                        type != 'login' &&
                        <TextInput
                            placeholder="User name"
                            style={{ border: 'none' }}
                            size="md"
                            {...form.getInputProps('name')}
                            mt={15}
                        />
                    }
                    <TextInput
                        placeholder="Password"
                        style={{ border: 'none' }}
                        type='password'
                        size="md"
                        {...form.getInputProps('password')}
                        mt={15}
                    />
                    <Box mt={15}>
                        <Button fullWidth size="md" onClick={() => { authEmail() }}>
                            {type == "login" ? 'Log in' : 'Sign Up'}
                        </Button>
                        <Text color="gray" size={15} align="center">
                            Or
                        </Text>
                    </Box>
                </form>
                {/* {
                        type=='login'?<Text align="center" color='gray' size={15}>
                            Forgot your password
                        </Text>:<></>
                    }
                 */}
                <Box className="auth-buttons">
                    {/* <Button fullWidth size="md" color="indigo" style={{ textAlign: 'left' }}>
                            <Flex
                                justify='start'
                                align='center'
                            >
                                <IconBrandGoogle onClick={() => { authProvider('google')}}/>
                                <Text ml={30}>
                                    {
                                        type == 'login' ? 'Log in ' : 'Signup '
                                    }
                                    with Facebook
                                </Text>
                            </Flex>
                        </Button> */}
                    <Button fullWidth size="md" mt={10} style={{ textAlign: 'left' }} onClick={() => { authProvider('google') }}>
                        <Flex
                            justify='start'
                            align='center'
                        >
                            <IconBrandGoogle />
                            <Text ml={30} >
                                {
                                    type == 'login' ? 'Log in ' : 'Signup '
                                }
                                with Google
                            </Text>
                        </Flex>
                    </Button>
                    <Text weight={400} color="black" align="center" mt={20} size={13} sx={(theme) => ({
                        color: theme.colors.gray[8]
                    })}>
                        {
                            `By continuing, you agree to Designspiration's Terms of Service and acknowledge you've read our Privacy Policy`
                        }
                    </Text>
                    <Text color="blue" weight={700} align="center" mt={20} sx={(theme) => ({
                        cursor: 'pointer'
                    })}
                        onClick={() => {
                            if (type == 'login') {
                                setType('signup');
                            } else {
                                setType('login');
                            }
                        }}
                    >
                        {
                            type == "login" ? 'Create a account' : 'Log in'
                        }
                    </Text>
                </Box>
            </Flex>
            <LoadingOverlay visible={isLoad} overlayBlur={2} />
        </Modal>
    )
}

export default AuthModal;