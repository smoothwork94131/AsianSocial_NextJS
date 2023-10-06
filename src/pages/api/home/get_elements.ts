import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { error, data:element_data } = await supabaseAdmin.from('asian_elements')
        .select("*")
        .order('order', {ascending: true});

    if(element_data){
        for(let k=0;k<element_data?.length; k++) {
            let city_name="no";
            let category_name="no";

            const { data: cities_data} = await supabaseAdmin.from('asian_cities')
                .select(`*, asian_categories (id, name) `)
                .not('name', 'is', null)
                .eq('element_id', element_data[k].id)
                .order('id', {ascending: true})
                .limit(1);

            if(cities_data && cities_data.length > 0) {
                city_name = (cities_data[0] as any).name;
                category_name = (cities_data[0] as any).asian_categories[0].name;
            }
            
            (element_data[k] as any)['city_name'] = city_name;
            (element_data[k] as any)['category_name'] = category_name;
        }
        
        res.status(200).json(element_data);
    } else {
        res.status(201).json(element_data);
    }
}
