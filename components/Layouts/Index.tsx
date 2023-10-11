import { FC, useEffect, useState, useContext } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme,
} from '@mantine/core';
import { useRouter } from 'next/router';

import MainHeader from '@/components/Layouts/Header';
import AdminNavbar from '@/components/Admin/AdminNavbar';

import HomeContext from '@/state/index.context';

interface Props {
    children: JSX.Element,
}

const Index: FC<Props> = ({ children }) => {

    const theme = useMantineTheme();
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const {
        state: { elements },
        dispatch: homeDispatch
    } = useContext(HomeContext);

    useEffect(() => {
        const { pathname } = router;
        if (pathname.indexOf('/admin') > -1) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, [router.query])

    useEffect(() => {
        getElements();
    }, [])

    const getElements = async () => {
        const res = await fetch('/api/home/get_elements');
        if (res.status == 200) {
            const data = await res.json();
            homeDispatch({
                field: 'elements',
                value: data
            })
        }
    }

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : '#fff',
                    paddingTop: 80,
                    width: '100%'
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            // footer={
            //     <Footer height={60} p="md">
            //         Application footer
            //     </Footer>
            // }
            
            navbar={
                isAdmin ? 
                <Navbar pt="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    <AdminNavbar closeNavbar={() =>{setOpened((o) => !o)}}/>
                </Navbar> : <></>
            }

            header={
                <Header height={{ base: 70, md: 70 }} p="md" style={{zIndex: !isAdmin?10000:10}}>
                    {
                        isAdmin&&
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>   
                    }
                    { !isAdmin&&<MainHeader />}
                </Header>
            }
        >
            <Text>{children}</Text>
        </AppShell>
    );
}

export default Index;