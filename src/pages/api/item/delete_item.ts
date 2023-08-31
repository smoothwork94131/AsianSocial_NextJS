

import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const item_id = req.body.item_id;
    const user_id = req.body.user_id;

    const { error } = await supabaseAdmin.from('asian_saves').delete().eq('item_id', item_id).eq('user_id', user_id);
    if(error){
        res.status(201).json({
            msg: 'Server Error!'
        })
    } else {
        res.status(200).json({
            msg: 'success'
        })
    }
}
