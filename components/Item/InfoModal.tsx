import { FC, useEffect, useState, useContext } from 'react';
import { Modal, Box, LoadingOverlay } from '@mantine/core';
import { useUser } from "@supabase/auth-helpers-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons'

import { CollectionType, ItemType } from '@/types/elements';

import Events from '@/components/Item/Event';
import Service from '@/components/Item/Service';
import SaveItem from '@/components/Item/SaveItem';
import AuthModal from '@/components/Layouts/AuthModal';

import HomeContext from '@/state/index.context';

interface Props {
    opened: boolean,
    isMobile: boolean,
    data: ItemType,
    open: () => void
}

const InfoModal: FC<Props> = ({
    opened,
    isMobile, 
    data, 
    open,
}) => {
    const [images, setImages] = useState<any>([]);
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);
    const [openSaveModal, setOpenSaveModal] = useState<boolean>(false);
    const [authType, setAuthType] = useState<string>('login');
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const user = useUser();

    const {
        state: { user_profile },
    } = useContext(HomeContext);

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
        if (data?.asian_page_type?.name == "") {
            return (
                <div></div>
            )
        }

        if (data?.asian_page_type?.name == 'service') {
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
        }
        else if (data?.asian_page_type?.name == 'event') {
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
        else {
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
        let saved: boolean = false;
        if (data.id != "") {
            getImages();
            if (user && user_profile.id !== '' && user_profile.id !== null) {
                setCollections(user_profile.asian_collections);
                
                user_profile.asian_collections.map((collection: CollectionType) => {
                    if (collection?.active_item_ids.includes(data.id)) {
                        console.log(data.id)
                        console.log(user_profile);
                        console.log('-------------------');
                        saved = true
                        
                    }
                })
            }
        }
        setIsSaved(saved);
    }, [data, user_profile])

    return (
        <Box>
            <Modal 
                opened={opened} 
                onClose={open} 
                fullScreen 
                withCloseButton={false} 
                py={10}
            >
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
            <Modal 
                opened={openSaveModal} 
                size={740} 
                onClose={() => { setOpenSaveModal(false) }} 
                centered 
                withCloseButton={false} 
                className="auth-modal" 
                py={10}
            >
                <SaveItem
                    isMobile={isMobile}
                    collections={collections}
                    data={data}
                    isSaved={isSaved}
                    closeSaveModal={() => { setOpenSaveModal(false) }}
                />
            </Modal>
            <AuthModal 
                type='login' 
                open={() => { setOpenAuthModal(false) }}
                opened={openAuthModal} 
                setType={(type) => { setAuthType(type) }} 
            />
        </Box>
    );
}

export default InfoModal;