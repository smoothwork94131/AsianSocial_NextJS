import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_id = req.body.element_id;
    
    const { error, data:element_data } = await supabaseAdmin.from('asian_elements')
        .select("*").eq("id", element_id).single();
    
    if(element_data) {
       
        res.status(200).json(element_data);
    }
}
