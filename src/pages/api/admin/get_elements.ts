import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const element_name = req.body.name;
    const { error, data:element_data } = await supabaseAdmin.from('asian_elements').select("*").order('order', { ascending: true })   
    if(element_data) {
        res.status(200).json(element_data);
    } else {
        res.status(201).json([]);
    }
}
