import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const image = req.body.image;
    const item_id = req.body.item_id;

    const { error } = await supabaseAdmin.from('asian_images').insert([{
        image,
        item_id
    }]);
    
    if(!error) {
        res.status(200).json({msg: 'success'});
    } else {
        res.status(201).json({msg: error});
    }
}
