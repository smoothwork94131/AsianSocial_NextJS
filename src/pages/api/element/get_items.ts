import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const type_id = req.body.type_id;
        const { error, data: items } = await supabaseAdmin.from('asian_items')
            .select("*").eq("type_id", type_id);

        if (items) {
            res.status(200).json(items);
        } else {
            res.status(201).json([]);
        }

    } catch (e) {
        res.status(202).json([]);
    }

}
