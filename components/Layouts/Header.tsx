import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/router';

import {
    Menu,
    Flex,
    Text,
    Select,
    Avatar,
    Image,
    Box,
} from "@mantine/core"
import { useMediaQuery } from '@mantine/hooks';
import { IconDots } from "@tabler/icons-react";

import MyMenu from "@/components/Layouts/Menu";
import Elements from "@/components/Layouts/Elements";
import AuthModal from '@/components/Layouts/AuthModal';
import InfoModal from '@/components/Item/InfoModal';

import { ItemType, ItemState, CityType } from '@/types/elements';
import HomeContext from '@/state/index.context';

const MainHeader = () => {
    const isMobile = useMediaQuery(`(max-width: 800px)`);
    const [screenWidth, setScreenWidth] = useState<number>(1400);
    const [authType, setAuthType] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [searchList, setSearchList] = useState<ItemType[]>([])
    const [selectedItem, setSelectedItem] = useState<ItemType>(ItemState);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);

    const router = useRouter();
    
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
        window.addEventListener('resize', function () {
            setWindow();
        });
        setWindow();
    }, []);

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
                    <MyMenu
                        setType={(type) => { setAuthType(type); setOpen(true) }}
                        isMobile={isMobile}
                    />
                </Flex>
            </Flex>
            <AuthModal opened={open} open={() => { setOpen(false) }} type={authType} setType={(type: string) => { setAuthType(type) }} />
            <InfoModal
                open={() => { setInfoOpen(p_o => (!p_o)) }}
                opened={infoOpen}
                data={selectedItem}
                isMobile={isMobile}
            />
        </Box>
    )
}

export default MainHeader;