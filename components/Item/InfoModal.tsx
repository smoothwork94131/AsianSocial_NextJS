import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Box, Grid, Image, Flex, LoadingOverlay } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Category, CategoryState, Collection, ElementState, ElementType, Item, PageType, PageTypeState } from '@/types/elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import Events from './Event';
import Service from './Service';
import { useRouter } from 'next/router';
import SaveItem from './SaveItem';
import AuthModal from '../Layouts/AuthModal';
import { useUser } from "@supabase/auth-helpers-react";
import { notifications } from '@mantine/notifications';

interface Props {
    opened: boolean,
    open: () => void
    data: Item,
    isMobile: boolean,
    getSaves?: () => void | undefined
    page_type?: string | undefined
}

const InfoModal: FC<Props> = ({ opened, open, data, isMobile, getSaves, page_type }) => {

    const [images, setImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [element, setElement] = useState<ElementType>(ElementState);
    const [pageType, setPageType] = useState<PageType>(PageTypeState);
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
    const [authType, setAuthType] = useState<string>('login');
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const router = useRouter();
    const user = useUser();

    useEffect(() => {

        if (data.id != "") {
            getImages();
            getCategory();
            getElement();
            getPageType();
            getCollections();
        }
    }, [data])

    useEffect(() => {

        if (user) {
            getCollections();
        }
    }, [user])

    const getCollections = async () => {
        if (user) {
            const res = await fetch('/api/item/get_collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            })
            if (res.status == 200) {
                const data_ = await res.json();
                setCollections(data_);
                setIsSaved(false);

                data_.map((collection: Collection) => {
                    if (collection.active_item_ids.includes(data.id)) {
                        setIsSaved(true);
                    }
                })
            } else {

            }
        }
    }

    const deleteCollection = async () => {
        if (user) {
            setIsLoad(true);
            const res = await fetch('/api/item/delete_collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    item_id: data.id
                })
            })
            if (res.status == 200) {
                notifications.show({
                    message: 'Success',
                    color: 'default'
                })
                getCollections();
                if (getSaves) {
                    getSaves();
                }
                setOpenSaveModal(false);
            } else {
                notifications.show({
                    message: 'Server Error!',
                    color: 'red'
                })
            }
            setIsLoad(false);
        } else {
            setOpenAuthModal(true);
        }

    }

    const createCollection = async (collection_name: string) => {
        setIsLoad(true);
        let image_url = getActiveCollection() ? '' : data.image;

        const res = await fetch('/api/item/create_collection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                collection_name,
                item_id: data.id,
                image_url,
                user_id: user?.id,
                active_item_ids: [data.id]
            })
        });

        if (res.status == 200) {
            getCollections();
            setOpenSaveModal(false);
        } else {
            alert("Server Error!");
        }
        setIsLoad(false);
    }

    const getActiveCollection = () => {
        let exist = false;
        collections.map((collection) => {
            if (collection.item_id == data.id && collection.active_item_ids.includes(data.id)) {
                exist = true;
            }
        })
        return exist;
    }

    const changeCollectionActive = async (collection: Collection) => {
        setIsLoad(true);
        const res = await fetch('/api/item/change_collection_active', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                collection_id: collection.id,
                user_id: user?.id,
                item_id: data.id,
                image_url: collection.image_url
            })
        });
        if (res.status == 200) {
            setOpenSaveModal(false);
            getCollections();
        } else {
            alert("Server Error!");
        }
        setIsLoad(false);
    }

    const getElement = async () => {
        const res = await fetch('/api/item/get_element', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                element_id: data.element_id
            })
        })

        if (res.status == 200) {
            const data_ = await res.json();
            setElement(data_);
        }
    }

    const getPageType = async () => {
        const res = await fetch('/api/item/get_page_types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type_id: data.page_type_id
            })
        })

        if (res.status == 200) {
            const data_ = await res.json();
            setPageType(data_);
        }
    }

    const getImages = async () => {
        setIsLoad(true);
        const res = await fetch('/api/admin/get_item_images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id: data.id
            })
        })

        if (res.status == 200) {
            const data_ = await res.json();
            setImages(data_);
        }
        setIsLoad(false);
    }

    const selectCategory = (category: Category) => {
        router.push(`/${element.name}/${category.name}`)
        open();
    }

    const saveItemModal = async () => {
        if (user) {
            setOpenSaveModal(true);
        } else {
            setOpenAuthModal(true);
        }
    }

    const getCategory = async () => {
        const res = await fetch('/api/item/get_categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                element_id: data.element_id
            })
        })

        if (res.status == 200) {
            const data_ = await res.json();
            setCategories(data_);
        }
    }

    const rederItemPage = () => {
        if (pageType.id == "") {
            return (
                <div></div>
            )
        }

        if (pageType.name == 'event') {
            return (
                <Events 
                    images={images}
                    isMobile={isMobile}
                    data={data}
                    categories={categories}
                    isLoad={isLoad}
                    selectCategory={selectCategory}
                    element_name={element.name}
                    open={open}
                    saveItemModal={saveItemModal}
                    isSaved={isSaved}
                />
            )
        } else if (pageType.name == 'service') {
            return (
                <Service
                    images={images}
                    isMobile={isMobile}
                    data={data}
                    categories={categories}
                    isLoad={isLoad}
                    selectCategory={selectCategory}
                    element_name={element.name}
                    open={open}
                    saveItemModal={saveItemModal}
                    isSaved={isSaved}

                />
            )
        } else {
            return (
                <Events
                    images={images}
                    isMobile={isMobile}
                    data={data}
                    categories={categories}
                    isLoad={isLoad}
                    selectCategory={selectCategory}
                    element_name={element.name}
                    open={open}
                    saveItemModal={saveItemModal}
                    isSaved={isSaved}
                />
            )
        }
    }

    return (
        <Box>
            <Modal opened={opened} onClose={open} fullScreen withCloseButton={false} p={0}>
                <Box
                    sx={(theme) => ({
                        position: 'absolute',
                        top: '90px',
                        left: '10px',
                        width: '50px',
                        height: '50px',
                        background: theme.colors.gray[6],
                        lineHeight: '50px',
                        borderRadius: '50px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        zIndex: 10000,
                        opacity: 0.5
                    })}
                    onClick={() => { open() }}
                >
                    <FontAwesomeIcon icon={faClose} color='white' style={{ fontSize: '25px', marginTop: '13px' }} />
                </Box>
                {/* <Events images={images} isMobile={isMobile} data={data} category={category} isLoad={isLoad}/> */}
                <Box pt={50}>
                    {
                        rederItemPage()
                    }
                </Box>
            </Modal>
            <Modal opened={openSaveModal} size={740} onClose={() => { setOpenSaveModal(false) }} centered withCloseButton={false} className="auth-modal" p={0}>
                <SaveItem
                    isMobile={isMobile}
                    data={data}
                    closeSaveModal={() => { setOpenSaveModal(false) }}
                    collections={collections}
                    changeCollectionActive={changeCollectionActive}
                    createCollection={createCollection}
                    deleteCollection={deleteCollection}
                    isSaved={isSaved}
                />
                <LoadingOverlay visible={isLoad} overlayBlur={2} />
            </Modal>
            <AuthModal type='login' open={() => { setOpenAuthModal(false) }} opened={openAuthModal} setType={(type) => { setAuthType(type) }} />
        </Box>
    );
}

export default InfoModal;