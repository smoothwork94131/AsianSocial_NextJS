import { IconDots } from '@tabler/icons-react';

import {
    Avatar,
    Box,
    Menu
} from "@mantine/core"
// import { ELEMENTS, MENU } from '@/utils/app/consts';
import Auth from '@/components/Layouts/Auth';
import { FC, useState, useEffect } from 'react';
import { ElementType } from '@/types/elements';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthModal from './AuthModal';

interface Props {
    isMobile: boolean
}

const MyMenu:FC<Props> = ({
    isMobile
}) => {

    const router = useRouter();
    const [ elements, setElements] = useState<ElementType[]>([]);
    const [authType, setAuthType] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        getElements();
    }, [])

    const getElements = async() => {
        const res = await fetch('/api/home/get_elements');
        if(res.status == 200){
            const data = await res.json();
            setElements(data);
        }
    }
    useEffect(() => {
        if(authType != ''){
            setOpen(true);
        }
    }, [authType])

    return (    
        <Box>
            <Menu.Dropdown>
                <Auth setType={(type: string) => { setAuthType(type)}}/>
                {
                    elements.map((item, key) =>
                        <Menu.Item key={key} onClick={() => { router.push(`/${item.name}/0`)}}>{item.name}</Menu.Item>
                    )
                }
            </Menu.Dropdown>
            <AuthModal opened={open} open={() => { setOpen(false)}} type={authType} setType={(type: string) => {setAuthType(type)}}/>
        </Box>
    )
}

export default MyMenu;