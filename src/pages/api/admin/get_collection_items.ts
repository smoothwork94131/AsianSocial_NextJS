import { Item } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const collection_id = req.body.collection_id;
    const { error, data: collection_data } = await supabaseAdmin.from('asian_collections')
        .select("*").eq('id', collection_id)
    if (!error) {
        if (collection_data.length > 0) {
            const active_item_ids = collection_data[0].active_item_ids;
            const promise: any = [];

            for (let k = 0; k < active_item_ids.length; k++) {
                promise.push(
                    getItem(active_item_ids[k])
                )
            }
            const response = await Promise.all(promise);
            let data: Item[] = [];
            response.map((item) => {
                if (item.length > 0) {
                    data.push(item[0])
                }
            })
            res.status(200).json(data);
        } else {
            res.status(200).json([]);

        }

    } else {
        res.status(201).json([]);
    }
    // if(element_data) {
    //     res.status(200).json(element_data);
    // } else {
    //     res.status(201).json([]);
    // }

}

const getItem = async (item_id: string) => {
    const { error, data } = await supabaseAdmin.from('asian_items').select("*").eq('id', item_id);
    if (data) {
        if (data.length > 0) {
            return data;
        } else {
            return [];
        }
    } else {
        return [];
    }
}