import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const id = req.body.id;
    const { error, data } = await supabaseAdmin.from('users').
        select(`*, asian_collections (id, name, item_id, image_url, active_item_ids)`)
        .eq('id', id)
        .single();

    if(data) {
        res.status(200).json(data);
    } else {
        res.status(201).json([]);
    }
}
