import { FC, useEffect, useState, useContext } from "react";
import {
    Box,
    Button,
    Flex,
    Grid,
    Image,
    Text,
    TextInput,
    Textarea,
    UnstyledButton,
    NavLink,
    Input,
    Loader
} from "@mantine/core";
import { notifications } from '@mantine/notifications';
import { useUser } from "@supabase/auth-helpers-react";
import { IconCheck, IconMultiplier2x, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";

import { CollectionType, CollectionState, ItemType } from "@/types/elements";
import HomeContext from '@/state/index.context';

interface Props {
    isMobile: boolean,
    data: ItemType,
    isSaved: boolean,
    collections: Array<CollectionType>
    closeSaveModal: () => void
}

const SaveItem: FC<Props> = ({
    isMobile,
    data,
    isSaved,
    collections,
    closeSaveModal
}) => {

    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [websites, setWebsites] = useState<string>('');
    const [describe, setDescribe] = useState<string>('');
    
    const [isCreateCollection, setIsCreateCollection] = useState<boolean>(false);
    const [collectionInput, setCollectionInput] = useState<string>('');
    
    const [selCollection, setSelCollection] = useState<CollectionType>(CollectionState);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);
    
    const user = useUser();

    const {
        state: { user_profile },
        dispatch: homeDispatch
    } = useContext(HomeContext);

    const deleteCollection = async () => {
        if (user) {
            setIsLoad(true);
            const res = await fetch('/api/item/delete_collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    collection_id: selCollection.id,
                })
            })
            if (res.status == 200) {
                const data = await res.json();
                homeDispatch({
                    field: 'user_profile',
                    value: {...user_profile, ...{asian_collections: data }}
                });

            } else {
                notifications.show({
                    message: 'Server Error!',
                    color: 'red'
                })
            }
            setIsLoad(false);
        }
    }

    const createCollection = async (collection_name: string) => {
        let flag = false
        collections.map((collection : CollectionType) => {
            let active_item_ids = collection?.active_item_ids;
            if(active_item_ids.includes(data.id)) {
                notifications.show({
                    message: 'This Item has been already stored in another collection.',
                    color: 'red'
                })
                flag = true;
                return;
            }
        })

        if(!flag) {
            setIsLoad(true);
            const res = await fetch('/api/item/create_collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection_name,
                    item_id: data.id,
                    image_url: data.image,
                    user_id: user?.id,
                    active_item_ids: [data.id]
                })
            });

            if (res.status == 200) {
                const data = await res.json();
                const current_collections = user_profile.asian_collections;
                current_collections.push(data[0]);
                
                homeDispatch({
                    field: 'user_profile',
                    value: {...user_profile, ...{asian_collections: current_collections }}
                })
            } else {
                notifications.show({
                    message: 'Server Error!',
                    color: 'red'
                })
            }
            setIsLoad(false);
        }
    }
    
    const saveCollection = async (collection: CollectionType) => {
        if(selCollection.id === null || selCollection.id === '') {
            notifications.show({
                message: 'You have to choose collection which will save this item.',
                color: 'red'
            });
            return;
        }

        let active_item_ids = collection?.active_item_ids;
        if(active_item_ids.includes(data.id)) {
            notifications.show({
                message: 'This is collection which this item has been already saved!',
                color: 'red'
            })
        }
        else {
            setIsLoad(true);
            const res = await fetch('/api/item/save_collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection_id: collection.id,
                    user_id: user?.id,
                    item_id: data.id,
                })
            });

            if(res.status == 200) {
                const data = await res.json();
                homeDispatch({
                    field: 'user_profile',
                    value: {...user_profile, ...{asian_collections: data }}
                });
            }
            else {
                const message = await res.json();
                notifications.show({
                    message: message.msg,
                    color: 'red'
                });
            }
            setIsLoad(false);
        }
    }

    useEffect(() => {
        let filtered_collections:CollectionType[] = collections.filter((item) => item.name.indexOf(search) > -1);
        setFilteredCollections(filtered_collections);
    }, [search]);

    useEffect(() => {
        console.log(collections);
        collections.map((collection : CollectionType) => {
            let active_item_ids = collection?.active_item_ids;
            if(active_item_ids.includes(data.id)) {
                setSelCollection(collection);
                return;
            }
        })
    }, [])
    
    return (
        data &&
        <Box 
        sx={(theme) => ({
            height: '535px',
        })}>
            {
                isLoad ? 
                <Box sx={(theme) => ({ textAlign: 'center' })}>
                    <Loader size={'lg'}/>
                </Box>
                :
                <>
                    {
                    confirmDelete ?
                    <Flex
                        align={'center'}
                        justify={'center'}
                        pt={230}
                    >
                        <Box>
                            <Text color="gray" size={'1.5rem'} weight={600}>
                                Sure you want to delete this?
                            </Text>
                            <Flex
                                gap={'md'}
                                justify={'center'}
                                mt={15}
                            >
                                <UnstyledButton onClick={() => {
                                    setConfirmDelete(false);
                                }}
                                    style={{fontWeight: 'bold'}}
                                >
                                    Cancel
                                </UnstyledButton>
                                <Button onClick={() => {
                                    deleteCollection()
                                }}>
                                    Delete
                                </Button>
                            </Flex>
                        </Box>
                    </Flex> 
                    :
                    <Grid gutter={0}>
                    {
                        !isMobile &&
                        <Grid.Col md={6} lg={6} sm={0}>
                            <Box
                                sx={(theme) => ({
                                    background: theme.colors.gray[3],
                                    verticalAlign: 'middle',
                                    height: '535px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                })}
                            >
                                <Image src={data.image} alt="" width={230} />
                            </Box>
                        </Grid.Col>
                    }
                        <Grid.Col md={6} lg={6} sm={0}>
                            <Box p={15}>
                                <Text size={'lg'} weight={'bold'} align="center">
                                    Save to Collection
                                </Text>
                                <Flex
                                    mt={20}
                                    gap='md'
                                    direction='column'
                                >
                                    <Textarea
                                        placeholder="Describe this"
                                        value={data.details?data.details:''}
                                        disabled
                                    />
                                    <TextInput
                                        placeholder="Web Sites"
                                        value={data.sites_url}
                                        disabled
                                    />
                                    <TextInput
                                        placeholder="Search..."
                                        icon={<IconSearch />}
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.currentTarget.value)
                                        }}
                                    />
                                    <Box
                                        sx={(theme) => ({
                                            maxHeight: '200px',
                                            overflow: 'auto'
                                        })}
                                    >
                                        <Text size={'sm'} color="gray" weight='bold'>
                                            Saved to
                                        </Text>
                                        <Box>
                                        {
                                            filteredCollections.map((collection: CollectionType, key: number) =>
                                                <NavLink
                                                    key={key}
                                                    label={
                                                        <Text 
                                                            weight='bold' 
                                                            color={
                                                                selCollection.id == collection.id?'white':'gray'
                                                            }
                                                        >
                                                            {collection.name}
                                                        </Text>
                                                    }
                                                    icon={
                                                        <Image src={collection.image_url} alt="" width={40} height={40} />
                                                    }
                                                    onClick={() => {
                                                        setSelCollection(collection);
                                                    }}
                                                    variant='filled'
                                                    active={selCollection.id == collection.id ? true : false}
                                                />
                                            )
                                        }
                                        </Box>
                                    </Box>
                                    <Box mt={20}>
                                    {
                                        isCreateCollection ?
                                        <Flex 
                                            gap='sm'
                                            direction={'row'}
                                            align={'center'}
                                            justify={"space-between"}
                                        >
                                            <Button 
                                                p={6} 
                                                onClick={() => { setIsCreateCollection(false) }}
                                                style={{
                                                    width: '10%'
                                                }}
                                            >
                                                <IconTrash />
                                            </Button>
                                            <Input
                                                placeholder="Create a collection"
                                                value={collectionInput}
                                                onChange={(event) => { 
                                                    setCollectionInput(event.currentTarget.value) 
                                                }}
                                                style={{ width: '80%' }}
                                            />
                                            <Button 
                                                p={6} 
                                                onClick={() => { createCollection(collectionInput) }}
                                                style={{
                                                    width: '10%'
                                                }}
                                            >
                                                <IconCheck />
                                            </Button>
                                        </Flex>
                                        :
                                        <NavLink
                                            onClick={() => {setIsCreateCollection(true)}}
                                            label={
                                                <Text weight='bold' color="gray">
                                                    Create a collection
                                                </Text>
                                            }
                                            icon={
                                                <IconPlus enableBackground={'blue'}/>
                                            }
                                        />
                                    }
                                    </Box>
                                </Flex>
                                {
                                    <Box
                                        sx={(theme) => ({
                                            position: 'absolute',
                                            bottom: '0px',
                                            padding: '15px',
                                            width: '300px'
                                        })}
                                    >
                                        <Flex
                                            justify='space-between'
                                            align={'center'}
                                        >
                                            {
                                                selCollection.id && 
                                                <IconTrash size={17} style={{ cursor: 'pointer' }} onClick={() => {
                                                    setConfirmDelete(true)
                                                }} />
                                            }
                                            <Flex gap={'sm'}>
                                                <UnstyledButton
                                                    onClick={() => { closeSaveModal() }}
                                                >
                                                    <Text weight={'bold'}>
                                                        Cancel
                                                    </Text>
                                                </UnstyledButton>
                                                <Button
                                                    onClick={() => {
                                                        saveCollection(selCollection)
                                                    }}>
                                                    Save
                                                </Button>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                }
                            </Box>
                        </Grid.Col>
                    </Grid>
                }
                </>
            }
        </Box>
    )
}

export default SaveItem;