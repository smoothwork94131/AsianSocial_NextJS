import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user_id = req.body.user_id;
    const password = req.body.password;
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, { password: password });
    if (!error) {
        res.status(200).json(data);
    }
    else {
        console.log(error?.message)
    }
}