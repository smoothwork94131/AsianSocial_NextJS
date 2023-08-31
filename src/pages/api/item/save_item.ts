
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const item_id = req.body.item_id;
    const user_id = req.body.user_id;
    const { error: item_error, data: item_data } = await supabaseAdmin.from('asian_saves').select('*').eq('user_id', user_id).eq('item_id', item_id);
    if (item_data) {
        if (item_data.length > 0) {
            res.status(201).json({
                msg: 'You already saved selected item'
            })
        } else {
            const { error: add_error} = await supabaseAdmin.from('asian_saves').insert([{
                user_id,
                item_id
            }])
            if(add_error){
                res.status(202).json({
                    msg: 'Server Error!'
                })
            } else {
                res.status(200).json({
                    msg: 'Saved'
                })
            }
        }
    } else {
        res.status(202).json({
            msg: 'Server Error!'
        })
    }
}