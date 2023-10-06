import { CollectionType, ItemType } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user_id = req.body.user_id;
    const ids: string[] = [];

    const { error, data } = await supabaseAdmin.from('asian_collections').select("*").eq('user_id', user_id);
    
    if(data) { 
        data.map((item:CollectionType) => {
            for(let k=0; k<item.active_item_ids.length; k++){
                if(!ids.includes(item.active_item_ids[k])){
                    ids.push(item.active_item_ids[k]);
                }
            }
        })
        let result: (ItemType | undefined)[] = [];
        result = await Promise.all(
            ids.map(async(item_id) => {
                const item_data = await supabaseAdmin.from('asian_items').select("*").eq('id', item_id);
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
