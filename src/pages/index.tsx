import { Box, Image, Loader } from "@mantine/core";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Block from "@/components/Home/Block";
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Item, ItemState } from "@/types/elements";
import InfoModal from "@/components/Item/InfoModal";

const Home = () => {

    const isMobile = useMediaQuery(`(max-width: 760px)`);
    const [items, setItems] = useState<Item[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item>(ItemState);
    const [ open, setOpen ] = useState<boolean>(false);


    let baseItem: Item[] = [];
    useEffect(() => {
        getItems();
        window.addEventListener('scroll', handleScroll);
    }, [])
    
    function handleScroll() {
        if(isLoad) return;
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
             setIsLoad(true);
            const merged = items;
            const cnt = baseItem.length > 8?8:baseItem.length;
            for (let k = 0; k < cnt; k++) {
                merged.push(baseItem[baseItem.length - k - 1])
            }
            setItems(merged)
        } else {
            setIsLoad(false);
            return;
        }
    }

    useEffect(() => {
        if(isLoad){
            setIsLoad(false);
        }
    }, [items])
    
    const getItems = async () => {
        setIsLoad(true);
        const res = await fetch('/api/home/get_items');
        if (res.status == 200) {
            const data = await res.json();
            setItems(data);
            baseItem = data;
        }
        setIsLoad(false);
    }

    return (

        <Box>
            <Box pb={'30px'}>
                <ResponsiveMasonry
                    columnsCountBreakPoints={{ 350: 3, 500: 3, 750: 3, 900: 4 }}
                >
                    <Masonry>
                        {
                            items.map((item: Item, key) =>
                                <Block data={item} key={key} setSelectedItem={(item: Item) => {setSelectedItem(item); setOpen(true)}}/>
                            )
                        }
                    </Masonry>
                </ResponsiveMasonry>
            </Box>
            {
                isLoad && <Box
                    pt={20}
                    sx={(theme) => ({
                        textAlign: 'center',
                        position: "fixed",
                        bottom: '20px',
                        left: '48%',
                        zIndex: 10000000
                    })}>
                    <Loader size='lg' />
                </Box>
            }
            <InfoModal open={() => { setOpen(p_o => (!p_o)) }} opened={open} data={selectedItem} isMobile={isMobile} />
        </Box>
    )
}

export default Home;