import { Box, Image, Text } from "@mantine/core";
import { FC } from "react";

interface Props {
    img_name: string
}
const Block:FC<Props> = ({img_name}) => {
    return (
        <Box
            p={10}
        >
            <Image 
                src={`./${img_name}`} alt='event_img' radius={10}
                sx={(theme) =>({
                    '&:hover' :{
                        opacity: '0.7',
                    },
                    cursor: 'pointer'
                })}
            />
            <Box mt={10}>
                <Text 
                weight={700}
                sx={(theme) =>({
                    color: theme.colors.gray[9]
                })}>
                    Playroom Storage Ideas
                </Text>
                <Text 
                weight={500}
                sx={(theme) =>({
                    color: theme.colors.gray[7]
                })}>
                    esty.com
                </Text>
            </Box>
        </Box>
    )
}
export default Block;