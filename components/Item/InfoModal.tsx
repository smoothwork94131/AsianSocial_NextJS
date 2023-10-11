import { FC, useEffect, useState } from 'react';
import { Modal, Box, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useUser } from "@supabase/auth-helpers-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'

import { CollectionType, ItemType } from '@/types/elements';

import Events from '@/components/Item/Event';
import Service from '@/components/Item/Service';
import SaveItem from '@/components/Item/SaveItem';
import AuthModal from '@/components/Layouts/AuthModal';

interface Props {
    opened: boolean,
    isMobile: boolean,
    data: ItemType,
    open: () => void
    getSaves?: () => void | undefined,
}

const InfoModal: FC<Props> = ({
    opened,
    isMobile, 
    data, 
    open,
    getSaves, 
}) => {
    const [images, setImages] = useState<any>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
    const [authType, setAuthType] = useState<string>('login');
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const user = useUser();

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

                data_.map((collection: CollectionType) => {
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
    
    const changeCollectionActive = async (collection: CollectionType) => {
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

    const saveItemModal = async () => {
        if (user) {
            setOpenSaveModal(true);
        } else {
            setOpenAuthModal(true);
        }
    }

    const rederItemPage = () => {
        console.log(data);
        if (data?.asian_page_type?.name == "") {
            return (
                <div></div>
            )
        }

        if (data?.asian_page_type?.name == 'event') {
            return (
                <Events 
                    images={images}
                    isMobile={isMobile}
                    data={data}
                    isLoad={isLoad}
                    open={open}
                    saveItemModal={saveItemModal}
                    isSaved={isSaved}
                />
            )
        } else if (data?.asian_page_type?.name == 'service') {
            return (
                <Service
                    images={images}
                    isMobile={isMobile}
                    data={data}
                    isLoad={isLoad}
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
                    isLoad={isLoad}
                    open={open}
                    saveItemModal={saveItemModal}
                    isSaved={isSaved}
                />
            )
        }
    }

    useEffect(() => {
        if (user) {
            getCollections();
        }
    }, [user])

    useEffect(() => {
        if (data.id != "") {
            getImages();
            getCollections();
        }
    }, [data])
    
    return (
        <Box>
            <Modal opened={opened} onClose={open} fullScreen withCloseButton={false} py={10}>
                <Box
                    sx={(theme) => ({
                        position: 'absolute',
                        top: '90px',
                        left: '20px',
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
                <Box pt={50} pb={50}>
                    {
                        rederItemPage()
                    }
                </Box>
            </Modal>
            <Modal opened={openSaveModal} size={740} onClose={() => { setOpenSaveModal(false) }} centered withCloseButton={false} className="auth-modal" py={10}>
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