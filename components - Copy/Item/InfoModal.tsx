import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Box, Grid, Image, Flex } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Category, CategoryState, ElementState, ElementType, Item } from '@/types/elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import Events from './Event';
import Service from './Service';
import { useRouter } from 'next/router';

interface Props {
    opened: boolean,
    open: () => void
    data: Item,
    isMobile: boolean
}

const InfoModal: FC<Props> = ({ opened, open, data, isMobile }) => {

    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [element, setElement] = useState<ElementType>(ElementState);

    const router = useRouter();

    useEffect(() => {
        if (data.id != "") {
            getImages();
            getCategory();
            getElement();
        }
    }, [data])

    const getElement = async() => {
        const res = await fetch('/api/item/get_element', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                element_id: data.element_id
            })
        })

        if (res.status == 200) {
            const data = await res.json();
            setElement(data);
        }
    }

    const getImages = async () => {
        setIsLoad(true);
        const res = await fetch('/api/admin/get_item_images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id: data.id
            })
        })

        if (res.status == 200) {
            const data = await res.json();
            setImages(data);
        }
        setIsLoad(false);
    }

    const selectCategory = (category: Category) => {
        window.location.href=`/${element.name}/${category.name}`;
    }

    const getCategory = async () => {
        const res = await fetch('/api/item/get_categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                element_id: data.element_id
            })
        })

        if (res.status == 200) {
            const data = await res.json();
            setCategories(data);
        }
    }

    const rederItemPage = () => {
        if(data.element_id == 'e56a96c2-9377-4638-9039-3abed4568b1f'){
            return (
                <Events images={images} isMobile={isMobile} data={data} categories={categories} isLoad={isLoad} selectCategory={selectCategory}/>
            )
        } else if(data.element_id == '2de204ae-9564-4400-b1ff-557bdb86e21d'){
            return (
                <Service images={images} isMobile={isMobile} data={data} categories={categories} isLoad={isLoad} selectCategory={selectCategory}/>
            )
        } else {
            return (
                <Events images={images} isMobile={isMobile} data={data} categories={categories} isLoad={isLoad} selectCategory={selectCategory}/>
            )
        }
    }
    
    return (
        <Modal opened={opened} onClose={open} fullScreen withCloseButton={false}  p={0}>
            <Box
                sx={(theme) => ({
                    position: 'absolute',
                    top: '20px',
                    left: '10px',
                    width: '50px',
                    height: '50px',
                    background: theme.colors.gray[6],
                    lineHeight: '50px',
                    borderRadius: '50px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    zIndex: 1000000,
                    opacity: 0.5
                })}
                onClick={() => { open() }}
            >
                <FontAwesomeIcon icon={faClose} color='white' style={{fontSize: '25px', marginTop: '13px'}}/>
            </Box>
            {/* <Events images={images} isMobile={isMobile} data={data} category={category} isLoad={isLoad}/> */}
            {
                rederItemPage()
            }
        </Modal>
    );
}

export default InfoModal;