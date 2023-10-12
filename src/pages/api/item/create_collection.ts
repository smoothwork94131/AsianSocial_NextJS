

import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const item_id = req.body.item_id;
    const user_id = req.body.user_id;
    const image_url = req.body.image_url;
    const name = req.body.collection_name;
    const active_item_ids = req.body.active_item_ids;

    const { error, data } = await supabaseAdmin
    .from('asian_collections')
    .insert([{
        item_id,
        user_id,
        image_url,
        name,
        active_item_ids
    }])
    .select('id, name, item_id, image_url, active_item_ids');
    
    if(error){
        res.status(201).json({
            msg: 'Server Error!'
        })
    } else {
        res.status(200).json(data)
    }
}
