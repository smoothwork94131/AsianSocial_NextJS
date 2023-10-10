import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const loadCount = req.body.loadCount;
    const limit = 30;
    const { error, data } = await supabaseAdmin.from('asian_items')
        .select("*")
        .range(loadCount * 30, (loadCount + 1) * 29)
        .order('id',  {ascending: true});
    if(data) {
        res.status(200).json(data);
    }
}
