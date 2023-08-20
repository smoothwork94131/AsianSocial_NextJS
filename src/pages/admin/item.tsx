import { Box, Button, Flex, Loader, Modal, TextInput, Textarea, Select, Accordion, Grid, Text, Image } from "@mantine/core";
import { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { Category, ElementState, ElementType, Item, ItemState, PageType } from "@/types/elements";
import { IconEdit, IconPhoto, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import GoogleMapReact from 'google-map-react';
import { Dropzone } from '@mantine/dropzone';
import { setFlagsFromString } from "v8";

const Item = () => {
    const [elements, setElements] = useState<ElementType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [opened, { open, close }] = useDisclosure(false);
    const [type, setType] = useState<string>('add');
    const [selectedId, setSelectedId] = useState<string>('');
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [selectedElementId, setSelectedElementId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [items, setItems] = useState<Item[]>([]);
    const [pageTypes, setPageTypes] = useState<PageType[]>([]);
    const [selectedPageTypeId, setSelectedPageTypeId] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            phone_number: '',
            sites_url: '',
            address: '',
            details: '',
            geo_lon: '',
            geo_lati: '',
            image: '',
        },
    });

    useEffect(() => {
        getElements();
        getPageTypes();
    }, [])

    useEffect(() => {
        if (selectedElementId != "") {
            getCategories();
        }
    }, [selectedElementId])

    useEffect(() => {
        getItems();
    }, [selectedCategoryId])


    const initMap = () => {

    }

    const getItems = async () => {
        setIsLoad(true);
        const res = await fetch('/api/admin/get_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_id: selectedCategoryId })
        })
        if (res.status == 200) {
            const data = await res.json();
            setItems(data);
        } else {

        }
        setIsLoad(false);
    }

    const getPageTypes = async () => {
        const res = await fetch('/api/admin/get_page_types')
        if (res.status == 200) {
            const data = await res.json();
            setPageTypes(data);
            if (data.length > 0) {
                setSelectedPageTypeId(data[0].id)
            } else {
                setSelectedPageTypeId('');
            }
        }
    }

    const getCategories = async () => {
        const res = await fetch('/api/admin/get_categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ element_id: selectedElementId })
        })
        if (res.status == 200) {
            const data = await res.json();
            setCategories(data);
            if (data.length > 0) {
                setSelectedCategoryId(data[0].id)
            } else {
                setSelectedCategoryId('');
            }
        }
    }

    const deleteItem = async () => {

    }

    const editItem = async () => {

        if(images.length != 3) {
            notifications.show({
                title: `Invalide`,
                message: 'You must add 3 images.',
                color: 'red'
            });
            return;
        }
        
        setIsLoad(true);
        close();
        if (selectedCategoryId == '' || selectedElementId == '' || selectedPageTypeId == '') {
            notifications.show({
                title: 'Invalide',
                message: 'Please Element, Category or Page type',
                color: 'red'
            });
            return;
        }
        const params = {
            ...form.values, ...{
                category_id: selectedCategoryId,
                page_type_id: selectedPageTypeId,
                element_id: selectedElementId
            }
        };

        const res = await fetch('/api/admin/edit_item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, params, id: selectedItemId })
        })

        if (res.status == 200) {
            const data = await res.json();
            const item_id = data.item_id;
            for (let k = 0; k < images.length; k++) {
                const image = images[k];
                const res = await fetch('/api/admin/add_item_images', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image, item_id: item_id })
                })
                if (res.status == 200) {
                    notifications.show({
                        title: `Upload detail image->${k + 1}`,
                        message: 'success',
                        color: 'default'
                    });
                } else {
                    notifications.show({
                        title: `Upload detail images`,
                        message: 'error',
                        color: 'red'
                    });
                }
            }

            notifications.show({
                title: `${type} item`,
                message: 'Success!',
                color: 'default'
            });

            getItems();
        } else {
            notifications.show({
                title: `${type} item`,
                message: 'Error!',
                color: 'red'
            });
        }
        setIsLoad(false);
    }

    const getElements = async () => {
        setIsLoad(true);
        const res = await fetch('/api/admin/get_elements');
        if (res.status == 200) {
            const data = await res.json();
            setElements(data);
            if (data.length > 0) {
                setSelectedElementId(data[0].id);
            }
        }
        setIsLoad(false);
    }

    const parsedElements = () => {
        const parsed_elements: {
            value: string,
            label: string
        }[] = [];
        elements.map((item) => {
            parsed_elements.push({
                value: item.id,
                label: item.name
            })
        })
        return parsed_elements;
    }

    const parsedCategories = () => {
        const parsed_categories: {
            value: string,
            label: string
        }[] = [];
        categories.map((item) => {
            parsed_categories.push({
                value: item.id,
                label: item.name
            })
        })
        return parsed_categories;
    }

    const parsedPageTypes = () => {
        const page_types: {
            value: string,
            label: string
        }[] = [];
        pageTypes.map((item) => {
            page_types.push({
                value: item.id,
                label: item.name
            })
        })
        return page_types;
    }

    const addModal = async () => {
        open();
        setType('add');
        form.setFieldValue('image', '');
        form.setFieldValue('geo_lati', '');
        form.setFieldValue('geo_lon', '');
        form.setFieldValue('sites_url', '');
        form.setFieldValue('name', '');
        form.setFieldValue('details', '');
        form.setFieldValue('address', '');
        form.setFieldValue('phone_number', '');
        form.setFieldValue('image', '');
        form.setFieldValue('email', '');

        setImages([])
    }

    const editModal = async (item: Item) => {
        setIsLoad(true);
        open();
        setType('edit');
        setSelectedItemId(item.id);
        setSelectedCategoryId(item.category_id);
        setSelectedElementId(item.element_id);
        form.setFieldValue('image', item.image);
        form.setFieldValue('geo_lati', item.geo_lati);
        form.setFieldValue('geo_lon', item.geo_lon);
        form.setFieldValue('sites_url', '');
        form.setFieldValue('name', item.name);
        form.setFieldValue('email', item.email);
        form.setFieldValue('details', item.details);
        form.setFieldValue('address', item.address);
        form.setFieldValue('phone_number', item.phone_number);
        const res = await fetch('/api/admin/get_item_images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_id: item.id })
        })
        if(res.status == 200){
            const data = await res.json();
            setImages(data);
        }

        setIsLoad(false);
    }

    const defaultProps = {
        center: {
            lat: 44.900209366013954,
            lng: -102.56077483176705
        },
        zoom: 11
    };

    const convertToBase64 = async (file: File) => {

        const readAsDataURL = (file: File) => {
            return new Promise((resolve, reject) => {
                const FR = new FileReader();

                FR.addEventListener("load", function (evt) {
                    const event = evt as ProgressEvent<FileReader>; // Casting evt to ProgressEvent<FileReader>

                    if (event.target && typeof event.target.result === "string") { // Adding type check for result property
                        const target = event.target as FileReader & {
                            result: string; // Specify the correct type for result property
                        };
                        resolve(target.result);
                    } else {
                        reject(new Error("Invalid file format"));
                    }
                });

                FR.onerror = () => {
                    reject(new Error("Failed to read file"));
                };

                FR.readAsDataURL(file);
            });
        };

        const result = await readAsDataURL(file);
        return result;
    }

    const setDetailImages = async (files: File[]) => {
        const _images: any = [];
        if (images.length + files.length > 3) {
            notifications.show({
                title: 'Invalide',
                message: 'The number of images must not exceed 3.',
                color: 'red'
            })
            return;
        }
        for (let k = 0; k < files.length; k++) {
            try {
                const result = await convertToBase64(files[k]);
                _images.push(result);
            } catch (error) {
                console.error(error);
            }
        }
        setImages(_images);
    }

    const getItemImages = async () => {

    }

    const setCategoryImage = async (files: File[]) => {
        if (files.length > 1) {
            notifications.show({
                title: 'Invalide',
                message: 'The number of category images must not exceed 1.',
                color: 'red'
            })
            return;
        }
        if (files.length > 0) {
            try {
                const result = await convertToBase64(files[0]) as string; // Type assertion
                form.setFieldValue('image', result);
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <Box>
            <Flex
                gap="md"
            >
                <Select
                    label="Elements"
                    data={parsedElements()}
                    searchable
                    onChange={(value) => { setSelectedElementId(value ?? '') }}
                    value={selectedElementId}
                    nothingFound='No Elements'
                />
                <Select
                    label="Categories"
                    data={parsedCategories()}
                    searchable
                    onChange={(value) => { setSelectedElementId(value ?? '') }}
                    value={selectedCategoryId}
                    nothingFound='No Categories'
                />
                <TextInput
                    placeholder="Search"
                    mt={25}
                    value={search}
                    onChange={(event) => { setSearch(event.currentTarget.value) }}
                />
                <Button variant="outline" mt={25} onClick={() => { addModal() }}>
                    Add New Item
                </Button>
            </Flex>
            <Table mt={20} >
                <thead>
                    <tr>
                        <th style={{ width: '10%' }} >No</th>
                        <th style={{ width: '15%' }} >Name</th>
                        <th style={{ width: '20%' }} align="left">Email</th>
                        <th style={{ width: '20%' }} align="left">Sites url</th>
                        <th style={{ width: '20%' }} align="left">Address</th>
                        <th style={{ width: '5%' }} align="left">Image</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        isLoad ? <tr><td colSpan={5} align="center"><Loader variant="dots" /></td></tr> :
                            items.length == 0 ? <tr><td colSpan={5} align="center">No Matched Data</td></tr> :
                                items.map((item: Item, key) =>
                                    <tr key={key} style={{ cursor: 'pointer' }} onClick={() => { editModal(item) }}>
                                        <td>{key + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.sites_url}</td>
                                        <td>{item.address}</td>
                                        <td><Image src={item.image} alt="image" /></td>
                                    </tr>
                                )
                    }
                </tbody>
            </Table>
            <Modal opened={opened} onClose={close} title="Category" fullScreen>
                {isLoad ? <div style={{ textAlign: 'center' }}><Loader variant="dots" /></div> :
                    <Box>
                        <Grid>
                            <Grid.Col lg={4} md={3} sm={1}>
                                <Select
                                    label="Elements"
                                    data={parsedElements()}
                                    searchable
                                    value={selectedElementId}
                                    onChange={(value) => { setSelectedElementId(value ?? '') }}
                                    nothingFound="No matched elements"
                                />
                            </Grid.Col>
                            <Grid.Col lg={4} md={3} sm={1}>
                                <Select
                                    label="Categories"
                                    data={parsedCategories()}
                                    searchable
                                    value={selectedCategoryId}
                                    nothingFound="No matched categories"
                                />
                            </Grid.Col>
                            <Grid.Col lg={4} md={3} sm={1}>
                                <Select
                                    label="Page types"
                                    data={parsedPageTypes()}
                                    searchable
                                    value={selectedPageTypeId}
                                    nothingFound="No matched page types"
                                    onChange={(value) => { setSelectedPageTypeId(value ?? '') }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={4} md={3} sm={1}>
                                <TextInput
                                    label="Name"
                                    required
                                    value={form.values.name}
                                    onChange={(event) => { form.setFieldValue('name', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={4} md={3} sm={1}>
                                <TextInput
                                    label="email"
                                    required
                                    value={form.values.email}
                                    onChange={(event) => { form.setFieldValue('email', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={4} md={3} sm={1}>
                                <TextInput
                                    label="Phone number"
                                    required
                                    value={form.values.phone_number}
                                    onChange={(event) => { form.setFieldValue('phone_number', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={6} md={6} sm={1}>
                                <TextInput
                                    label="Sites url"
                                    required
                                    value={form.values.sites_url}
                                    onChange={(event) => { form.setFieldValue('sites_url', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={6} md={6} sm={1}>
                                <TextInput
                                    label="Address"
                                    required
                                    value={form.values.address}
                                    onChange={(event) => { form.setFieldValue('address', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={12} md={12} sm={12}>
                                <Textarea
                                    label="Details"
                                    required
                                    value={form.values.details}
                                    onChange={(event) => { form.setFieldValue('details', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={6} md={6} sm={12}>
                                <TextInput
                                    label="Longitude"
                                    required
                                    value={form.values.geo_lon}
                                    onChange={(event) => { form.setFieldValue('geo_lon', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                            <Grid.Col lg={6} md={6} sm={12}>
                                <TextInput
                                    label="Latitude"
                                    required
                                    value={form.values.geo_lati}
                                    onChange={(event) => { form.setFieldValue('geo_lati', event.currentTarget.value) }}
                                />
                            </Grid.Col>
                        </Grid>
                        <Text size='lg' mt={15}>
                            Uploading <b>Category</b> Image
                        </Text>
                        <Text align="right" color="red" size='log'>
                            {
                                form.values.image != "" ? <Button color="red" variant="outline" onClick={() =>{ form.setFieldValue('image', '') }}>Delete Category Image</Button> : ''
                            }
                        </Text>
                        <Grid>
                            {
                                <Grid.Col sm={1} md={3} lg={3}>
                                    {
                                        form.values.image != "" ? <Image src={form.values.image} alt='image' /> : <></>
                                    }
                                </Grid.Col>
                            }
                        </Grid>
                        {
                            form.values.image == "" ?
                                <Dropzone
                                    accept={{
                                        'image/*': [], // All images
                                        'text/html': ['.png', '.jpg'],
                                    }}
                                    onDrop={(files) => { setCategoryImage(files) }}
                                >
                                    <Flex
                                        justify='center'
                                        align='center'
                                        h={200}
                                    >
                                        <Box>
                                            <Dropzone.Idle>
                                                <IconPhoto size="3.2rem" stroke={1.5} color="#666666" />
                                            </Dropzone.Idle>
                                            <Text size="xl" inline>
                                                Drage a image here or click to select file ( jpg )
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Dropzone> : <></>
                        }

                        <Text size='lg' m={15}>
                            Uploading <b>Detail</b> Images
                        </Text>

                        <Text align="right" color="red" size='log'>
                            {
                                images.length > 0 ? <Button color="red" variant="outline" onClick={() =>{setImages([])}}>Delete Detail Images</Button> : ''
                            }
                        </Text>
                        <Grid>
                            {
                                images.map((item, key) =>
                                    <Grid.Col key={key} sm={1} md={3} lg={3}>
                                        <Image src={item} alt='image' />
                                    </Grid.Col>
                                )
                            }
                        </Grid>
                        <Dropzone
                            accept={{
                                'image/*': [], // All images
                                'text/html': ['.png', '.jpg'],
                            }}
                            onDrop={(files) => { setDetailImages(files) }}
                        >
                            <Flex
                                justify='center'
                                align='center'
                                h={200}
                            >
                                <Box>
                                    <Dropzone.Idle>
                                        <IconPhoto size="3.2rem" stroke={1.5} color="#666666" />
                                    </Dropzone.Idle>
                                    <Text size="xl" inline>
                                        Drage a image here or click to select file ( jpg )
                                    </Text>
                                </Box>
                            </Flex>
                        </Dropzone>
                        {/* <Box id="map" style={{ width: '100%', height: '500px', marginTop: '20px' }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyB6hZIv8mG7cOvX-AGUbB-vLeR5qZ1-QXI" }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    >

                    </GoogleMapReact>
                </Box> */}
                        <Box
                            mt={15}
                            sx={(theme) => ({
                                textAlign: 'right'
                            })}>
                            <Button variant="outline" onClick={() => (editItem())}>
                                Save
                            </Button>
                            <Button variant="outline" ml={10} color="red" onClick={() => { deleteItem() }}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                }
            </Modal>
        </Box>
    )
}


export default Item;