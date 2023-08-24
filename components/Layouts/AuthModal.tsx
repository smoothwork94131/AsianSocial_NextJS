
import { Box, Text, Button, Flex, Modal, Image, TextInput } from "@mantine/core"
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";
import { FC } from 'react';

interface Props {
    open: () => void,
    opened: boolean,
    type: string,
    setType: (type: string) => void
}

const AuthModal: FC<Props> = ({ open, opened, type, setType }) => {
    
    return (
        <Modal opened={opened} onClose={open} centered size='440px'>
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
                <TextInput
                    placeholder="Email or Username"
                    style={{ border: 'none' }}
                    size="md"
                />
                <TextInput
                    placeholder="Password"
                    style={{ border: 'none' }}
                    size="md"
                />
                {
                    type=='login'?<Text align="center" color='gray' size={15}>
                    Forgot your password
                </Text>:<></>

                }
                
                <Box>
                    <Button fullWidth size="md">
                        {type == "login" ? 'Log in' : 'SignUp'}
                    </Button>
                    <Text color="gray" size={15} align="center">
                        Or
                    </Text>
                </Box>
                <Box className="auth-buttons">
                    <Button fullWidth size="md" color="indigo" style={{textAlign: 'left'}}>
                        <Flex
                            justify='start'
                            align='center'
                        >
                            <IconBrandFacebook />
                            <Text ml={30}>
                                {
                                    type == 'login' ? 'Log in ' : 'Signup '
                                }
                                with Facebook
                            </Text>
                        </Flex>
                    </Button>
                    <Button fullWidth size="md" mt={10} style={{textAlign: 'left'}}>
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
                    <Text color="blue" weight={700} align="center" mt={20} sx={(theme) =>({
                        cursor: 'pointer'
                    })}
                        onClick={() => {
                            if(type == 'login'){
                                setType('signup');
                            } else {
                                setType('login');
                            }
                        }}
                    >
                        {
                            type == "login"?'Create a account':'Log in'
                        }
                    </Text>
                </Box>
                
            </Flex>
        </Modal>
    )
}

export default AuthModal;