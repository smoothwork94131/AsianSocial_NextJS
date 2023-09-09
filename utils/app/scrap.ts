import axios from 'axios';
import cheerio from 'cheerio';

export const fetchPageContent = async (
    url:string
) => {

    const res = await fetch('https://markprompt.com/api/integrations/website/fetch-page', {
        method: 'POST',
        headers: {
            // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImtzYWpYdFFRakMwZkMzdnQiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjk0MTA1ODg2LCJpYXQiOjE2OTQxMDIyODYsImlzcyI6Imh0dHBzOi8vY3BqdnFhcWxib3JodHhqeWNtZ2Quc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjZlZDg2ZWUyLTc1OWEtNDZkMS1iYjA2LTUwYzliN2RmNDRmMyIsImVtYWlsIjoicG9zdHVyZTA2MDlAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjVTBQZGF2VC13RDVMdnpzdWJnMlJlQkxmTUdXaGZWekNIcDJUVlpFZ1BXQT1zOTYtYyIsImVtYWlsIjoicG9zdHVyZTA2MDlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IlN1cGVyIERldiIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTdXBlciBEZXYiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y1UwUGRhdlQtd0Q1THZ6c3ViZzJSZUJMZk1HV2hmVnpDSHAyVFZaRWdQV0E9czk2LWMiLCJwcm92aWRlcl9pZCI6IjEwNzM4MTExMzc2NjcwMjA3MTE5OCIsInN1YiI6IjEwNzM4MTExMzc2NjcwMjA3MTE5OCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNjk0MTAyMjg2fV0sInNlc3Npb25faWQiOiIwNmI3MGRhNy0yMDdiLTRkYWItYTVhMy1jNDI2N2VkNjA4ZmEifQ.Wn17E__FjS7CmKuO1LnScs8dRT6MFe0l0Pgfn7n9Fyk`,
            'Content-Type': 'application/json',
            'Cookie': '__stripe_mid=04b850ef-9896-4ca7-89ca-2efadc46260b0d538b; supabase-auth-token=%5B%22eyJhbGciOiJIUzI1NiIsImtpZCI6InA2SS9NdHJKYi9oUVkwMGUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjk0NzEyNDU1LCJpYXQiOjE2OTQxMDc2NTUsImlzcyI6Imh0dHBzOi8vbmZ4dGZteHpub3Ruenltc3N1Ynguc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjI5OGQyNDBjLTUxZDItNGM3Yi1hNTEwLWEzNjk1NzhhMGEwNCIsImVtYWlsIjoicG9zdHVyZTA2MDlAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQWNIVHRjVTBQZGF2VC13RDVMdnpzdWJnMlJlQkxmTUdXaGZWekNIcDJUVlpFZ1BXQT1zOTYtYyIsImVtYWlsIjoicG9zdHVyZTA2MDlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IlN1cGVyIERldiIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTdXBlciBEZXYiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0Y1UwUGRhdlQtd0Q1THZ6c3ViZzJSZUJMZk1HV2hmVnpDSHAyVFZaRWdQV0E9czk2LWMiLCJwcm92aWRlcl9pZCI6IjEwNzM4MTExMzc2NjcwMjA3MTE5OCIsInN1YiI6IjEwNzM4MTExMzc2NjcwMjA3MTE5OCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNjkzNDI1ODEzfV0sInNlc3Npb25faWQiOiIxOGQ2MTQ3Ny0xZTQ2LTRmMTgtODFmZS0yNjc4NGY5YWVkMDQifQ.74BgxfDoKKF4skoTFwhE2YqsxG5Z-a_bSBipoq5FsK0%22%2C%22QXyAbrqCoHRoS0WTj3fp6g%22%2Cnull%2Cnull%2Cnull%5D'
        },
        body: JSON.stringify({
            immediate: false,
            url: url,
            useCustomPageFetcher: false
        })
    })

    if (res.ok) {
        return (await res.json()).content;
    }
    return undefined;
};

export const fetchSitemapUrls = async (
    sitemapUrl: string,
) => {
    const sitemap = await fetchPageContent(
        sitemapUrl
    );

    if (!sitemap) {
        return [];
    }

    const pageUrls: string[] = [];

    const addPageUrl = (url: string) => {
        try {
            const normalizedUrl = removeTrailingSlashQueryParamsAndHash(url);
            if (!pageUrls.includes(normalizedUrl)) {
                pageUrls.push(normalizedUrl);
            }
        } catch {
            // Ignore page
        }
    };

    const $ = cheerio.load(sitemap, { xmlMode: true });
    
    const subSitemapUrls:string[] = [];


    $('sitemapindex > sitemap > loc').each(function (this: any) {
        const url = $(this).text();
        console.log(url);
        if (!subSitemapUrls.includes(url)) {
            subSitemapUrls.push(url);
        }
    });


    for (const subSitemapUrl of subSitemapUrls) {
        const subPageUrls = await fetchSitemapUrls(
            subSitemapUrl
        );

        for (const subPageUrl of subPageUrls) {
            addPageUrl(subPageUrl);
        }
    }

    $('url').each(function (this: any) {
        let lastmod = '';
        let url = '';

        $(this).find('lastmod').each(function (this: any) {
            lastmod = $(this).text();
        })

        $(this).find('loc').each(function (this: any) {
            url = $(this).text();
        })
        addPageUrl(url)
    });
    return pageUrls;
};


const removeTrailingSlashQueryParamsAndHash = (url: string) => {
    const urlObj = new URL(url);
    urlObj.search = '';
    urlObj.hash = '';
    return urlObj.toString().replace(/\/+$/, '');
};