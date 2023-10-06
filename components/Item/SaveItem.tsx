import { CollectionType, CollectionState, ItemType } from "@/types/elements";
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
    Input
} from "@mantine/core";
import { IconCheck, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";

interface Props {
    isMobile: boolean,
    data: ItemType,
    closeSaveModal: () => void,
    collections: CollectionType[],
    changeCollectionActive: (collection: CollectionType) => void,
    createCollection: (collection_name: string) => void
    deleteCollection: () => void,
    isSaved: boolean
}

const SaveItem: FC<Props> = ({
    isMobile,
    data,
    closeSaveModal,
    collections,
    createCollection,
    changeCollectionActive,
    deleteCollection,
    isSaved
}) => {

    console.log('-------------------Is saved--------------------')
    console.log(isSaved);

    const [isCreateCollection, setIsCreateCollection] = useState<boolean>(false);
    const [collectionInput, setCollectionInput] = useState<string>('');
    const [websites, setWebsites] = useState<string>('');
    const [describe, setDescribe] = useState<string>('');
    const [selCollection, setSelCollection] = useState<CollectionType>(CollectionState);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [filteredCollections, setFilteredCollections] = useState<CollectionType[]>([]);

    useEffect(() => {
        collections.map((collection) => {
            if (collection.active_item_ids.includes(data.id)) {
                setSelCollection(collection);
            }
        });
        filterCollections();
    }, [])

    useEffect(() => {
        filterCollections();
    }, [search])

    const filterCollections = () => {
        const filtered_collections:CollectionType[] = collections.filter((item) => item.name.indexOf(search) > -1);
        setFilteredCollections(filtered_collections);
    }
    
    return (
        data &&
        <Box sx={(theme) => ({
            height: '535px',
        })}>
            {
                confirmDelete ?
                    <Flex
                        align={'center'}
                        justify={'center'}
                        pt={230}
                    >
                        <Box>
                            <Text color="gray" size={'1.5rem'} weight={600}>Sure you want to delete this?</Text>
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
                    </Flex> :
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
                                        value={data.details}
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
                                                collections.map((collection: CollectionType, key: number) =>
                                                    data.id == collection.item_id && isSaved &&
                                                    <NavLink
                                                        key={key}
                                                        label={
                                                            <Text weight='bold' color={
                                                                selCollection.id == collection.id?'white':'gray'
                                                            }>
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
                                            {
                                                isCreateCollection ?
                                                    <Flex gap='sm'>
                                                        <Input
                                                            placeholder="Create a collection"
                                                            value={collectionInput}
                                                            onChange={(event) => { setCollectionInput(event.currentTarget.value) }}
                                                            rightSection={
                                                                <Button p={6} onClick={() => { createCollection(collectionInput) }}>
                                                                    <IconCheck />
                                                                </Button>
                                                            }
                                                            style={{ width: '100%' }}
                                                        />
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
                                                            <Button style={{ padding: '6px' }}><IconPlus 
                                                                
                                                            /></Button>
                                                        }

                                                    />
                                            }
                                        </Box>
                                        <Text size={'sm'} color="gray" weight='bold'>
                                            all
                                        </Text>
                                        {
                                            
                                            filteredCollections.map((collection: CollectionType, key: number) =>
                                                <NavLink
                                                    key={key}
                                                    label={
                                                        <Text weight='bold' color={
                                                            selCollection.id == collection.id?'white':'gray'
                                                        }>
                                                            {collection.name}
                                                        </Text>
                                                    }
                                                    icon={
                                                        <Image src={collection.image_url} alt="" width={40} height={40} />
                                                    }
                                                    active={selCollection.id == collection.id ? true : false}
                                                    variant="filled"
                                                    onClick={() => {
                                                        setSelCollection(collection);
                                                    }}
                                                />
                                            )
                                        }
                                    </Box>
                                </Flex>
                                {
                                   isSaved &&
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
                                            <IconTrash size={17} style={{ cursor: 'pointer' }} onClick={() => {
                                                setConfirmDelete(true)
                                            }} />
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
                                                        changeCollectionActive(selCollection)
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

        </Box>
    )
}

export default SaveItem;