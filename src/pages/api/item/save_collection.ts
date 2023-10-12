

import { CollectionType } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const item_id = req.body.item_id;
    const user_id = req.body.user_id;
    const collection_id = req.body.collection_id;
    
    await unActiveCollection(item_id, user_id)

    let active_item_ids: string[] = [];
    
    const { data: collection_data } = await supabaseAdmin
        .from('asian_collections')
        .select("*")
        .eq('id', collection_id);

    if(collection_data) {
        active_item_ids = collection_data[0].active_item_ids;
        active_item_ids.push(item_id);
    }

    const { error } = await supabaseAdmin.from('asian_collections').update([{
        active_item_ids
    }]).eq('id', collection_id);

    if (error) {
        res.status(201).json({
            msg: 'Server Error!'
        })
    } else {
        const {error, data} = await supabaseAdmin
            .from('asian_collections')
            .select('id, name, item_id, image_url, active_item_ids')
            .eq('user_id', user_id);

        if(error) {
            res.status(201).json({msg:'Server Error'});
        }
        else {
            res.status(200).json(data)
        } 
    }
}


export const unActiveCollection = async (item_id: string, user_id: string) => {
    const { error, data } = await supabaseAdmin.from('asian_collections').select("*").eq('user_id', user_id);
    let promise: any = [];
    if(data) {
        for (let k = 0; k < data.length; k++) {
            promise.push(
                removeActive(data[k], item_id)
            )
        }
        const response = await Promise.all(promise);
    }
}


const removeActive = async(data: CollectionType, item_id: string) => {
    const { data:collection_data} = await supabaseAdmin.from('asian_collections').select("*").eq('id', data.id);
    if(collection_data) {
        if(collection_data?.length > 0){
            const active_item_ids = collection_data[0].active_item_ids;
            const filter_item_ids = active_item_ids.filter((item: string) => item.toString() != item_id)
            const { error } = await supabaseAdmin.from('asian_collections').update([{
                active_item_ids:filter_item_ids
            }]).eq('id', data.id);
            
            if(error){
                return false;
            }
        }    
    }
}