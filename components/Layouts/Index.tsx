import { FC, useState } from 'react';
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
import MainHeader from './Header';


interface Props {
    children: JSX.Element,
}

const Index:FC<Props>= ({children}) => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            footer={
                <Footer height={60} p="md">
                    Application footer
                </Footer>
            }
            header={
                <Header height={{ base: 110, md: 110 }} p="md">
                    <MainHeader />
                </Header>
            }
        >
            <Text>{children}</Text>
        </AppShell>
    );
}

export default Index;