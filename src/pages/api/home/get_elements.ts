import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { error, data } = await supabaseAdmin.from('asian_elements').select("*").order('order', {ascending: true});
    if(data) {
        res.status(200).json(data);
    }
}
