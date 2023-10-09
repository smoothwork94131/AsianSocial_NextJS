import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const user_id = req.body.user_id;
    const full_name = req.body.full_name;
    const email = req.body.email;

    const { error, data } = await supabaseAdmin.from('users').update([{
        full_name: full_name,
        email: email
    }]).eq('id', user_id);

    if(!error) {
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, { email: email });
        if (!error) {
            const { error, data } = await supabaseAdmin.from('users')
                .select('*')
                .eq('id', user_id)
                .limit(1);

            res.status(200).json(data);
        }
        else {
            console.log(error?.message)
        }
    }
    else {
        res.status(201).json([]);
    }
}