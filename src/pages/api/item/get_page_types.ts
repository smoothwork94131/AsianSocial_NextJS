
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const type_id = req.body.type_id;
    
    const { error, data:types_data } = await supabaseAdmin.from('asian_page_type')
        .select("*").eq("id", type_id).single();
    if(types_data) {
        res.status(200).json(types_data);
    } else {
        console.log(error);
        res.status(201).json([]);
    }
}
