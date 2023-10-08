import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const user = req.body.useruser;
    const password = req.body.password;
    
    const { data, error } = await supabaseAdmin.auth.updateUser({ password: password });
    if (!error) {
        res.status(200).json(data);
    }
    else {
        console.log(error?.message)
    }
}