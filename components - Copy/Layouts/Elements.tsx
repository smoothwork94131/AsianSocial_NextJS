import { ElementType } from "@/types/elements";
import {
    Box,
    Button,
    Flex,
    Text,
    UnstyledButton
} from "@mantine/core"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { useRouter } from 'next/router';

const Elements = () => {

    const [elements, setElements] = useState<ElementType[]>([])
    const router = useRouter();

    useEffect(() => {
        getElements();
    }, [])
    
    const getElements = async () => {
        const res = await fetch('/api/home/get_elements');
        if (res.status == 200) {
            const data = await res.json();
            setElements(data);
        }
    }

    return (
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
                        <Box key={key} ml={5} sx={(theme) => ({
                        })}>
                            <Button
                                onClick={() => { router.push(`/${item.name}/0`)}}
                                sx={(theme) => ({
                                    background: 'transparent',
                                    color: theme.colors.gray[6],
                                    '&:hover': {
                                        color: theme.colors.gray[8],
                                        background:'transparent'
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
        // NOTE: detect if whole component visible
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
                visibility: disabled?'hidden':'visible'
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
                visibility: disabled?'hidden':'visible'
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