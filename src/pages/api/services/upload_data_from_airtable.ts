
import { airtable, Businesses_airtable } from "@/utils/server/airtable";
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from "axios";
type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const options = { pageSize: 50 };

    Businesses_airtable.select(options).eachPage(
        function page(records, fetchNextPage) {
            // setAllData((prev_data) => [...prev_data, ..._records]);
            console.log(records);
            fetchNextPage();
        },
        function done(error) {
            if (error) {
                console.log(error);
            } else {

            }
        }
    );
    res.status(200).json({ name: 'John Doe' })
}

