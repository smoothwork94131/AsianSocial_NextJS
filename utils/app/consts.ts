import { IconCloud, IconMessage, IconListDetails, IconList } from '@tabler/icons-react';
export const ADMIN_MENU =[
  {
      url: 'dashboard', name:'Dashboard', icon: IconCloud
  },
  {
      url: 'Tag', name:'Elements', icon: IconMessage
  },
  {
      url: 'category', name:'Categories', icon: IconList
  },
  {
      url: 'item', name:'Items', icon: IconListDetails
  },
];

export const SUPABSE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABSE_ANNON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
