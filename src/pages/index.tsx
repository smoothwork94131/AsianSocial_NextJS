import { Image } from "@mantine/core";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Block from "@/components/Home/Block";
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Item } from "@/types/elements";

const Home = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);

    useEffect(() => {
        
    }, [])
    
    const getItems = async() => {
        const res = await fetch('/api/home/get_items');
        if(res.status == 200){
            const data = await res.json();
            setItems(data);        
        }
    }

    return (
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 3, 500: 3, 750: 3, 900: 4}}
            >
                <Masonry>
                    
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}

export default Home;