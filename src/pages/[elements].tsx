import { Category, CategoryState, ElementState, ElementType, Item, ItemState } from '@/types/elements';
import {
    Box,
    Button,
    Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import Categories from '@/components/Element/Categories';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Block from '@/components/Home/Block';

const Elements = () => {

    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    const { elements: element_name } = router.query;

    const [categories, setCatetories] = useState<Category[]>([]);
    const [element, setElement] = useState<ElementType>(ElementState);
    
    const [isLoadElement, setIsLoadElement] = useState<boolean>(false);
    const [isLoadItems, setIsLoadItems] = useState<boolean>(false);
    const [items, setItems] = useState<Item[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<Category>(CategoryState);

    useEffect(() => {
        getElementData();
    }, [])
    
    const getElementData = async () => {
        setIsLoadElement(true);
        const res = await fetch("/api/element/get_element_data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: (element_name as string).replaceAll("_", " ") })
        });
        if (res.status == 200) {
            const data = await res.json();
            setElement(data.element_data);
            const _cate = [];
            for(let k = 0 ; k< 30 ; k++){
                _cate.push({name: 'Sustainable Architecture', element_id: '', id: k.toString()});
            }
            setCatetories(_cate);
            setSelectedCategory(_cate[0])
        } else {
            
        }
        setIsLoadElement(false);
    }

    useEffect(() =>{
        if(selectedCategory.id != ""){
            getItems();
        }
    }, [selectedCategory])

    const getItems = async() => {
        setIsLoadItems(true);
        const res = await fetch('/api/element/get_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_id: selectedCategory.id })
        })
        if(res.status == 200){
            
        }
        setIsLoadItems(false);
    }   

    return (
        <Box>
            <Box
                sx={(theme) => ({
                    margin: '2% 5%',
                    width: isMobile ? '90%' : '40%'
                })}
            >
                <Text size={isMobile ? 36 : 72} weight={600} sx={(theme) => ({
                    color: theme.colors.gray[8]
                })}>
                    {
                        (element_name as string)?.replaceAll("_", " ")
                    }
                </Text>
                <Text
                    size={18}
                    mt={24}
                    weight={450}
                    sx={(theme) => ({
                        color: theme.colors.gray[6]
                    })}
                >
                    {
                        element?.summary
                    }
                </Text>
            </Box>
            <Box>
                <Categories categories={categories} 
                    selectedCategory={selectedCategory} 
                    selectCategory={() => {}} />
            </Box>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 2, 500: 3, 750: 3, 900: 4, 1550: 5, 1800: 6}}
                style={{marginTop: '20px'}}
            >
                <Masonry>
                    {
                        items.map((item: Item, key: number) => 
                            <Block key={key} data={ item }/>
                        )
                    }
                </Masonry>
            </ResponsiveMasonry>
        </Box>
    )
}
export default Elements;
