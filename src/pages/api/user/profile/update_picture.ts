import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user_id = req.body.user_id;
    const image = req.body.image;

    const { error, data } = await supabaseAdmin.from('users').update([{
        avatar_url: image
    }]).eq('id', user_id);

    if(!error) {
        res.status(200).json(data);
    } else {
        res.status(201).json([]);
    }
}