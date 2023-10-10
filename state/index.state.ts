import { ProfileType, ProfileState } from '@/types/profile'
import { ElementType, ElementState } from '@/types/elements';

export interface HomeInitialState {
    colorScheme: 'light' | 'dark';
    lightMode: 'light' | 'dark';
    user_profile: ProfileType;
    elements: ElementType[]
}

export const initialState: HomeInitialState = {
    colorScheme: 'light',
    lightMode: 'light',
    user_profile: ProfileState,
    elements: [ElementState]
};
  