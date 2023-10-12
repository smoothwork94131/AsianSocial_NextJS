

import { CollectionType } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {    
    const collection_id = req.body.collection_id;
    const user_id = req.body.user_id

    const { error } = await supabaseAdmin
        .from('asian_collections')
        .delete()
        .eq('id', collection_id);

    if(!error) {
        const {error, data} = await supabaseAdmin
            .from('asian_collections')
            .select('id, name, item_id, image_url, active_item_ids')
            .eq('user_id', user_id);

        if(error) {
            res.status(201).json({msg:'error'});
        }
        else {
            res.status(200).json(data)
        }        
    } else {
        res.status(201).json({msg:'error'});
    }
}