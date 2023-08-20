import { ADMIN_MENU } from "@/utils/app/consts";
import { 
    Box,
    NavLink,
    Text
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from 'next/router';

const AdminNavbar = () => {
    const router = useRouter();
    const {pathname} = router;

    return (
        <Box>
            <Text size='log' p={10} weight={900}>
                Admin Pannel
            </Text>
            {
                ADMIN_MENU.map((item, key) => 
                    <Link
                        key={key}
                        href={`/admin/${item.url}`}
                    >
                        <NavLink 
                            label={item.name} variant="filled" 
                            active={pathname.indexOf(item.url) > -1 ? true:false}
                            rightSection={<IconChevronRight  size="0.8rem" stroke={1.5} />}
                        > 
                        </NavLink>
                    </Link>
                )
            }
        </Box>
    )
}
export default AdminNavbar;