export interface ElementType{
    name: string,
    summary: string,
    id: string
    order: string,
    type_name?:string,
    category_name?: string
}

export const ElementState: ElementType = {
    name: '',
    summary: '',
    id: '',
    order: '0'
}

export interface Types {
    name: string,
    element_id: string,
    id: string,
    category_name?:string
}

export const TypesState =  {
    name:'',
    element_id:'',
    id:''
}

export interface Category {
    name: string,
    type_id: string,
    id: string
}

export const CategoryState =  {
    name:'',
    type_id:'',
    id:''
}

export interface Item 
{
    id: string,
    name: string,
    sites_url: string,
    event_name: string,
    email: string,
    phone_number: string,
    address: string,
    details: string,
    reviews:string,
    geo_lati: string,
    geo_lon: string,
    category_id: string,
    image: string,
    page_type_id: string,
    element_id: string,
    category_name?: string,
    rating: string,
    map_url: string
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
    geo_lati: "0",
    geo_lon: "0",
    category_id: '',
    image: '',
    page_type_id: '',
    name: '',
    element_id:'',
    rating:'0',
    map_url: ''

}


export interface PageType{
    id: string,
    name: string
}

export const PageTypeState = {
    id: '',
    name: ''
}

export interface Collection {
    id: string,
    created_at?:string,
    item_id: string,
    name: string,
    user_id: string,
    image_url: string,
    active_item_ids: string[]
}

export const CollectionState: Collection = {
    id: '',
    item_id: '',
    name: '',
    user_id: '',
    image_url: '',
    active_item_ids: []
}