import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const loadCount = req.body.loadCount;
    const { error, data } = await supabaseAdmin.from('asian_items')
        .select(`*, asian_elements (id, name), asian_cities (id, name), asian_categories (id, name), asian_page_type (id, name), asian_images (id, url)`)
        .range(loadCount * 100, (loadCount + 1) * 99)
        .order('id',  {ascending: true});
    if(data) {
        res.status(200).json(data);
    }
}
