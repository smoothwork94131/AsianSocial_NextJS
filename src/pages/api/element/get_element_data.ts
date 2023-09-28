import { Types, Item } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_name = req.body.element_name;
    const type_name = req.body.type_name;

    const { error, data:element_data } = await supabaseAdmin.from('asian_elements')
        .select("*").eq("name", element_name);
    
    if(element_data) {
        const { data: _types } = await supabaseAdmin.from('asian_types')
            .select("*").eq("element_id", element_data[0].id);
        const types: any = [];
        const promises:any = [];
        if(_types){
            _types.map((item:Types) => {
                promises.push(getExistItem(item))
            })
        }
        
        const response = await Promise.all(promises);
        response.map((item: any) => {
            if(item) {
                types.push(item)
            }
        })

        /*
        const {data: categories } = await supabaseAdmin.from('asian_categories')
            .select("*").eq("type_id", types?.filter((item) => item.name == type_name)[0].id);
        */
            /*
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
        */
        
        res.status(200).json({
            element_data: element_data[0],
            categories:[],
            types
        });
    }
}

const getExistItem = async(type: Types) => {
    const { error, data } = await supabaseAdmin.from('asian_items').select("*").eq("type_id", type.id).limit(1);
    if(data && data.length > 0) {
        return type;
    } else {
        console.log(error);
        return false;
    }
}
