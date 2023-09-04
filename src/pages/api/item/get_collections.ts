import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user_id = req.body.user_id;
    const { error, data } = await supabaseAdmin.from('asian_collections').select("*").eq('user_id', user_id);
    if(data) {
        res.status(200).json(data);
    } else {
        res.status(201).json([]);
    }
}
