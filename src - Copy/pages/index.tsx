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

    useEffect(() => {
        getItems();
    }, [])

    const getItems = async () => {
        setIsLoad(true);
        const res = await fetch('/api/home/get_items');
        if (res.status == 200) {
            const data = await res.json();
            setItems(data);
        }
        setIsLoad(false);
    }

    return (
        isLoad ?
            <Box
                pt={20}
                sx={(theme) => ({
                    textAlign: 'center',

                })}>
                <Loader variant="dots" />
            </Box> :
            <Box>
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
    )
}

export default Home;