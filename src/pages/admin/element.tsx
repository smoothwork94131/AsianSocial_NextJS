import { Box, Button, Flex, Grid, Loader, Modal, TextInput, Textarea, Select } from "@mantine/core";
import { useEffect, useState } from 'react';
import { Table } from '@mantine/core';
import { ElementType } from "@/types/elements";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

const Element = () => {

    const [data, setData] = useState<ElementType[]>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [type , setType] = useState<string>('add');
    const [selectedId, setSelectedId] = useState<string>('');
    const [isLoad, setIsLoad] = useState<boolean>(false);

    const form = useForm({
        initialValues: {
            name: '',
            summary: '',
            order: '1'
        },
    });


    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        setIsLoad(true);
        const res = await fetch('/api/admin/get_elements');
        if (res.status == 200) {
            const data_ = await res.json();
            setData(data_)
        }
        setIsLoad(false);
    }

    const editElement = async () => {
        setIsLoad(true);

        close();
        const res = await fetch('/api/admin/edit_element', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: form.values, type, id: selectedId})
        })
        if(res.status == 200){
            notifications.show({
                title: type,
                message: 'Success',
                color: 'default'
            })
            getData();
        } else {
            notifications.show({
                title: type,
                message: 'Error',
                color: 'red'
            })
        }
        setIsLoad(false);

    }
    
    const deleteElement = async() => {
        close();
        setIsLoad(true);

        const res = await fetch('/api/admin/delete_element', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: selectedId})
        })
        if(res.status == 200) {
            getData();
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

    const editModal = async(item: ElementType) => {
        form.setFieldValue('name', item.name);
        form.setFieldValue('summary', item.summary);
        setSelectedId(item.id);
        setType('edit');
        open();
    }

    const addModal = async() => {
        form.setFieldValue('name', '');
        form.setFieldValue('summary', '');
        setType('add');
        open();
    }

    const getOrderGroup = () => {
        const order = [];
        for(let k = 0; k < data.length; k++){
            order.push({
                value: (k+1).toString(),
                label: (k+1).toString()
            });
        }
        if(order.length == 0){
            return [{
                value: "1",
                label: "1"
            }];
        } else {
            return order
        }
    }

    return (
        <Box
            p={20}
            sx={(theme) => ({

            })}>
            <Button
                variant="outline"
                onClick={() => { addModal() }}
            >
                Add New Element
            </Button>
            <Table mt={20}>
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>No</th>
                        <th style={{ width: '20%' }}>Element name</th>
                        <th style={{ width: '65%' }}>Summary</th>
                        <th style={{ width: '5%' }}>order</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        isLoad?<tr><th colSpan={3} align="center"><Loader variant="dots" /></th></tr>:
                        data.map((item: ElementType, key) =>
                            <tr key={key} onClick={() => {editModal(item)}}>
                                <td>{key + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.summary}</td>
                                <td>{item.order}</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
            <Modal opened={opened} onClose={close} title="Element" size='lg' p={20}>
                <Flex
                    direction='column'
                    gap='md'
                    p={20}
                >
                    <TextInput
                        label="Element Name"
                        required
                        value={form.values.name}
                        onChange={(event) => {form.setFieldValue('name', event.currentTarget.value)}}
                    />
                    <Textarea
                        label="Summary"
                        value={form.values.summary}
                        onChange={(event) => {form.setFieldValue('summary', event.currentTarget.value)}}
                    />
                    <Select
                        label="Elements"
                        data={
                            getOrderGroup()
                        }
                        searchable
                        value={form.values.order}
                        onChange={(value) =>{form.setFieldValue('order', value??'')}}
                    />
                    <Box
                        sx={(theme) => ({
                            textAlign: 'right'
                        })}>
                        <Button variant="outline" onClick={() =>(editElement())}>
                            Save
                        </Button>
                        <Button variant="outline" ml={10} color="red" onClick={() =>{deleteElement()}}>
                            Delete
                        </Button>
                    </Box>
                </Flex>
            </Modal>
        </Box>
    )
}

export default Element;