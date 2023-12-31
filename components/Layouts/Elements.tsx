import { useEffect, useState, useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import {
    Box,
    Button,
    Flex,
    Loader,
} from "@mantine/core"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

import HomeContext from '@/state/index.context';

const Elements = () => {

    const {
        state: { elements },
    } = useContext(HomeContext);
    
    const [isLoad, setIsLoad] = useState<boolean>(false);

    return (
        isLoad ?
        <Box
            sx={(theme) => ({
                width: '500px',
                textAlign: 'center'
            })}
        >
            <Loader size={'md'} variant="dots" />
        </Box> 
        :
        <Flex
            sx={(theme) => ({
                width: '500px',
                overflowY: 'hidden',

            })}
        >
            {/* <ScrollMenu
            LeftArrow={
                <LeftArrow />
            }
            RightArrow={
                <RightArrow />
            }
        > */}
            {
                elements.map((item, key) =>
                    <Box 
                        key={key} 
                        ml={5} 
                        sx={(theme) => ({})}
                    >
                        <Link href={`/${item.name}/${item.city_name}/${item.category_name}`}>
                            <Button
                                sx={(theme) => ({
                                    background: 'transparent',
                                    color: theme.colors.gray[6],
                                    '&:hover': {
                                        color: theme.colors.gray[8],
                                        background: 'transparent'
                                    },
                                    cursor: 'pointer',
                                    marginLeft: 20,
                                    padding: 0,
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold'
                                })}
                            >
                                {item.name}
                            </Button>
                        </Link>
                    </Box>
                )
            }
            {/* </ScrollMenu> */}
        </Flex>
    )
}

const LeftArrow = () => {
    const {
        isFirstItemVisible,
        scrollPrev,
        visibleElements,
        initComplete
    }: any = useContext(VisibilityContext);
    const [disabled, setDisabled] = useState(
        !initComplete || (initComplete && isFirstItemVisible)
    );
    useEffect(() => {
        if (visibleElements.length) {
            setDisabled(isFirstItemVisible);
        }
    }, [isFirstItemVisible, visibleElements]);
    return (
        <Box
            sx={(theme) => ({
                background: 'linear-gradient(to left, rgba(255,255,255,0.2), rgba(255,255,255,1))',
                position: 'relative',
                left: 20,
                zIndex: 100,
                padding: '5px 10px 0px 10px',
                cursor: 'pointer',
                visibility: disabled ? 'hidden' : 'visible'
            })}
            onClick={() => scrollPrev()}
        >
            <IconArrowLeft
                style={{ color: 'gray' }}
            />
        </Box>
    )
}

const RightArrow = () => {
    const {
        isLastItemVisible,
        scrollNext,
        visibleElements,
        initComplete
    }: any = useContext(VisibilityContext);

    const [disabled, setDisabled] = useState(
        !initComplete || (initComplete && isLastItemVisible)
    );
    useEffect(() => {
        // NOTE: detect if whole component visible
        if (visibleElements.length) {
            setDisabled(isLastItemVisible);
        }
    }, [isLastItemVisible, visibleElements]);

    return (
        <Box
            sx={(theme) => ({
                background: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,1))',
                position: 'relative',
                right: 20,
                zIndex: 100,
                padding: '5px 10px 0px 10px',
                cursor: 'pointer',
                visibility: disabled ? 'hidden' : 'visible'
            })}
            onClick={() => scrollNext()}
        >
            <IconArrowRight
                style={{ color: 'gray' }}
            />
        </Box>
    )
}

export default Elements;