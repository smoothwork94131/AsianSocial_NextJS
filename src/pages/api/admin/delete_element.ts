import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_id = req.body.id;
    const { error } = await supabaseAdmin.from('asian_elements').delete().eq('id', element_id);
    if(error) {
        res.status(200).json({msg:'success'});
    } else {
        res.status(201).json({msg:'error'});
    }
}
