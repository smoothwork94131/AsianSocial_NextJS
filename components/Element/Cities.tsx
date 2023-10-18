import { FC, useContext, useState, useEffect } from 'react';
import { Box, UnstyledButton, Menu, Group, Text, Button } from "@mantine/core";
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { useRouter } from "next/router";

import { CityType } from "@/types/elements";

interface Props {
    cities: CityType[],
    city_name: string  | string[] | undefined,
    element_name: string | string[] | undefined,
    open: () => void
}

const Cities: FC<Props> = ({
    cities,
    city_name,
    element_name,
    open
}) => {
    const isMobile = useMediaQuery(`(max-width: 760px)`);
    const router = useRouter();

    return (
        <Box
            style={{
                width: isMobile?'100%':'500px'
            }}
        >
            <Menu 
                withArrow
                // zIndex={1000000}
                withinPortal={true}
                // position={isMobile?'bottom':'right'}
            >
                <Menu.Target>
                    <Button
                        // sx={(theme) => ({
                        //     display: 'block',
                        //     width: '100%',
                        //     padding: theme.spacing.md,
                        //     color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                        //     '&:hover': {
                        //     backgroundColor:
                        //         theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
                        //     },
                        // })}
                        variant='white'
                        size='lg'
                    >
                        <Group>
                            <Text size="xl" weight={800}>
                                {
                                    city_name
                                }
                            </Text>
                            <IconChevronDown size="1.5rem" />
                        </Group>
                    </Button>
                </Menu.Target>
                <Menu.Dropdown 
                    sx={(theme) => ({
                        maxHeight: isMobile?'auto':'500px',
                        overflowY: 'auto'
                    })}
                >
                    {
                        cities.map((item, key) => 
                            <Menu.Item 
                                key={key}
                                onClick={() => {
                                    router.push(`/${element_name}/${item.name}/${item.category_name}`);
                                }}
                            >
                                {item.name}
                            </Menu.Item>
                        )
                    }
                </Menu.Dropdown>
            </Menu>
            {/* <Carousel
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
                    cities.map((item, key) =>
                    item.name&&
                    <Carousel.Slide key={key}>
                        <Button
                            radius={5}
                            sx={(theme) => ({
                                background: city_name == item.name?theme.colors.gray[3]:theme.colors.gray[1],
                                color: "black",
                                fontWeight: 600,
                                '&:hover': { background: theme.colors.gray[3]}
                            })}
                            onClick={() => {
                                router.push(`/${element_name}/${item.name}/${item.category_name}`)
                            }}
                        >
                            {item.name}
                        </Button>
                    </Carousel.Slide>
                    )
                }
            </Carousel> */}
        </Box>
    )
}

export default Cities;