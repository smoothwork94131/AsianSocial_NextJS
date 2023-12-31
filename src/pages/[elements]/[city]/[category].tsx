import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,    
    Loader,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { ElementType, ElementState, CityType, CityState, CategoryType, CategoryState, ItemType, ItemState } from '@/types/elements';

import Categories from '@/components/Element/Categories';
import Block from '@/components/Home/Block';
import InfoModal from '@/components/Item/InfoModal';
import Cities from '@/components/Element/Cities';

const Elements = () => {

    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    let { elements: element_name, city: city_name, category: category_name } = router.query;

    if(element_name && typeof element_name == 'string'){
        element_name = element_name.replaceAll("_", "/");
    }

    if(city_name && typeof city_name == 'string'){
        city_name = city_name.replaceAll("_", "/");
    }

    if(category_name && typeof category_name == 'string'){
        category_name = category_name.replaceAll("_", "/");
    }
        
    const [element, setElement] = useState<ElementType>(ElementState);
    const [cities, setCities] = useState<CityType[]>([]);
    const [categories, setCatetories] = useState<CategoryType[]>([]);

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [items, setItems] = useState<ItemType[]>([]);

    const [selectedItem, setSelectedItem] = useState<ItemType>(ItemState);
    const [ open, setOpen ] = useState<boolean>(false);

    const getElementData = async () => {
        setIsLoad(true);
        const res = await fetch("/api/element/get_element_data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                element_name: element_name?.toString()?.replaceAll("_", " "),
                city_name: city_name,
                category_name: category_name
            })
        });
        
        if (res.status == 200) {
            const data = await res.json();

            setElement(data.element_data);
            setCities(data.cities);
            setCatetories(data.categories);
            setItems(data.items);
        }
        setIsLoad(false);
    }

    useEffect(() => {
        setItems([]);
        setCatetories([]);
        setElement(ElementState);
        
        getElementData();
    }, [element_name, city_name, category_name])

    return (
        <Box
            mt={20}
        >
            <Box
                sx={(theme) => ({
                    width: isMobile ? '100%' : '40%'
                })}
            >
                <Box>
                    <Flex
                        direction='row'
                        align='center'
                        justify={isMobile?'center':'flex-start'}
                    >
                        <Text 
                            size={22} 
                            weight={800} 
                            sx={(theme) => ({
                                color: theme.colors.gray[8]
                            })}
                        >
                            {
                                element_name?.toString()?.replaceAll("_", " ") + " in"
                            }
                        </Text>
                        {
                            !isLoad&&
                            <Box>
                                {
                                    element_name && city_name && category_name &&
                                    <Cities
                                        city_name={city_name}
                                        element_name={element_name}  
                                        cities={cities}
                                        open={() => {setOpen(false)}}                  
                                    />
                                }   
                            </Box>
                        }
                    </Flex>
                </Box>
                <Box>
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
            </Box>
            <Box>
                {
                    !isLoad&&
                    <Box 
                        my={30}
                    >
                        {
                            element_name && city_name && category_name &&
                            <Categories
                                category_name={category_name}
                                city_name={city_name}
                                element_name={element_name}                    
                                categories={categories}
                            />
                        }
                    </Box>
                }
            </Box>
            {
                isLoad ?
                <Box sx={(theme) => ({ textAlign: 'center' })}>
                    <Loader size={'lg'}/>
                </Box> 
                :
                items.length == 0?
                    <Text size='3rem' align='center' mt={50} weight={500} color='gray'>
                        {/* No data */}
                    </Text>
                    :
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 350: 2, 500: 3, 750: 4, 900: 5, 1550: 6 }}
                        style={{ marginTop: '20px' }}
                    >
                        <Masonry gutter='10px'>
                            {
                                items.map((item: ItemType, key: number) =>
                                    <Block 
                                        key={key} 
                                        data={item} 
                                        setSelectedItem={(item: ItemType) => {
                                            setSelectedItem(item); 
                                            setOpen(true);
                                        }}
                                    />
                                )
                            }
                        </Masonry>
                    </ResponsiveMasonry>
            }
            <InfoModal
                opened={open}
                data={selectedItem}
                isMobile={isMobile}
                open={() => { setOpen(p_o => (!p_o)) }} 
            />
        </Box>
    )
}

export default Elements;