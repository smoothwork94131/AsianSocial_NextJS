import { FC, useContext, useState, useEffect } from 'react';
import { Box, Button, Text } from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from "next/router";

import { CategoryType } from "@/types/elements";

interface Props {
    category_name: string | string[],
    city_name: string  | string[],
    element_name: string | string[]
    categories: CategoryType[],
}

const Categories: FC<Props> = ({
    city_name,
    category_name,
    element_name,
    categories
}) => {
    const isMobile = useMediaQuery(`(max-width: 760px)`);
    const router = useRouter();

    return (
        <Box
            sx={(theme) =>({
                
            })}
        >
            <Carousel
                slideSize="50px"
                slideGap="md"
                align="start"
                slidesToScroll={isMobile?1:3}
                styles={{
                    control: {
                        '&[data-inactive]': {
                            opacity: 0,
                            cursor: 'default',
                        },
                    },
                }}
                // breakpoints={[
                //     { maxWidth: 'lg', slideSize: '25%' },
                //     { maxWidth: 'md', slideSize: '50%' },
                //     { maxWidth: 'sm', slideSize: '50px', slideGap: 10 },
                // ]}
            >
                {
                    categories.map((item, key) =>
                    item.name&&
                    <Carousel.Slide key={key}>
                        <Button
                            radius={5}
                            sx={(theme) => ({
                                background: category_name == item.name?theme.colors.gray[3]:theme.colors.gray[1],
                                color: "black",
                                fontWeight: 600,
                                '&:hover': { background: theme.colors.gray[3]}
                            })}
                            onClick={() => {
                                router.push(`/${element_name}/${city_name}/${item.name.replaceAll('/','_')}`)
                            }}
                        >
                            {item.name}
                        </Button>
                    </Carousel.Slide>
                    )
                }
            </Carousel>
        </Box>
    )
}

export default Categories;