import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { error, data:element_data } = await supabaseAdmin.from('asian_elements').select("*").order('order', {ascending: true});
    const data: any = [];
    if(element_data){
        for(let k=0;k<element_data?.length; k++){
            let type_name="no";
            let category_name="no";

            const { data: type_data} = await supabaseAdmin.from('asian_types').select("*").neq('name', null).eq('element_id', element_data[k].id).limit(1);
            if(type_data && type_data.length > 0){
                
                type_name = (type_data[0] as any).name;
                const { data: category_data } = await supabaseAdmin.from('asian_categories').select("*").eq('type_id', (type_data[0] as any).id).neq('name', null).limit(1);
                if(category_data && category_data.length > 0) {
                    category_name = (category_data[0] as any).name;
                }
            }
            (element_data[k] as any)['type_name'] = type_name;
            (element_data[k] as any)['category_name'] = category_name;
        }
        console.log(element_data);
        res.status(200).json(element_data);
    } else {
        res.status(201).json(element_data);
    }
}
