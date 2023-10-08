import { ProfileType, ProfileState } from '@/types/profile'


export interface HomeInitialState {
    colorScheme: 'light' | 'dark';
    lightMode: 'light' | 'dark';
    user_profile: ProfileType,
}

export const initialState: HomeInitialState = {
    colorScheme: 'light',
    lightMode: 'light',
    user_profile: ProfileState
};
  