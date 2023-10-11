import { Box, Image as MantineImage, Text } from "@mantine/core";
import React, { FC, useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { ItemType, ItemState } from "@/types/elements";

interface Props {
    data: ItemType,
    getSaves?:() =>void;
    page_type?:string | undefined
    setSelectedItem: (item: ItemType) =>void
}

const Block:FC<Props> = ({
    data, 
    getSaves, 
    page_type, 
    setSelectedItem
}) => {
    const isMobile = useMediaQuery(`(max-width: 760px)`);
    
    const [imageExists, setImageExists] = useState<boolean>(false);
    
    const handleSelectItem = (item:ItemType) => {
        setSelectedItem(item);
    }

    useEffect(() => {
        if(data) {
            if(data.image === null) {
                setImageExists(false);
            }
            else {
                const img : HTMLImageElement  = new Image();
                img.onload = () => {
                    setImageExists(true);
                };
                img.onerror = () => {
                    setImageExists(false);
                };
                img.src = data.image;
            }
        }
    }, [data])

    return (
        data&&
        <Box>
            {
                data.image == null || imageExists == false ?
                <Box
                    sx={(theme) =>({
                        width: '100%',
                        // height: Math.floor(Math.random() * (250 - 0 + 1)) + 250,
                        height: Math.floor(Math.random() * 50) + 250,
                        // background: `rgb(
                        //         ${Math.floor(Math.random() * (255 )) + 0}, 
                        //         ${Math.floor(Math.random() * (255)) + 0},
                        //         ${Math.floor(Math.random() * (255)) + 0})`,
                        // '&:hover' :{
                        //     opacity: '0.7',
                        // },
                        backgroundImage: 'linear-gradient(180deg, gray, white)',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        border: '1px solid gray'
                    })}
                    onClick={() => {handleSelectItem(data)}}
                >
                </Box>
                :
                <MantineImage 
                    src={ data.image } 
                    alt='image' 
                    sx={(theme) =>({
                        '&:hover' :{
                            opacity: '0.7',
                        },
                        cursor: 'pointer',
                        border: `1px solid ${theme.colors.gray[4]}`,
                    })}
                    onClick={() => {handleSelectItem(data)}}
                    radius={7}
                />
            }
            {/* {
                <Box mt={10}>
                    <Text 
                    weight={isMobile?500:700}
                    size={isMobile?'13px': '19px'}
                    sx={(theme) =>({
                        color: theme.colors.gray[9],
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    })}>
                        {
                            data.name
                        }
                    </Text>
                    <Text 
                    weight={isMobile?300:500}
                    size={isMobile?'13px': '19px'}
                    sx={(theme) =>({
                        color: theme.colors.gray[7],
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    })}>
                        {
                            data.details
                        }
                    </Text>
                </Box>
            } */}
        </Box>
    )
}

export default Block;