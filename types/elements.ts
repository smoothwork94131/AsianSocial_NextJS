export interface ElementType {
    id: string
    name: string,
    summary: string,
    order: string,
    city_name?:string,
    category_name?: string
}

export const ElementState: ElementType = {
    id: '',
    name: '',
    summary: '',
    order: '0'
}

export interface CityType {
    id: string,
    element_id: string,
    name: string,
    category_name?:string
}

export const CityState:CityType =  {
    id:'',
    element_id:'',
    name:''
}

export interface CategoryType {
    id: string,
    city_id: string,
    name: string
}

export const CategoryState:CategoryType =  {
    id:'',
    city_id:'',
    name:''
}

export interface ItemType
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
    map_url: string,
    facebook: string,
    instagram: string,
    city_id: string,
    hours: string
}

export const  ItemState: ItemType = {
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
    map_url: '',
    facebook: '',
    instagram:'',
    city_id: '',
    hours: ""
}

export interface PageType{
    id: string,
    name: string
}

export const PageState = {
    id: '',
    name: ''
}

export interface CollectionType {
    id: string,
    created_at?:string,
    item_id: string,
    name: string,
    user_id: string,
    image_url: string,
    active_item_ids: string[]
}

export const CollectionState: CollectionType = {
    id: '',
    item_id: '',
    name: '',
    user_id: '',
    image_url: '',
    active_item_ids: []
}