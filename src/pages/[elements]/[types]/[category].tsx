import { Category, CategoryState, ElementState, ElementType, Item, ItemState, Types, TypesState } from '@/types/elements';
import {
    Box,
    Button,
    Loader,
    Text,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import Categories from '@/components/Element/Categories';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Block from '@/components/Home/Block';
import InfoModal from '@/components/Item/InfoModal';
import TypesComponents from '@/components/Element/Types';

const Elements = () => {

    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: 760px)`);

    let { elements: element_name, category: category_name, types: type_name } = router.query;

    if(category_name && typeof category_name == 'string'){
        category_name = category_name.replaceAll("_", "/");
    }

    if(element_name && typeof element_name == 'string'){
        element_name = element_name.replaceAll("_", "/");
    }

    if(type_name && typeof type_name == 'string'){
        type_name = type_name.replaceAll("_", "/");
    }
    
    console.log('---------------Router Query----------------');
    
    const [categories, setCatetories] = useState<Category[]>([]);
    const [element, setElement] = useState<ElementType>(ElementState);
    const [types, setTypes] = useState<Types[]>([]);

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [items, setItems] = useState<Item[]>([]);


    const [selectedItem, setSelectedItem] = useState<Item>(ItemState);
    const [ open, setOpen ] = useState<boolean>(false);

    
    useEffect(() => {
        setItems([]);
        setCatetories([]);
        setElement(ElementState);
        
        getElementData();
    }, [category_name, type_name])
    
    const getElementData = async () => {
        setIsLoad(true);
        const res = await fetch("/api/element/get_element_data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                element_name: element_name?.toString()?.replaceAll("_", " "),
                type_name
            })
        });
        if (res.status == 200) {
            const data = await res.json();
            
            setElement(data.element_data);
            setCatetories(data.categories);
            setTypes(data.types);
            
            if(type_name != "no") {
                if(data.types.length > 0) {
                    await getItems(
                        data.types.filter((item: Category) => item.name == type_name)[0].id
                    )
                }
            }
            
        } else {

        }
        setIsLoad(false);

    }


    const getItems = async (type_id: string) => {
        setIsLoad(true);
        const res = await fetch('/api/element/get_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type_id })
        })
        if (res.status == 200) {
            const data = await res.json();
            setItems(data);
        }
        setIsLoad(false);
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
                        element_name?.toString()?.replaceAll("_", " ")
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
                {
                    !isLoad&&<Box mt={30}>
                        {
                            category_name && type_name && element_name &&
                            <TypesComponents 
                                type_name={type_name}
                                types={types}
                                element_name={element_name}  
                                open={() => {setOpen(false)}}                  
                            />
                        }
                        
                    </Box>
                }
                
            </Box>
            {/* <Box>
                {
                    !isLoad&&<Box mt={30}>
                        {
                            category_name && type_name && element_name &&
                            <Categories 
                                categories={categories}
                                category_name={category_name}
                                type_name={type_name}
                                element_name={element_name}                    
                            />
                        }
                        
                    </Box>
                }
            </Box> */}
            {
                isLoad ?
                    <Box sx={(theme) => ({ textAlign: 'center' })}>
                        <Loader size={'lg'}/>
                    </Box> :
                    items.length == 0?
                    <Text size='3rem' align='center' mt={50} weight={500} color='gray'>
                        {/* No data */}
                    </Text>:
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{ 350: 2, 500: 3, 750: 3, 900: 4, 1550: 5, 1800: 6 }}
                        style={{ marginTop: '20px' }}
                    >
                        <Masonry>
                            {
                                items.map((item: Item, key: number) =>
                                    <Block key={key} data={item} setSelectedItem={(item: Item) => {setSelectedItem(item); setOpen(true)}}/>
                                )
                            }
                        </Masonry>
                    </ResponsiveMasonry>
            }

            <InfoModal 
                open={() => { setOpen(p_o => (!p_o)) }} 
                opened={open} 
                data={selectedItem} 
                isMobile={isMobile} 
                types={types}
            />
        </Box>
    )
}
export default Elements;

