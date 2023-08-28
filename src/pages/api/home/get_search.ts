import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const search = req.body.search;
    const { error, data } = await supabaseAdmin.from('asian_items').
        select("*")
        .or(`name.ilike.%${search}%, details.ilike.%${search}%, email.ilike.%${search}%, phone_number.ilike.%${search}%, address.ilike.%${search}%`)
        .limit(50);
    
    if(data) {
        res.status(200).json(data);
    } else {
        res.status(201).json(data);
    }
}
