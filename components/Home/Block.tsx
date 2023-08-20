import { Box, Image, Text } from "@mantine/core";
import { FC, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Item, ItemState } from "@/types/elements";
import InfoModal from "@/components/Item/InfoModal";

interface Props {
    data: Item,
}

const Block:FC<Props> = ({data}) => {
    const isMobile = useMediaQuery(`(max-width: 760px)`);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ selectedItem, setSelectedItem ] = useState<Item>(ItemState);

    const handleSelectItem = (item:Item) => {
        setOpen(true);
        setSelectedItem(item);
    }

    return (
        <Box
            p={10}
            
        >
            <Image 
                src={ data.image } alt='image' 
                sx={(theme) =>({
                    '&:hover' :{
                        opacity: '0.7',
                    },
                    cursor: 'pointer',
                    border: `1px solid ${theme.colors.gray[4]}`,
                })}
                onClick={() => {handleSelectItem(data)}}
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
                            data.name
                        }
                    </Text>
                    <Text 
                    weight={500}
                    sx={(theme) =>({
                        color: theme.colors.gray[7]
                    })}>
                        {
                            data.sites_url
                        }
                    </Text>
                </Box>
            }
            <InfoModal open={() => { setOpen(p_o => (!p_o)) }} opened={open} data={selectedItem} isMobile={isMobile}/>
        </Box>
    )
}
export default Block;