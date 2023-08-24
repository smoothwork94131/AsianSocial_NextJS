import { Box, Text, Button, Flex, Modal, Image, TextInput } from "@mantine/core"
import { useDisclosure } from '@mantine/hooks';
import { useState, FC } from 'react';

interface Props {
   setType: (type: string) => void
}

const Auth:FC<Props> = ({
    setType
}) => {
    return (
        <Box>
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
      
        </Box>

    )
}

export default Auth;

