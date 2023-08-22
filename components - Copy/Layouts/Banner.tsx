/* eslint-disable react-hooks/rules-of-hooks */

import { useMediaQuery } from '@mantine/hooks';

import {
    Menu,
    Flex,
    Text,
    Select,
    Avatar,
    Image,
} from "@mantine/core"
import { IconDots } from "@tabler/icons-react";
import MyMenu from "@/components/Layouts/Menu";
import Auth from "@/components/Layouts/Auth";
import { useEffect, useState } from "react";
import Elements from "@/components/Layouts/Elements";
import { useRouter } from 'next/router';

const Banner = () => {
    const isMobile = useMediaQuery(`(max-width: 800px)`);
    const [screenWidth, setScreenWidth] = useState<number>(1400);

    const router = useRouter();
    let is_homepage = false;
    
    if(Object.keys(router.query).length == 0) {
        is_homepage = true;
    }
    useEffect(() => {
        window.addEventListener('resize', function () {
            setWindow();
        });
        setWindow();
    }, []);

    const setWindow = () => {
        setScreenWidth(window.innerWidth);
    }
    return (
        <Flex
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
    >
            <Flex
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
            >
                {
                    screenWidth > 742 &&
                    // <Text
                    //     size='1.5rem'
                    //     weight='600'
                    //     onClick={() => { router.push('/')}}
                    //     style={{cursor: 'pointer'}}
                    // >
                    //     AsianSocial
                    // </Text>
                    <Image src='/logo.png' alt='logo' width={130} mt={5} onClick={() => { router.push('/')}}/>
                }
                {
                    screenWidth > 1360 && is_homepage && <Elements />
                }
                <Select
                    data={[
                        // { value: 'React', label: 'React' },
                        // { value: 'Angular', label: 'Angular' },
                        // { value: 'Svelte', label: 'Svelte' },
                        // { value: 'Vue', label: 'Vue' },
                    ]}
                    placeholder="Search"
                    searchable
                    sx={(theme) => ({
                        width: screenWidth > 742 ? '500px' : `${screenWidth - 130}px`,
                    })}
                />
            </Flex>
            <Flex
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
            >
                {
                    screenWidth > 1360 &&
                    <Auth />
                }
                {
                    screenWidth < 1360 &&
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
                }
            </Flex>
        </Flex>
    )
}

export default Banner;