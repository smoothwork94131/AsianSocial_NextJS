import { Item } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user_id = req.body.user_id;
    const { error, data } = await supabaseAdmin.from('asian_saves').select("*")
    .eq('user_id', user_id);
    
    console.log(data);

    if(data) { 
        let result: (Item | undefined)[] = [];
        result = await Promise.all(
            data.map(async(item) => {
                const item_data = await supabaseAdmin.from('asian_items').select("*").eq('id', item.item_id);
                if(!item_data.error){
                    return item_data.data[0]
                }
            })
        )
        res.status(200).json(result);
    } else {
        res.status(201).json([]);
    }
}
