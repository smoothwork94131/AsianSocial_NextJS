
import { airtable, Businesses_airtable, Restaurant_airtable } from "@/utils/server/airtable";
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";
import { supabase, supabaseAdmin } from "@/utils/server/supabase-admin";
type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    insertBusiness();
    insertRestaurants();
    res.status(200).json({ name: 'John Doe' })
}

const insertBusiness = async() => {
    const options = { pageSize: 50 };
    Businesses_airtable.select(options).eachPage(
        async function page(records, fetchNextPage) {
            // setAllData((prev_data) => [...prev_data, ..._records]);
            for(let k=0; k<records.length; k++){
                await insertBussinessItem(records[k]);
            }
            fetchNextPage();
        },
        function done(error) {
            if (error) {
                console.log(error);
            } else {

            }
        }
    );
}

const insertRestaurants = async() => {
    const options = { pageSize: 50 };

    const promises: any=[];

    Restaurant_airtable.select(options).eachPage(
        async function page(records, fetchNextPage) {
            // setAllData((prev_data) => [...prev_data, ..._records]);
            for(let k=0; k<records.length; k++){
                await insertRestaurantItem(records[k]);
            }
            fetchNextPage();
        },
        function done(error) {
            if (error) {
                console.log(error);
            } else {

            }
        }
    );
}

const insertBussinessItem = async(record: any) => {
    const element_id = '5683ddfd-935c-43c5-8c16-94293d46f20a';
    const item = record.fields;
    const category = item.SubType;
    const type = item.TypeofBusiness;
    const name = item.BusinessName;
    const url = item.URL;
    const address = item.Address;
    const city = item.City;
    const zip_code = item.ZipCode;
    const phone_number = item.PhoneNumber;
    const email = item.Email;
    const map_url = item.MapUrl;
    const facebook = item.Facebook;
    const instagram = item.Instagram;
    const details = item.Details;
    const image = item.ImageUrl;

    const images = [
        item.ImageUrl
    ];

    let category_id = 0;
    let type_id = 0;

    let chk_res = await supabaseAdmin.from('asian_types').select("*").eq('name', type).eq('element_id', element_id);
    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_type =  await supabaseAdmin.from('asian_types').insert([{
                element_id,
                name: type
            }]).select("*").limit(1);
            if(add_type.data){
                type_id = add_type.data[0].id;
            }
        } else {
            type_id = chk_res.data[0].id;
        }
    }


    chk_res = await supabaseAdmin.from('asian_categories').select("*").eq('name', category).eq('type_id', type_id);
    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_cat =  await supabaseAdmin.from('asian_categories').insert([{
                type_id,
                name: category
            }]).select("*").limit(1);

            if(add_cat.data){
                category_id = add_cat.data[0].id;
            } else {
                console.log(add_cat.error);   
            }
        } else {
            category_id = chk_res.data[0].id;
        }
    }
    
    const chk_records = await chkExistRecord(name);
    console.log(chk_records);

    let item_id= "0";

    if(chk_records.length == 0) {
        const { error, data } = await supabaseAdmin.from('asian_items').insert([{
            name: item.BusinessName,
            category_id,
            sites_url: item.URL,
            image,
            address: item.Address,  
            element_id,
            email,
            rating: item.CustomerRating,
            phone_number: item.PhoneNumber,
            page_type_id: '8798b644-0e8c-4c43-8529-7023b187fc3d',
            map_url: item.MapUrl,
            details: item.Details,
            instagram,
            facebook,
            zip_code,
            type_id
        }]).select("*").limit(1);
        if(data) {
            item_id = data[0].id;
        }
    } else {
        const { error } = await supabaseAdmin.from('asian_items').insert([{
            name: item.BusinessName,
            category_id,
            sites_url: item.URL,
            image,
            address: item.Address,  
            element_id,
            rating: item.CustomerRating,
            phone_number: item.PhoneNumber,
            page_type_id: '8798b644-0e8c-4c43-8529-7023b187fc3d',
            map_url: item.MapUrl,
            details: item.Details,
            instagram,
            facebook,
            email,
            zip_code,
            type_id
        }]).eq("id", chk_records[0].id);
        item_id = chk_records[0].id;
    }

    await supabaseAdmin.from("asian_images").delete().eq("item_id", item_id);
    for(let k=0; k<images.length; k++){
        if(images[k] != "") {
            const { error } = await supabaseAdmin.from('asian_images').insert([{
                item_id,
                url: images[k]
            }]);
        }
    }
}

const insertRestaurantItem = async(record: any) => {

    const element_id = '2de204ae-9564-4400-b1ff-557bdb86e21d';
    const item = record.fields;
    const category = item.SubFoodCategory;
    const type = item.FoodType;
    const name = item.BusinessName;
    const url = item.URL;
    const address = item.Address;
    const city = item.City;
    const zip_code = item.ZipCode;
    const phone_number = item.PhoneNumber;
    const email = item.Email;
    const map_url = item.MapUrl;
    const facebook = item.Facebook;
    const instagram = item.Instagram;
    const details = item.Details;
    const image = item.ImageUrl;

    const images = [
        item.ImageUrl,
        item.ImageURL2,
        item.ImageURL3,
        item.ImageURL4
    ];

    let category_id = 0;
    let type_id = 0;

    let chk_res = await supabaseAdmin.from('asian_types').select("*").eq('name', type).eq('element_id', element_id);
    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_type =  await supabaseAdmin.from('asian_types').insert([{
                element_id,
                name: type
            }]).select("*").limit(1);
            if(add_type.data){
                type_id = add_type.data[0].id;
            }
        } else {
            type_id = chk_res.data[0].id;
        }
    }

    chk_res = await supabaseAdmin.from('asian_categories').select("*").eq('name', category).eq('type_id', type_id);
    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_cat =  await supabaseAdmin.from('asian_categories').insert([{
                type_id,
                name: category
            }]).select("*").limit(1);

            if(add_cat.data){
                category_id = add_cat.data[0].id;
            } else {
                console.log(add_cat.error);   
            }
        } else {
            category_id = chk_res.data[0].id;
        }
    }
    
    const chk_records = await chkExistRecord(name);
    console.log(chk_records);

    let item_id= "0";

    if(chk_records.length == 0) {
        const { error, data } = await supabaseAdmin.from('asian_items').insert([{
            name: item.BusinessName,
            category_id,
            sites_url: item.URL,
            image: image,
            address: item.Address,  
            element_id,
            email,
            rating: item.CustomerRating,
            phone_number: item.PhoneNumber,
            page_type_id: '8798b644-0e8c-4c43-8529-7023b187fc3d',
            map_url: item.MapUrl,
            instagram,
            details: item.Details,
            facebook,
            zip_code,
            type_id
        }]).select("*").limit(1);
        if(data) {
            item_id = data[0].id;
        }
    } else {
        const { error } = await supabaseAdmin.from('asian_items').update([{
            name: item.BusinessName,
            category_id,
            sites_url: item.URL,
            image: item.imageURL,
            address: item.Address,  
            element_id,
            rating: item.CustomerRating,
            phone_number: item.PhoneNumber,
            page_type_id: '8798b644-0e8c-4c43-8529-7023b187fc3d',
            map_url: item.MapUrl,
            details: item.Details,
            instagram,
            facebook,
            email,
            zip_code,
            type_id
        }]).eq("id", chk_records[0].id);
        item_id = chk_records[0].id;
    }

    await supabaseAdmin.from("asian_images").delete().eq("item_id", item_id);
    for(let k=0; k<4; k++){
        if(images[k] != "") {
            const { error } = await supabaseAdmin.from('asian_images').insert([{
                item_id,
                url: images[k]
            }]);
        }
    }
}


const chkExistRecord = async (name: string) => {
    const { data } = await supabaseAdmin.from('asian_items').select('*').eq('name', name);
    if(data) {
        if(data.length > 0) {
            return data;
        }
    }
    return [];
}

