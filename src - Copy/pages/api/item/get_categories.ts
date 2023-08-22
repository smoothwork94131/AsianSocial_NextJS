import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_id = req.body.element_id;
    const { error, data } = await supabaseAdmin.from('asian_categories').select("*").eq('element_id', element_id);

    if(data) {
        res.status(200).json(data);
    } else {
        res.status(201).json([]);
    }
}
