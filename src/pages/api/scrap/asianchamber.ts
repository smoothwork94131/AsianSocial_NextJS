import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchSitemapUrls, fetchPageContent } from '@/utils/app/scrap';
import { Businesses_airtable } from '@/utils/server/airtable';
import cheerio from 'cheerio';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // const links = await fetchSitemapUrls('https://module.asianchamber-hou.org/sitemap.xml');
    const category_links = await getCategoryLinks();
    const data: any = [];

    for(let k=0; k<category_links.length; k++){
        let page_links: string[] =[];
        try{
            page_links = await getPageLinks(category_links[k].url);
        }catch(e) {
            console.log(e);
        }
        const company_info: any = [];
        for(let j=0; j<page_links.length; j++){
            let info:any = false;
            try{
                info = await getPageContent(page_links[j]);
            }catch(e){
                
            }
            console.log(info);
            if(info){
                company_info.push(info);
            }
        }

        // data.push({
        //     company_info: company_info,
        //     sub_category: category_links[k].name,
        //     category: 'asianchamber'
        // })
        await saveData([
            {
                company_info: company_info,
                sub_category: category_links[k].name,
                category: 'asianchamber'
            }
        ]);
    }


}

const saveData = async(data: any) => {
    console.log(data);
    for(let k=0; k<data.length; k++){
        const company_info = data[k].company_info;
        const sub_category =  data[k].sub_category;
        const category = data[k].category;
        for(let j=0; j<company_info.length; j++){
            const exist_records = await chkExistRecord(company_info[j].name);  
            const item = company_info[j];
            if(exist_records.length == 0){
                const table_data: any = [];
                table_data.push(
                    {
                        "fields": {
                            BusinessName: item.name,
                            Address: item.address,
                            Details: item.details,
                            MapUrl: item.map_url,
                            URL: item.sites_url,
                            TypeofBusiness: category,
                            SubType: sub_category,
                            PhoneNumber: item.phone_number,
                            ZipCode: Number(item.post_code),
                            City: item.city
                        }
                    }
                )
                try{
                   await Businesses_airtable.create(table_data)
                }catch(e){

                }
            }
        }
    }
}

const getCategoryLinks = async() => {
    const html = await fetchPageContent('https://module.asianchamber-hou.org/members');
    const $ = cheerio.load(html);
    const category_links: any =[];
    $('.gz-search-category option').each(function(this: any){
        if($(this).attr('data-slug-id')) {
            category_links.push({
                name: $(this).text(),
                id: $(this).val(),
                slug_id: $(this).attr('data-slug-id'),
                url: ` https://module.asianchamber-hou.org/members/category/${$(this).attr('data-slug-id')}?q=&c=${$(this).attr('data-slug-id')}&sa=False`
            })
        }

    })
    return category_links;
}

const getPageLinks = async(url: string) => {
    const html =  await fetchPageContent(url);
   
    const $ = cheerio.load(html);
    const links: string[] = [];
    $('.gz-list-card-wrapper').each(function(this: any) {
        let link: any ='';
        $(this).find('.card-header a').each(function () {
            link = $(this).attr('href');
        })  
        if(link != ""){
            links.push(link);
        }
    });
    return links;
}   

const getPageContent = async(url: string) => {
    const html =  await fetchPageContent(url);
    const $ = cheerio.load(html);
    return {
        address: $('.gz-street-address').text()+', '+$('.gz-address-city').text(),
        city: $('.gz-address-city').text(),
        phone_number: $('.gz-card-phone span').text(),
        sites_url: $('.gz-card-website a').attr('href'),
        details: $(".gz-details-about p").text(),
        map_url: $(".gz-map iframe").attr('src'),
        name: $(".gz-pagetitle").text(),
        post_code: $('span[itemprop="postalCode"]').text(),
        region: $('span[itemprop="addressRegion"]').text()
    }
}

const chkExistRecord = async (name: string) => {
    let records: any = [1];
    try{
        const filterOptions = {
            filterByFormula: "{BusinessName} = '"+name+"'",
        };
        records = await Businesses_airtable.select(filterOptions).all();
    }catch(e){

    }
    
    return records;
}
