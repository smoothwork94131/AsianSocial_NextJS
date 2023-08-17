import { IconDots } from '@tabler/icons-react';

import {
    Avatar,
    Box,
    Menu
} from "@mantine/core"
import { MENU } from '@/utils/app/consts';
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
                {
                    isMobile&&<Auth />
                }
                {
                    MENU.map((item, key) =>
                        ((!item.show_desktop && !isMobile) || isMobile)&&
                            <Menu.Item key={key}>{item.name}</Menu.Item>
                    )
                }
            </Menu.Dropdown>
        </Box>
        
    )
}

export default MyMenu;