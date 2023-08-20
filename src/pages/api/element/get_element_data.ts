import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_name = req.body.name;
    
    const { error, data:element_data } = await supabaseAdmin.from('asian_elements')
        .select("*").eq("name", element_name);
    
    if(element_data) {
        const { error, data: categories } = await supabaseAdmin.from('asian_categories').select("*").eq("element_id", element_data[0].id);
       
        res.status(200).json({
            element_data: element_data[0],
            categories: categories
        });
    }
}
