import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user_id = req.body.user_id;
    const avatar_url = req.body.avatar_url;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const website = req.body.website;
    const bio = req.body.bio;
    const location = req.body.location;

    const { error, data } = await supabaseAdmin.from('users').update([{
        avatar_url: avatar_url,
        first_name: first_name,
        last_name: last_name,
        website: website,
        bio: bio,
        location: location
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