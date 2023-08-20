import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const category_id = req.body.category_id;
    const { error, data } = await supabaseAdmin.from('asian_items').select("*").eq('category_id', category_id);
    
    if(data) {
        res.status(200).json(data);
    } else {
        res.status(201).json([]);
    }
}
