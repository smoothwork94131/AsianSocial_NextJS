import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user_id = req.body.user_id;
    const instagram_link = req.body.instagram_link;
    const twitter_link = req.body.twitter_link;
    const facebook_link = req.body.facebook_link;

    const { error, data } = await supabaseAdmin.from('users').update([{
        instagram: instagram_link,
        twitter: twitter_link,
        facebook: facebook_link
    }]).eq('id', user_id);

    if(!error) {
        const { error, data } = await supabaseAdmin.from('users')
            .select('*')
            .eq('id', user_id)
            .limit(1);

        res.status(200).json(data);
    }
    else {
        res.status(201).json([]);
    }
}