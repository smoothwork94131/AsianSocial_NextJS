import type { NextApiRequest, NextApiResponse } from 'next'
import axios
  from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { supabaseAdmin } from '@/utils/server/supabase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = 'https://www.tiktok.com/tag/restaurant';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const video_urls: any = [];
    $('a').each(function () {
      const url: any = $(this).attr("href");
      let image_url: any = '';

      if (url?.indexOf("/video") > -1) {
        $(this).find("img").each(function () {
          image_url = $(this).attr("src");
        })
        video_urls.push({
          page_url: url,
          image_url
        });
      }
    })



    await supabaseAdmin.from("asian_videos").delete().neq("id", -1);
    for (let k = 0; k < video_urls.length; k++) {
      const { error } = await supabaseAdmin.from("asian_videos").insert([{
        type: 'tiktok',
        page_url: video_urls[k].page_url,
        image_url: video_urls[k].image_url
      }])
      console.log(error);
    }

  } catch (error) {
    console.error('Error retrieving restaurant hashtags:', error);
    return [];
  }
  res.status(200).json({ name: 'John Doe' })
}
