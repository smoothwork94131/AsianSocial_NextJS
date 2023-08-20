import { Box, Image, Text } from "@mantine/core";
import { FC } from "react";
import { useMediaQuery } from '@mantine/hooks';
import { Item } from "@/types/elements";

interface Props {
    data: Item
}
const Block:FC<Props> = ({data}) => {
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    return (
        <Box
            p={10}
        >
            <Image 
                src={ data.image } alt='event_img' 
                sx={(theme) =>({
                    '&:hover' :{
                        opacity: '0.7',
                    },
                    cursor: 'pointer',
                    border: `1px solid ${theme.colors.gray[4]}`,
                })}
            />
            {
                !isMobile&&
                <Box mt={10}>
                    <Text 
                    weight={700}
                    sx={(theme) =>({
                        color: theme.colors.gray[9]
                    })}>
                        {
                            data.event_name
                        }
                    </Text>
                    <Text 
                    weight={500}
                    sx={(theme) =>({
                        color: theme.colors.gray[7]
                    })}>
                        {
                            data.contract_url
                        }
                    </Text>
                </Box>
            }
        </Box>
    )
}
export default Block;