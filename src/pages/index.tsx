import {  useEffect, useState, useCallback, useRef } from 'react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Box, Image, Loader } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';

import { ItemType, ItemState } from "@/types/elements";

import InfoModal from "@/components/Item/InfoModal";
import Block from "@/components/Home/Block";

const Home = () => {

    const isMobile = useMediaQuery(`(max-width: 760px)`);
    const [items, setItems] = useState<ItemType[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ItemType>(ItemState);
    const [ open, setOpen ] = useState<boolean>(false);
    const [loadCount, setLoadCount] = useState<number>(0);
    
    function handleScroll() {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight) {
            setLoadCount(originCount => originCount + 1);
        } else {
            return;
        }
    }
    
    const getItems = async () => {
        setIsLoad(true);

        const res = await fetch('/api/home/get_items', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                loadCount: loadCount
            })
        });

        if (res.status == 200) {
            const data = await res.json();
            const _items: ItemType[] = [];
            let cnt = 0;
            let data_length = data.length;
            while(true) {
                if(cnt === 100 || data_length === 0) {
                    break;
                }

                let index = Math.floor(Math.random() * data_length);
                _items.push(data[index]);
                data.splice(index, 1);
                cnt++;
                data_length--;
            }
            setItems(originItems => originItems.concat(_items));
        }
        
        
        setIsLoad(false);
    }
    
    useEffect(() => {
        if(isLoad == true) {
            return;
        }
        getItems();
    }, [loadCount]);

   useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box>
            {
                isLoad ? 
                <Box
                    pt={20}
                    sx={(theme) => ({
                        textAlign: 'center',
                        position: "fixed",
                        top: '30%',
                        left: '48%',
                        zIndex: 10000000
                    })}>
                    <Loader size='lg' />
                </Box>
                :
                <ResponsiveMasonry
                    columnsCountBreakPoints={{ 350: 2, 500: 3, 750: 4, 900: 5, 1550: 6 }}
                >
                    <Masonry gutter='10px'>
                    {
                        items.map((item: ItemType, key) =>
                            <Block data={item} key={key} setSelectedItem={(item: ItemType) => {setSelectedItem(item); setOpen(true)}}/>
                        )
                    }
                    </Masonry>
                </ResponsiveMasonry>
            }
            <InfoModal
                opened={open} 
                isMobile={isMobile}
                data={selectedItem}
                open={() => { setOpen(p_o => (!p_o)) }} 
            />
        </Box>
    )
}

export default Home;