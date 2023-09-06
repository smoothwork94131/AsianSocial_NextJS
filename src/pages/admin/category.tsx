import { Box, Button, Flex, Loader, Modal, TextInput, Textarea, Select } from "@mantine/core";
import { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { Category, ElementState, ElementType } from "@/types/elements";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';

const Category = () => {

    const [elements, setElements] = useState<ElementType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    
    const [opened, { open, close }] = useDisclosure(false);
    const [type, setType] = useState<string>('add');
    const [selectedId, setSelectedId] = useState<string>('');
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [selectedElementId, setSelectedElementId] = useState<string>('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [search ,setSearch] = useState<string>('');
    const isMobile = useMediaQuery(`(max-width: 700px)`);

    const form = useForm({
        initialValues: {
            name: '',
            element_id: '',
        },
    });
    
    useEffect(() =>{
        getElements();
    }, [])

    useEffect(() =>{
    }, [elements])

    useEffect(() =>{
        
        getCategories();
    }, [selectedElementId]);
    
    const getElements = async() => {
        setIsLoad(true);
        const res = await fetch('/api/admin/get_elements');
        if(res.status == 200){
            const data = await res.json();
            setElements(data);
        }
        setIsLoad(false);
    }
    

    const editModal = async (item: Category) => {
        setType('edit');
        setSelectedCategoryId(item.id);
        form.setFieldValue('name', item.name);
        form.setFieldValue('element_id', item.type_id);
        open();
    }

    const addModal = async () => {
        open();
        setType('add');
        form.setFieldValue('name', '');
        form.setFieldValue('element_id', '');
    }

    const getCategories = async() => {
        setIsLoad(true);
        const res = await fetch('/api/admin/get_categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({element_id: selectedElementId})
        });
        if(res.status == 200){
            const data = await res.json();
            setCategories(data);
        }
        setIsLoad(false);
    }

    const editCategory = async() => {
        if(form.values.element_id == '' || form.values.name == ''){

            notifications.show({
                title: 'invalide',
                message: 'Enter a element or category',
                color: 'red'
            })
            return;
        }
        close();
        const res = await fetch('/api/admin/edit_category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: form.values,
                type,
                id: selectedCategoryId
            })
        });
        if(res.status == 200){
            notifications.show({
                title: 'Add category',
                message: 'Success',
                color: 'default'
            })
            getCategories();
        }
    }

    const deleteCategory = async() => {
        close();
        setIsLoad(true);

        const res = await fetch('/api/admin/delete_category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({category_id: selectedCategoryId})
        })
        
        if(res.status == 200) {
            getCategories();
            notifications.show({
                title: 'Delete',
                message: 'Success',
                color: 'default'
            })
        } else {
            notifications.show({
                title: 'Delete ',
                message: 'error',
                color: 'red'
            })
        }
        setIsLoad(false);
    }

    const parsedElements = () => {
        const parsed_elements:{
            value: string,
            label: string   
        }[] = [];
        elements.map((item) => {
            parsed_elements.push({
                value:item.id,
                label: item.name
            })
        })
        return parsed_elements;
    }

    const filterCategories = () => {
        return categories.filter(item => item.name.indexOf(search) > -1);
    }
    
    return (
        <Box>
            <Flex
                gap="md"
                direction={isMobile?'column':'row'}
            >
                <Select
                    label="Elements"
                    data={parsedElements()}
                    searchable
                    onChange={(value) => {setSelectedElementId(value??'')}}
                />
                <TextInput
                    placeholder="Search"
                    mt={25}
                    value={search}
                    onChange={(event) => {setSearch(event.currentTarget.value)}}
                />
                <Button variant="outline" mt={25} onClick={() => {addModal()}}>
                    Add New Category
                </Button>
            </Flex>
            <Table mt={20}>
                <thead>
                    <tr>
                        <th style={{ width: '10%' }} >No</th>
                        <th style={{ width: '30%' }} >Element name</th>
                        <th style={{ width: '60%' }} align="left">Category name</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        isLoad ? <tr><th colSpan={2} align="center"><Loader variant="dots" /></th></tr> :
                            filterCategories().length == 0 || elements.length == 0?<tr><th colSpan={2} align="center">No matched data</th></tr>:
                            filterCategories().map((item: Category, key) =>
                                <tr key={key} onClick={() => { editModal(item) }}>
                                    <td>{key + 1}</td>
                                    <td>{elements.filter(element => element.id == item.type_id)[0].name}</td>
                                    <td>{item.name}</td>
                                </tr>
                            )
                    }
                </tbody>
            </Table>
            <Modal opened={opened} onClose={close} title="Category" size='lg' p={20}>
                <Flex
                    direction='column'
                    gap='md'
                    p={20}
                >
                    <Select
                        label="Elements"
                        data={parsedElements()}
                        searchable
                        value={form.values.element_id}
                        onChange={(value) =>{form.setFieldValue('element_id', value??'')}}
                    />
                    
                    <TextInput
                        label="Category Name"
                        required
                        value={form.values.name}
                        onChange={(event) => {form.setFieldValue('name', event.currentTarget.value)}}
                    />
                    <Box
                        sx={(theme) => ({
                            textAlign: 'right'
                        })}>
                        <Button variant="outline" onClick={() =>(editCategory())}>
                            Save
                        </Button>
                        <Button variant="outline" ml={10} color="red" onClick={() =>{deleteCategory()}}>
                            Delete
                        </Button>
                    </Box>
                </Flex>
            </Modal>
        </Box>
    )
}

export default Category;