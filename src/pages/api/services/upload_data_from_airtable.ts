
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
    // insertRestaurants();
    insertBusiness();
    res.status(200).json({ name: 'John Doe' })
}

const insertRestaurants = async() => {
    const options = { pageSize: 50 };
    const promises: any=[];

    Restaurant_airtable.select(options).eachPage(
        async function page(records, fetchNextPage) {
            for(let k=0; k<records.length; k++) {
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

const insertRestaurantItem = async(record: any) => {
    const element_id = 1;
    const item = record.fields;
    const sub_type = item.SubFoodCategory;
    const category = item.FoodType;
    const name = item.BusinessName;
    const url = item.URL;
    const address = item.Address;
    let city = item.City;
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
    let city_id = 0;
    
    let chk_res = await supabaseAdmin.from('asian_cities')
    .select("*")
    .eq('element_id', element_id)
    .ilike('name', `%${city}%`);
    
    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_type =  await supabaseAdmin.from('asian_cities').insert([{
                element_id: element_id,
                name: city
            }]).select("*").limit(1);

            if(add_type.data){
                city_id = add_type.data[0].id;
            }
        } else {
            city_id = chk_res.data[0].id;
        }
    }

    chk_res = await supabaseAdmin.from('asian_categories')
        .select("*")
        .eq('city_id', city_id)
        .ilike('name', `%${category}%`);
        
    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_cat =  await supabaseAdmin.from('asian_categories').insert([{
                city_id,
                name: category
            }]).select("*").limit(1);

            if(add_cat.data) {
                category_id = add_cat.data[0].id;
            } else {
                console.log(add_cat.error);   
            }
        } else {
            category_id = chk_res.data[0].id;
        }
    }
    
    chk_res = await await supabaseAdmin.from('asian_items')
        .select('*')
        .eq('city_id', city_id)
        .eq('category_id', category_id)
        .ilike('name', `%${name}%`);

    let item_id= "0";

    if(!chk_res.error) {
        if(chk_res.data.length == 0) {
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
                page_type_id: 1,
                map_url: item.MapUrl,
                instagram,
                details: item.Details,
                facebook,
                zip_code,
                city_id,
                sub_type
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
                page_type_id: 1,
                map_url: item.MapUrl,
                details: item.Details,
                instagram,
                facebook,
                email,
                zip_code,
                city_id,
                sub_type
            }]).eq("id", chk_res.data[0].id);
            
            item_id = chk_res.data[0].id;
        }
    }

    await supabaseAdmin.from("asian_images").delete().eq("item_id", item_id);
    
    console.log(item_id);

    for(let k=0; k<4; k++){
        if(images[k] != "") {
            const { error } = await supabaseAdmin.from('asian_images').insert([{
                item_id,
                url: images[k]
            }]);
        }
    }
}

const insertBusiness = async() => {
    const options = { pageSize: 50 };
    Businesses_airtable.select(options).eachPage(
        async function page(records, fetchNextPage) {
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

const insertBussinessItem = async(record: any) => {
    const element_id = 2;
    const item = record.fields;
    const sub_type = item.SubType;
    const category = item.TypeofBusiness;
    const name = item.BusinessName;
    const url = item.URL;
    const address = item.Address;
    let city = item.City;
    const zip_code = item.ZipCode;
    const phone_number = item.PhoneNumber;
    const email = item.Email;
    const map_url = item.MapUrl;
    const facebook = item.Facebook;
    const instagram = item.Instagram;
    const details = item.Details;
    const image = item.ImageUrl;

    if(city) {
        if(city.indexOf("Houston") > -1 || city.indexOf("HOUSTON") > -1){
            city = "Houston";
        }    
    }

    const images = [
        item.ImageUrl
    ];

    let category_id = 0;
    let city_id = 0;

    let chk_res = await supabaseAdmin.from('asian_cities')
        .select("*")
        .eq('element_id', element_id)
        .ilike('name', `%${city}%`);

    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_type =  await supabaseAdmin.from('asian_cities').insert([{
                element_id,
                name: city
            }]).select("*").limit(1);
            if(add_type.data){
                city_id = add_type.data[0].id;
            }
        } else {
            city_id = chk_res.data[0].id;
        }
    }

    chk_res = await supabaseAdmin.from('asian_categories')
        .select("*")
        .eq('city_id', city_id)
        .ilike('name', `%${category}%`);

    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_cat =  await supabaseAdmin.from('asian_categories').insert([{
                city_id,
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
    
    chk_res = await await supabaseAdmin.from('asian_items')
        .select('*')
        .eq('city_id', city_id)
        .eq('category_id', category_id)
        .ilike('name', `%${name}%`);
    
    console.log(chk_res);

    let item_id= "0";
    if(!chk_res.error) {
        if(chk_res.data.length == 0) {
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
                page_type_id: 1,
                map_url: item.MapUrl,
                details: item.Details,
                instagram,
                facebook,
                zip_code,
                city_id,
                sub_type
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
                page_type_id: 1,
                map_url: item.MapUrl,
                details: item.Details,
                instagram,
                facebook,
                email,
                zip_code,
                city_id,
                sub_type
            }]).eq("id", chk_res.data[0].id);
            item_id = chk_res.data[0].id;
        }
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