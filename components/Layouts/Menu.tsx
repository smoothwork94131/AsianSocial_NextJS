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

interface Props {
    isMobile: boolean
}

const MyMenu:FC<Props> = ({
    isMobile
}) => {
    
    const [ elements, setElements] = useState<ElementType[]>([]);
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

    return (    
        <Box>
            <Menu.Dropdown>
                <Auth />

                {
                    elements.map((item, key) =>
                        <Menu.Item key={key}>{item.name}</Menu.Item>
                    )
                }
            </Menu.Dropdown>
        </Box>
        
    )
}

export default MyMenu;