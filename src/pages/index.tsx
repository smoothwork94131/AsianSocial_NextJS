import { Box, Image, Loader } from "@mantine/core";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Block from "@/components/Home/Block";
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Item } from "@/types/elements";
import InfoModal from "@/components/Item/InfoModal";

const Home = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    let baseItem:Item[] = [];
    useEffect(() => {
        getItems();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    function handleScroll() {
        setIsLoad(true);
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ) {
            setIsLoad(false);
            return;
        }

        const merged = items;
        for(let k=0; k<baseItem.length; k++){
            merged.push(baseItem[baseItem.length-k-1])
        }
        
        setTimeout(function() {
            setIsLoad(false);
            setItems(merged);
        }, 1000)    
    }
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
                                <Block data={item} key={key} />
                            )
                        }
                    </Masonry>
                </ResponsiveMasonry>
            </Box>
            {
                    isLoad&&<Box
                        pt={20}
                        sx={(theme) => ({
                            textAlign: 'center',
                            position: "fixed",
                            bottom: '20px',
                            left: '48%',
                            zIndex: 10000000
                        })}>
                        <Loader size='lg'/>
                    </Box> 
            }
        </Box>
    )
}

export default Home;