import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const params = req.body.params;
    const type = req.body.type;
    const id = req.body.id;

    const { error: del_imgages_error} =await supabaseAdmin.from('asian_item_images').delete().eq('edit_id', id);

    let item_id = id;
    try {
        let data: any = false;
        if (type == "add") {
            const { data: item_data, error } = await supabaseAdmin.from('asian_items').insert([params]).select("*").limit(1);
            if(item_data){
                data = item_data;
                item_id = data[0].id;
            }
        } else if (type == 'edit') {
            const { data: item_data, error } = await supabaseAdmin.from('asian_items').update(params).eq('id', id);
            if(!error){
                data = true;
            }
        }
        
        if (data) {
            res.status(200).json({item_id: item_id});
        } else {
            res.status(201).json({item_id: ''});
        }
        
    } catch (e) {
        console.log(e);
        res.status(202).json({ msg: 'error' });
    }
}
