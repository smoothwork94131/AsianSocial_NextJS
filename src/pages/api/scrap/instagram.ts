import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchSitemapUrls, fetchPageContent } from '@/utils/app/scrap';
import { Businesses_airtable } from '@/utils/server/airtable';
import cheerio from 'cheerio';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const html = await await fetchPageContent('https://www.instagram.com/explore/');
    console.log(html);
    res.status(200).json(html);
}