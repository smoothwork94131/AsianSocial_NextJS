import { CategoryType } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_id = req.body.element_id;
    
    const table = supabaseAdmin.from('asian_categories').select("*");
    
    let categories:any = false;

    if(element_id != ""){
        const { error, data } = await table.eq('element_id',element_id);
        categories = data;
    }  else {
        const {error, data} = await table;
        categories = data;
    }
    
    if(categories) {
        res.status(200).json(categories);
    } else {
        res.status(201).json([]);
    }
}
