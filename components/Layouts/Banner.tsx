/* eslint-disable react-hooks/rules-of-hooks */

import { MENU } from "@/utils/app/consts";
import { useMediaQuery } from '@mantine/hooks';

import {
    Menu,
    Flex,
    Text,
    Select,
    Button,
    Avatar,
    Box
} from "@mantine/core"
import { IconDots } from "@tabler/icons-react";
import MyMenu from "@/components/Layouts/Menu";
import Auth from "@/components/Layouts/Auth";
import { useEffect, useState } from "react";

const Banner = () => {
    const isMobile = useMediaQuery(`(max-width: 800px)`);
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        window.addEventListener('resize', function() {
            setScreenWidth(window.innerWidth);
        });
    }, []);
    return (
        <Flex
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
        >
            {
                screenWidth > 470&&
                <Text
                    size='1.5rem'
                    weight='600'
                >
                    AsianSocial
                </Text>
            }
            <Select
                data={[
                    { value: 'React', label: 'React' },
                    { value: 'Angular', label: 'Angular' },
                    { value: 'Svelte', label: 'Svelte' },
                    { value: 'Vue', label: 'Vue' },
                ]}
                placeholder="Search"
                searchable
                // nothingFound="No"
                width='80%'
            />
            
            <Flex
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
            >
                {
                    MENU.map((item, key) =>
                        item.show_desktop && !isMobile && <Text
                            key={key}
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
                            {item.name}
                        </Text>
                    )
                }
                {
                    !isMobile&&
                    <Auth />
                }
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Avatar
                            color="gray" radius="xl"
                            style={{ cursor: 'pointer' }}
                        >
                            <IconDots />
                        </Avatar>
                    </Menu.Target>
                    <MyMenu 
                        isMobile={isMobile}
                    />
                </Menu>
            </Flex>
        </Flex>
    )
}

export default Banner;