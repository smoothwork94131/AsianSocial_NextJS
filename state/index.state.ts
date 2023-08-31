export interface HomeInitialState {
    colorScheme: 'light' | 'dark';
    lightMode: 'light' | 'dark';
    avatar_url: string | null,
}

export const initialState: HomeInitialState = {
    colorScheme: 'light',
    lightMode: 'light',
    avatar_url: null
};
  