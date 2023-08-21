import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Box, Grid, Image, Flex } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Category, CategoryState, Item } from '@/types/elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import Events from './Event';
import Service from './Service';

interface Props {
    opened: boolean,
    open: () => void
    data: Item,
    isMobile: boolean
}

const InfoModal: FC<Props> = ({ opened, open, data, isMobile }) => {

    const [images, setImages] = useState<string[]>([]);
    const [category, setCategory] = useState<Category>(CategoryState);
    const [isLoad, setIsLoad] = useState<boolean>(false)
    useEffect(() => {
        if (data.id != "") {
            getImages();
            getCategory();
        }
    }, [data])

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

    const getCategory = async () => {
        const res = await fetch('/api/item/get_category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category_id: data.category_id
            })
        })

        if (res.status == 200) {
            const data = await res.json();
            setCategory(data);
        }
    }

    const rederItemPage = () => {
        if(data.element_id == 'e56a96c2-9377-4638-9039-3abed4568b1f'){
            return (
                <Events images={images} isMobile={isMobile} data={data} category={category} isLoad={isLoad}/>
            )
        } else if(data.element_id == '2de204ae-9564-4400-b1ff-557bdb86e21d'){
            return (
                <Service images={images} isMobile={isMobile} data={data} category={category} isLoad={isLoad}/>
            )
        } else {
            return (
                <Events images={images} isMobile={isMobile} data={data} category={category} isLoad={isLoad}/>
            )
        }
    }
    
    return (
        <Modal opened={opened} onClose={open} fullScreen withCloseButton={false}>
            <Box
                sx={(theme) => ({
                    position: 'absolute',
                    top: '15px',
                    left: '10px',
                    width: '30px',
                    height: '30px',
                    background: theme.colors.gray[6],
                    lineHeight: '30px',
                    borderRadius: '30px',
                    textAlign: 'center',
                    cursor: 'pointer'
                })}
                onClick={() => { open() }}
            >
                <FontAwesomeIcon icon={faClose} color='white' />
            </Box>
            {/* <Events images={images} isMobile={isMobile} data={data} category={category} isLoad={isLoad}/> */}
            {
                rederItemPage()
            }
        </Modal>
    );
}

export default InfoModal;