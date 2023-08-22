import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const { error, data } = await supabaseAdmin.from('asian_page_type').select("*");    
    if(data) {
        res.status(200).json(data);
    } else {
        res.status(201).json([]);
    }
}
