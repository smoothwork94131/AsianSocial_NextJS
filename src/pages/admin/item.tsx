import { Box, Button, Flex, Loader, Modal, TextInput, Textarea, Select, Accordion, Grid } from "@mantine/core";
import { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { Category, ElementState, ElementType, Item, ItemState } from "@/types/elements";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import GoogleMapReact from 'google-map-react';


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
    const [pageTypes, setPageTypes] = useState<Item[]>([]);
    const [selectedPageTypeId, setSelectedPageTypeId] = useState<string>('');
    const form = useForm({
        initialValues: {
           name:'',
           email:'',
           phone_number:'',
           sites_url: '',
           address:'',
           details:'',
           geo_lon:'',
           geo_lati:''
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

    const getItems = async() => {
        const res = await fetch('/api/admin/get_items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_id: selectedCategoryId })
        })
        if(res.status == 200){
            const data = await res.json();
            setItems(data);
        } else{

        }
    }
    
    const getPageTypes = async() => {
        const res = await fetch('/api/admin/get_categories')
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
        categories.map((item) => {
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
        form.setFieldValue('name', '');
        form.setFieldValue('element_id', '');
    }

    const defaultProps = {
        center: {
          lat: 44.900209366013954,
          lng: -102.56077483176705
        },
        zoom: 11
      };

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
            <Accordion defaultValue="item-2" mt={20}>
                <Accordion.Item value="item-1">
                    <Accordion.Control>control-1</Accordion.Control>
                    <Accordion.Panel>panel-1</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                    <Accordion.Control>control-2</Accordion.Control>
                    <Accordion.Panel>panel-2</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <Modal opened={opened} onClose={close} title="Category" fullScreen>
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
                        />
                    </Grid.Col>
                    <Grid.Col lg={4} md={3} sm={1}>
                        <TextInput
                            label="Name"
                            required
                            value={form.values.name}
                            onChange={(event) => {form.setFieldValue('name', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                    <Grid.Col lg={4} md={3} sm={1}>
                        <TextInput
                            label="email"
                            required
                            value={form.values.email}
                            onChange={(event) => {form.setFieldValue('email', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                    <Grid.Col lg={4} md={3} sm={1}>
                        <TextInput
                            label="Phone number"
                            required
                            value={form.values.phone_number}
                            onChange={(event) => {form.setFieldValue('phone_number', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                    <Grid.Col lg={6} md={6} sm={1}>
                        <TextInput
                            label="Sites url"
                            required
                            value={form.values.phone_number}
                            onChange={(event) => {form.setFieldValue('sites_url', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                    <Grid.Col lg={6} md={6} sm={1}>
                        <TextInput
                            label="Address"
                            required
                            value={form.values.phone_number}
                            onChange={(event) => {form.setFieldValue('address', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                    <Grid.Col lg={12} md={12} sm={12}>
                        <Textarea
                            label="Details"
                            required
                            value={form.values.details}
                            onChange={(event) => {form.setFieldValue('details', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                    <Grid.Col lg={12} md={12} sm={12}>
                        <TextInput
                            label="Longitude"
                            required
                            value={form.values.geo_lon}
                            onChange={(event) => {form.setFieldValue('geo_lon', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                    <Grid.Col lg={12} md={12} sm={12}>
                        <TextInput
                            label="Latitude"
                            required
                            value={form.values.geo_lati}
                            onChange={(event) => {form.setFieldValue('geo_lati', event.currentTarget.value)}}
                        />
                    </Grid.Col>
                </Grid>
                <div id="map" style={{width: '100%', height: '500px', marginTop: '20px'}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyB6hZIv8mG7cOvX-AGUbB-vLeR5qZ1-QXI" }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    >
                        {/* <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text="My Marker"
                        /> */}
                    </GoogleMapReact>
                </div>
            </Modal>
        </Box>
    )
}


export default Item;