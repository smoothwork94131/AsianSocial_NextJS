import { CityType, CategoryType, ItemType } from '@/types/elements';
import { supabaseAdmin } from '@/utils/server/supabase-admin';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const element_name = req.body.element_name;
    const city_name = req.body.city_name;
    const category_name = req.body.category_name;

    const { data: _element_data } =  await supabaseAdmin.from('asian_elements')
        .select("*")
        .eq("name", element_name)
        .limit(1);
    
    if(_element_data) {
        const { data: _cities_data } = await supabaseAdmin.from('asian_cities')
            .select(`*, asian_categories ( id, name ), asian_items ( id, name )`)
            .not('name', 'is', null)
            .eq("element_id", _element_data[0]?.id)
            .order('id', { ascending : true});

        let _new_cities_data:CityType[] = [];
        let _new_categories_data:CategoryType[] = [];
        let _new_items_data:ItemType[] = [];

        if(_cities_data && _cities_data.length > 0) {
            _new_cities_data = _cities_data;
            if(_new_cities_data){
                _new_cities_data.map((item:CityType) => {
                    item.category_name = _cities_data.filter((subitem) => subitem.id === item.id)[0].asian_categories[0]?.name;
                })
            }

            const {data: _categories_data } = await supabaseAdmin.from('asian_categories')
                .select(`*, asian_items ( id, name )`)
                .not('name', 'is', null)
                .order('id', { ascending: true })
                .eq("city_id", _cities_data?.filter((item:CityType) => item.name === city_name)[0]?.id);

            if(_categories_data && _categories_data.length > 0) {
                _new_categories_data = _categories_data;

                const {data: _items_data } = await supabaseAdmin.from('asian_items')
                    .select(`*, asian_elements (id, name), asian_cities (id, name), asian_categories (id, name), asian_page_type (id, name), asian_images (id, url)`)
                    .not('name', 'is', null)
                    .order('id', { ascending: true })
                    .eq("city_id", _new_cities_data?.filter((item:CityType) => item.name === city_name)[0]?.id)
                    .eq("category_id", _new_categories_data?.filter((item:CategoryType) => item.name === category_name)[0]?.id);
                
                if(_items_data) {
                    _new_items_data = _items_data;
                }
            }
        }
        
        res.status(200).json({
            element_data: _element_data[0],
            cities: _new_cities_data,
            categories:_new_categories_data,
            items: _new_items_data
        });
    }
}