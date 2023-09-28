import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const item_id = req.body.item_id;
    const { error, data } = await supabaseAdmin.from('asian_images').select("*").eq('item_id', item_id);
    if(data) {
        const images: string[]= [];
        data.map((item) => {
            images.push(item.url);
        })
        res.status(200).json(images);
    } else {
        res.status(201).json([]);
    }
}
