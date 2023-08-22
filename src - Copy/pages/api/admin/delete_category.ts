import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const category_id = req.body.category_id;
    const { error } = await supabaseAdmin.from('asian_categories').delete().eq('id', category_id);
    if(!error) {
        res.status(200).json({msg:'success'});
    } else {
        res.status(201).json({msg:'error'});
    }
}
