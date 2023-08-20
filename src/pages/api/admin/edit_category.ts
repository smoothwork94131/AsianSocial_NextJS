import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const data = req.body.data;
    const type = req.body.type;
    const id = req.body.id;
    
    let res_error: any = false;
    if(type == "add") {
        const {error: res_error} = await supabaseAdmin.from('asian_categories').insert([data]);
    } else if(type == 'edit') {
        const {error: res_error} = await supabaseAdmin.from('asian_categories').update(data).eq('id', id);
    }

    if(!res_error) {
        res.status(200).json({msg:'success'});
    } else {
        res.status(201).json({msg:'error'});
    }

}
