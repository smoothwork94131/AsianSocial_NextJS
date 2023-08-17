// export const SUPABSE_URL = process.env.SUPABASE_URL;
// export const SUPABSE_ANNON_KEY = process.env.SUPABASE_ANNON_KEY;

export const SUPABSE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  export const SUPABSE_ANNON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const MENU = [
  {
    url: '', name:'Explore', show_desktop: true
  },
  {
    url: '', name:'Get Pro', show_desktop: true
  },
  {
    url: '', name:'About', show_desktop: false
  },
  {
    url: '', name:'Pro Account', show_desktop: false
  },
  {
    url: '', name:'News & Updates', show_desktop: false
  },
  {
    url: '', name:'Support', show_desktop: false
  },
  {
    url: '', name:'Sitemap', show_desktop: false
  },
]

export const ELEMENTS = [
  {
    url:'', name: 'Businesses'
  },
  {
    url:'', name: 'Food'
  },
  {
    url:'', name: 'News'
  },
  {
    url:'', name: 'Events'
  }
]