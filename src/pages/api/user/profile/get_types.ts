import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_id = req.body.element_id;

    const { error, data:element_data } = await supabaseAdmin.from('asian_elements')
        .select("*").eq("id", element_id);
    
    if(element_data) {
        const { data: types } = await supabaseAdmin.from('asian_types')
            .select("*").eq("element_id", element_data[0].id);

        
        if(types) {
            for(let k=0; k<types?.length; k++){
                let category_name = 'no';
                const { error, data} = await supabaseAdmin.from('asian_categories').select("*").neq('name', null).eq('type_id', types[k].id);
                if(data && data.length > 0){
                    for(let j=0; j<data.length; j++){
                        if(data[j].name != null){
                            category_name = data[j].name;
                            break;
                        }
                    }
                }
                (types[k] as any)['category_name'] = category_name;
            }
        }
        
        res.status(200).json({
            element_data: element_data[0],
            types
        });
    }
}
