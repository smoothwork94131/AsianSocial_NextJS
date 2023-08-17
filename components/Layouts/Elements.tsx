import { ELEMENTS } from "@/utils/app/consts";
import {
    Box,
    Flex,
    Text
} from "@mantine/core"

const Elements = () => {
    return (
        <Flex
            gap='2.2rem'
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
            ml={30}
        >
            {
                ELEMENTS.map((item, key) =>
                    <Text
                        mt={10}
                        pb={5}
                        key={key}
                        sx={(theme) => ({
                            color: theme.colors.gray[6],
                            '&:hover': {
                                color: theme.colors.gray[9],
                                // borderBottom: `2px solid ${theme.colors.gray[9]}`
                            },
                            cursor: 'pointer'
                        })}
                        size='lg'
                        weight='500'
                    >
                        {item.name}
                    </Text>
                )
            }
        </Flex>
    )
}

export default Elements;