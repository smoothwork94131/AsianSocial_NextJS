export interface ElementType{
    name: string,
    summary: string,
    id: string
}

export const ElementState: ElementType = {
    name: '',
    summary: '',
    id: ''
}

export interface Category {
    name: string,
    element_id: string,
    id: string
}

export const CategoryState =  {
    name:'',
    element_id:'',
    id:''
}

export interface Item {
    id: string,
    sites_url: string,
    event_name: string,
    email: string,
    phone_number: string,
    address: string,
    details: string,
    reviews:string,
    geo_lati: number,
    geo_lon: number,
    category_id: string,
    image: string,
    page_type_id: string
}

export const  ItemState: Item = {
    id: '',
    sites_url: '',
    event_name: '',
    email: '',
    phone_number: '',
    address: '',
    details: '',
    reviews:'',
    geo_lati: 0,
    geo_lon: 0,
    category_id: '',
    image: '',
    page_type_id: ''
}

export interface PageType{
    id: string,
    name: string
}