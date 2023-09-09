import { Box, Button } from "@mantine/core";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Category } from "@/types/elements";
import { FC, useContext, useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
    categories: Category[],
    category_name: string | string[],
    type_name: string  | string[],
    element_name: string | string[]
}

const Categories: FC<Props> = ({
    categories,
    type_name,
    category_name,
    element_name
}) => {
    
    return (
        <Box>
            <ScrollMenu
                LeftArrow={
                    <LeftArrow />
                }
                RightArrow={
                    <RightArrow />
                }
            >
                {
                    categories.map((item, key) =>
                        item.name&&
                        <Box key={key} ml={5} sx={(theme) => ({
                        })}>
                            
                            <Link href={`/${element_name}/${type_name}/${item.name.replaceAll('/','_')}`}>
                                <Button
                                    radius={10}
                                    sx={(theme) => ({
                                        background: category_name == item.name?theme.colors.gray[3]:theme.colors.gray[1],
                                        color: "black",
                                        fontWeight: 600,
                                        '&:hover': { background: theme.colors.gray[3]}
                                    })}
                                >
                                    {item.name}
                                </Button>
                            </Link>
                        </Box>
                    )
                }
            </ScrollMenu>
        </Box>
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
        !disabled&&<Box
            sx={(theme) => ({
                background: 'linear-gradient(to left, rgba(255,255,255,0.2), rgba(255,255,255,1))',
                position: 'relative',
                left: 10,
                zIndex: 100,
                padding: '5px 10px 0px 10px',
                cursor: 'pointer'
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
        !disabled&&<Box
            sx={(theme) => ({
                background: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,1))',
                position: 'relative',
                right: 10,
                zIndex: 100,
                padding: '5px 10px 0px 10px',
                cursor: 'pointer'
            })}
            onClick={() => scrollNext()}
        >
            <IconArrowRight
                style={{ color: 'gray' }}
            />
        </Box>
    )
}
export default Categories;