
import { airtable, Businesses_airtable } from "@/utils/server/airtable";
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";
import { supabaseAdmin } from "@/utils/server/supabase-admin";
type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const options = { pageSize: 50 };

    const promises: any=[];

    Businesses_airtable.select(options).eachPage(

        async function page(records, fetchNextPage) {
            // setAllData((prev_data) => [...prev_data, ..._records]);
            for(let k=0; k<records.length; k++){
                await insertItem(records[k]);
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
    res.status(200).json({ name: 'John Doe' })
}

const insertItem = async(record: any) => {
    const element_id = '2de204ae-9564-4400-b1ff-557bdb86e21d'

    const item = record.fields;
    const category = item.FoodType;
    const chk_res = await supabaseAdmin.from('asian_categories').select("*").eq('name', category).eq('element_id', element_id);
    let category_id = 0;
    if(!chk_res.error){
        if(chk_res.data.length == 0){
            const add_cat =  await supabaseAdmin.from('asian_categories').insert([{
                element_id,
                name: category
            }]).select("*").limit(1);
            if(add_cat.data){
                category_id = add_cat.data[0].id;
            }
        } else {
            category_id = chk_res.data[0].id;
        }
    }
    const { error } = await supabaseAdmin.from('asian_items').insert([{
        name: item.BusinessName,
        category_id,
        sites_url: item.URL,
        image: item.imageURL,
        address: item.Address,  
        element_id,
        rating: item.CustomerRating,
        phone_number: item.PhoneNumber,
        page_type_id: '8798b644-0e8c-4c43-8529-7023b187fc3d'
    }]);
    
}

