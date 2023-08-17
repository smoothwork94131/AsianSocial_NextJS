import { IconDots } from '@tabler/icons-react';

import {
    Avatar,
    Box,
    Menu
} from "@mantine/core"
import { ELEMENTS, MENU } from '@/utils/app/consts';
import Auth from '@/components/Layouts/Auth';
import { FC } from 'react';

interface Props {
    isMobile: boolean
}

const MyMenu:FC<Props> = ({
    isMobile
}) => {
    return (
        <Box>
            <Menu.Dropdown>
                <Auth />

                {
                    ELEMENTS.map((item, key) =>
                        <Menu.Item key={key}>{item.name}</Menu.Item>
                    )
                }
            </Menu.Dropdown>
        </Box>
        
    )
}

export default MyMenu;