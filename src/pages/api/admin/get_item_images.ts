import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const item_id = req.body.item_id;
    const images_data = await supabaseAdmin.from('asian_images').select("*").eq('item_id', item_id);
    const videos_data = await supabaseAdmin.from('asian_videos').select("*").neq("image_url", "");

    if(images_data.data) {
        const images: string[]= [];
        images_data.data.map((item) => {
            images.push(item.url);
        })
        res.status(200).json({
            images,
            videos: videos_data.data
        });
    } else {
        res.status(201).json([]);
    }
}
