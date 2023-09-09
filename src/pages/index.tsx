import { Box, Image, Loader } from "@mantine/core";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Block from "@/components/Home/Block";
import { useMediaQuery } from '@mantine/hooks';
import {  useEffect, useState } from 'react';
import { Item, ItemState, Types, ElementState, ElementType } from "@/types/elements";
import InfoModal from "@/components/Item/InfoModal";

const Home = () => {

    const isMobile = useMediaQuery(`(max-width: 760px)`);
    const [items, setItems] = useState<Item[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<Item>(ItemState);
    const [ open, setOpen ] = useState<boolean>(false);
    const [element, setElement] = useState<ElementType>(ElementState);
    const [types, setTypes] = useState<Types[]>([]);
    const [loadCount, setLoadCount] = useState<number>(0);

    let baseItem: Item[] = [];
    useEffect(() => {
        getItems();
        // window.addEventListener('scroll', handleScroll);
    }, [])

    const getTypes = async () => {
        setTypes([]);
        const res = await fetch('/api/user/profile/get_types', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                element_id: selectedItem.element_id
            }),
        })

        if(res.status == 200){
            const data_ = await res.json();
            setElement(data_.element_data);
            setTypes(data_.types);
        }
    }
    
    function handleScroll() {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            //  setIsLoad(true);
            const merged = items;
            const cnt = baseItem.length > 30?30:baseItem.length;
            for (let k = 0; k < cnt; k++) {
                merged.push(baseItem[k])
            }
            setItems(merged);
            console.log(merged);
        } else {
            return;
        }
    }
    

    const getItems = async () => {
        setIsLoad(true);
        const res = await fetch('/api/home/get_items');
        if (res.status == 200) {
            const data = await res.json();
            const _items: Item[] = [];
            let cnt = 0;
            let index = 0;
            while(true) {
                if(cnt === 1000) {
                    break;
                }
                if(index > data.length -1){
                    index=0;
                } 
                _items.push(data[index]);
                cnt++;
                index++;
            }
            setItems(_items);
            // for(let k=0; k<100; k++){
            //     for(let j=0; j<data.length; j++){
            //         _items.push(data[j]);
            //     }
            // }

            baseItem = data;
        }
        setIsLoad(false);
    }
    
    useEffect(() => {
        if(selectedItem.id !=""){
            getTypes();
        }
    }, [selectedItem])

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
            <div className={`${loadCount}`}>
                
            </div>
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
            <InfoModal 
                open={() => { setOpen(p_o => (!p_o)) }} 
                opened={open} data={selectedItem}
                isMobile={isMobile} 
                types={types}
            />
        </Box>
    )
}

export default Home;