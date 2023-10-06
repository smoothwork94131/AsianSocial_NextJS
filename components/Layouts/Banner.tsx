/* eslint-disable react-hooks/rules-of-hooks */

import { useMediaQuery } from '@mantine/hooks';

import {
    Menu,
    Flex,
    Text,
    Select,
    Avatar,
    Image,
    Box,
} from "@mantine/core"
import { IconDots } from "@tabler/icons-react";
import MyMenu from "@/components/Layouts/Menu";
import Auth from "@/components/Layouts/Auth";
import { useEffect, useState } from "react";
import Elements from "@/components/Layouts/Elements";
import { useRouter } from 'next/router';
import AuthModal from './AuthModal';
import { ItemType, ItemState, CityType } from '@/types/elements';
import InfoModal from '../Item/InfoModal';

const Banner = () => {
    const isMobile = useMediaQuery(`(max-width: 800px)`);
    const [screenWidth, setScreenWidth] = useState<number>(1400);
    const [authType, setAuthType] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [searchList, setSearchList] = useState<ItemType[]>([])
    const [selectedItem, setSelectedItem] = useState<ItemType>(ItemState);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    const [cities, setCities] = useState<CityType[]>([]);

    const router = useRouter();
    let is_homepage = false;

    if (Object.keys(router.query).length == 0) {
        is_homepage = true;
    }

    useEffect(() => {
        window.addEventListener('resize', function () {
            setWindow();
        });
        setWindow();
    }, []);

    // useEffect(() => {
    //     if(authType != ''){
    //         setOpen(true);
    //     }
    // }, [authType])

    useEffect(() => {
        if (search != "") {
            getSearchResult();
        }
    }, [search])

    useEffect(() => {
        if (selectedItem.id != "") {
            getTypes();
        }
    }, [selectedItem])

    const getSearchResult = async () => {
        const res = await fetch('/api/home/get_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search })
        });
        if (res.status == 200) {
            const data = await res.json();
            setSearchList(data);
        } else {
            setSearchList([]);
        }
    }

    const convertToSelectList = (data: ItemType[]) => {
        const converted: any = [];
        data.map((item: ItemType) => {
            converted.push({
                value: item.id,
                label: item.name
            })
        })
        return converted;
    }
    const setWindow = () => {
        setScreenWidth(window.innerWidth);
    }

    const getTypes = async () => {
        setCities([]);
        const res = await fetch('/api/user/profile/get_types', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                element_id: selectedItem.element_id
            }),
        })

        if (res.status == 200) {
            const data_ = await res.json();
            console.log(data_);
            setCities(data_.types);
        }
    }

    return (
        <Box>
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
                        <Image src='/logo.png' alt='logo' width={130} mt={5} onClick={() => { router.push('/') }} />
                    }
                    {
                        // is_homepage && 
                        screenWidth > 1370 && <Elements />
                    }
                    <Select
                        data={convertToSelectList(searchList)}
                        onChange={(value) => {
                            setInfoOpen(false);
                            const selected = searchList.filter((item) => item.id == value);
                            if (selected.length > 0) {
                                setSelectedItem(selected[0]);
                                setInfoOpen(true);
                            }
                        }}
                        placeholder="Search"
                        searchable
                        sx={(theme) => ({
                            width: screenWidth > 742 ? '500px' : `${screenWidth - 130}px`,
                        })}
                        onKeyUp={(event) => { setSearch(event.currentTarget.value) }}
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
                        screenWidth > 1370 &&
                        <Auth
                            setType={(type) => { setAuthType(type); setOpen(true) }}
                        />
                    }
                    {
                        screenWidth < 1370 &&
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
            <AuthModal opened={open} open={() => { setOpen(false) }} type={authType} setType={(type: string) => { setAuthType(type) }} />
            <InfoModal
                open={() => { setInfoOpen(p_o => (!p_o)) }}
                opened={infoOpen}
                data={selectedItem}
                isMobile={isMobile}
                cities={cities}
            />
        </Box>

    )
}

export default Banner;