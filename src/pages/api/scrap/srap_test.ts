
import type { NextApiRequest, NextApiResponse } from 'next'

import cheerio from 'cheerio';
import { PAGE_LINKS } from '@/utils/server/consts';
import ExcelJs from 'exceljs';

const data: any = [];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    //const text = await getPageContent('https://www.g2.com/products/weflow/reviews.html?focus_review=6720431&page=4&product_id=weflow');

    // const _data = [
    //     ['Name', 'Age'],
    //     ['John Doe', 30],
    //     ['Jane Smith', 25],
    // ];
    // const _data: any = [
    //     [
    //         "Sl. No.",
    //         "Company",
    //         "Review Date",
    //         "Rating",
    //         "Name",
    //         "Title",
    //         "Company Type (Small, Mid-Market, Enterprise)",
    //         "# of Employees",
    //         "Headline",
    //         "What do you like best about X?",
    //         "What do you dislike about X?",
    //         "What problems is X solving and how is that benefiting you?",
    //     ]
    // ];

    // let cnt = 0;
    // SCRAP_JSON.map((item: any) =>{
    //     _data.push([
    //         cnt,
    //         item.company_name,
    //         item.review_date,
    //         item.stars,
    //         item.name,
    //         item.title,
    //         item.business_type,
    //         item.of_employees,
    //         item.headerline,
    //         item.what_do_you_like_best_about_X,
    //         item.what_do_you_dislike_best_about_X,
    //         item.what_promblems_solving_x
    //     ])
    //     cnt++;
    // })

    // worksheet.addRows(_data);
    // workbook.xlsx.writeFile('output.xlsx')
    //     .then(function () {
    //         console.log('Excel file saved successfully.');
    //     })
    //     .catch(function (error) {
    //         console.error('Error saving Excel file:', error);
    //     });

    // res.status(200).json("success");
    // return;

    // const company_lists = [
    //     "https://www.g2.com/products/gong/reviews",
    //     "https://www.g2.com/products/clari/reviews",
    //     "https://www.g2.com/products/groove-a-clari-company/reviews",
    //     "https://www.g2.com/products/revenue-grid/reviews",
    //     "https://www.g2.com/products/boostup-ai/reviews",
    //     "https://www.g2.com/products/salesloft/reviews",
    //     "https://www.g2.com/products/outreach/reviews",
    //     "https://www.g2.com/products/revenue-io/reviews",
    //     "https://www.g2.com/products/kluster/reviews",
    //     "https://www.g2.com/products/weflow/reviews",
    //     "https://www.g2.com/products/mediafly-intelligence360-formerly-insightsquared/reviews",
    //     "https://www.g2.com/products/people-ai/reviews",
    //     "https://www.g2.com/products/aviso/reviews",
    //     "https://www.g2.com/products/jiminny/reviews",
    //     "https://www.g2.com/products/dreamdata/reviews",
    //     "https://www.g2.com/products/forwrd/reviews",
    //     "https://www.g2.com/products/discern/reviews",
    //     "https://www.g2.com/products/salesdirector-ai/reviews",
    //     "https://www.g2.com/products/xactly-forecasting/reviews",
    //     "https://www.g2.com/products/syncari/reviews",
    //     "https://www.g2.com/products/fullcast-io/reviews",
    //     "https://www.g2.com/products/setsail/reviews",
    //     "https://www.g2.com/products/collective-i/reviews",
    //     "https://www.g2.com/products/revsure-ai-revsure/reviews",
    //     "https://www.g2.com/products/nektar-ai/reviews",
    //     "https://www.g2.com/products/kizen/reviews",
    //     "https://www.g2.com/products/ebsta-s-revenue-intelligence-platform/reviews",
    //     "https://www.g2.com/products/modata/reviews",
    //     "https://www.g2.com/products/helloguru-helloguru/reviews",
    //     "https://www.g2.com/products/meetrecord/reviews",
    //     "https://www.g2.com/products/staircase-ai-2023-06-08/reviews",
    //     "https://www.g2.com/products/vertify/reviews",
    //     "https://www.g2.com/products/falkon/reviews",
    //     "https://www.g2.com/products/graphiti/reviews",
    //     "https://www.g2.com/products/ramp-software-ltd-ramp/reviews",
    //     "https://www.g2.com/products/sightfull/reviews"
    // ];

    // const links: any = [];
    // for (let k = 0; k < company_lists.length; k++) {
    //     let page_links: any = [];
    //     page_links = await getPageUrls(company_lists[k]);
    //     page_links.map((item: any) => {
    //         links.push(item);
    //     })
    // }

    // res.status(200).json(links);

    // return;
    // await getScrapContent(text);
    for (let k = 0; k < PAGE_LINKS.length; k++) {
        await getScrapContent(PAGE_LINKS[k])
    }
    res.status(200).json(data);
}

const getPageUrls = async (url: string) => {
    const text = await getPageContent(url);
    let links: any = [];

    try {
        const $ = cheerio.load(text);
        let last_link: any = '';
        $(".pagination").each(function () {
            $(this).find("li").each(function () {
                $(this).find("a").each(function () {
                    last_link = $(this).attr("href");
                })
            })
        })
        let cnt = 0;
        let base_url = "";
        let next_url = "";
        if (last_link != "") {
            const sec_split = last_link.split("&page=")[1];
            cnt = sec_split.split("&")[0];
            base_url = last_link.split("&page=")[0] + "&page=";
            next_url = sec_split.split("&")[1]
        }

        for (let k = 1; k <= cnt; k++) {
            links.push(base_url + k + "&" + next_url);
        }
    } catch (e) {
        console.log("-------------Error------------");
        console.log(url);
    }

    if (links.length == 0) {
        links.push(url);
    }
    console.log(links);
    return links;
}

const getPageContent = async (url: string) => {
    let text: any = '';
    try {
        const result = await fetch(encodeURI(`https://proxy.scrapeops.io/v1/?api_key=39648be7-8e97-4757-8a33-b5677a9195c4&url=${url}`), {
            headers: {
                'Access-Control-Allow-Origin': "*"
            }
        });
        text = await result.text();
        console.log(text);
    } catch (e: any) {
        console.log(e);
        console.log(e.message);
        console.log(url);
    }
    return text;
}

const getScrapContent = async (url: any) => {
    const text = await getPageContent(url);

    const $ = cheerio.load(text);
    let company_name = '';
    let records: any = [];

    $(".paper__hd--no-padding").each(function () {
        const split = $(this).text().split(" Overview");
        company_name = split[0];
    })

    $(".paper--white").each(function (this: any) {
        let review_date: any = [];
        let stars: any = 5;
        let name: any = '';
        let title: any = '';
        let company_type: any = '';
        let what_do_you_like_best_about_X: any = '';
        let what_do_you_dislike_best_about_X: any = '';
        let what_promblems_solving_x: any = '';
        let headerline = '';
        let job_title = '';
        let business_type = '';
        let of_employees = '';

        $(this).find('time').each(function () {
            review_date = $(this).attr('datetime');
        })
        $(this).find('.link--header-color').each(function () {
            name = $(this).text();
        })

        $(this).find('.stars').each(function () {
            const classes = $(this).attr('class');
            let str_classes: any = classes?.split("stars-");
            // stars = str_classes[1];
            if (str_classes) {
                stars = str_classes[1] / 2;
            }
        })
        $(this).find('h3').each(function () {
            title = $(this).text();
        })
        $(this).find('.line-height-h6').each(function () {
            $(this).find("span").each(function () {
                company_type = $(this).text();
            })
        })

        $(this).find('h3').each(function () {
            headerline = $(this).text();
        })

        // var divsWithReviewBody = $('div[itemprop=reviewBody]');
        $(this).find('div[itemprop=reviewBody]').each(function () {
            let cnt = 0;

            $(this).find("div").each(function () {
                let content: string = '';
                if (cnt == 0) {
                    $(this).find("div").each(function () {
                        $(this).find("p").each(function () {
                            content += $(this).text();
                        })
                    })
                    what_do_you_like_best_about_X = content;
                } else if (cnt == 2) {
                    $(this).find("div").each(function () {
                        $(this).find("p").each(function () {
                            content += $(this).text();
                        })
                    })
                    what_do_you_dislike_best_about_X = content;
                } else if (cnt == 4) {
                    $(this).find("div").each(function () {
                        $(this).find("p").each(function () {
                            content += $(this).text();
                        })
                    })
                    what_promblems_solving_x = content;
                }
                cnt++;
            })
        });

        let business_info: any = [];

        $(this).find('.line-height-h6').each(function () {
            $(this).find("div").each(function () {
                business_info.push($(this).text());
            })
        })
        if (business_info.length == 3) {
            job_title = business_info[1];
            // business_type =business_info[1];
            const types = business_info[2];
            const arr_types = types.split("(");
            business_type = arr_types[0];
            of_employees = arr_types[1].split(")")[0];
        } else if (business_info.length == 2) {
            job_title = business_info[0];
            // business_type =business_info[1];
            const types = business_info[1];
            const arr_types = types.split("(");
            business_type = arr_types[0];
            of_employees = arr_types[1].split(")")[0];
        } else if (business_info.length == 1) {
            // business_type =business_info[1];
            try {
                const types = business_info[0];
                const arr_types = types.split("(");
                business_type = arr_types[0];
                of_employees = arr_types[1].split(")")[0];
            } catch (e) {
            }
        }



        if (name != "") {
            const item = {
                name,
                review_date,
                title,
                stars,
                what_do_you_like_best_about_X,
                what_do_you_dislike_best_about_X,
                what_promblems_solving_x,
                job_title,
                business_type,
                of_employees,
                headerline,
                company_name
            };

            records.push(item);
        }
    })

    try {
        const _data: any = [];
        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile("output.xlsx");
        const worksheet = workbook.getWorksheet('Sheet1');

        records.map(async (item: any) => {

            _data.push([
                item.company_name,
                item.review_date,
                item.stars,
                item.name,
                item.title,
                item.business_type,
                item.of_employees,
                item.headerline,
                item.what_do_you_like_best_about_X,
                item.what_do_you_dislike_best_about_X,
                item.what_promblems_solving_x
            ])

        })
        worksheet.addRows(_data);
        await workbook.xlsx.writeFile('output.xlsx');
        console.log("added!");
    } catch (e) {

    }

}