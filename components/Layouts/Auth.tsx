import { Box, Text, Button, Flex } from "@mantine/core"

const Auth = () => {
    return (
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
            >
                Log in
            </Text>
            <Button
                variant="outline"
            >
                Sign up
            </Button>
        </Flex>
    )
}

export default Auth;

