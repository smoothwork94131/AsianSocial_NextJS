export interface ProfileType {
    id: string,
    updated_at: string,
    full_name: string,
    email: string,
    avatar_url: string,
    has_completed_onboarding: boolean,
    subscribe_to_product_updates: boolean,
    outreach_tag: string,
    first_name: string,
    last_name: string,
    website:string,
    bio: string,
    location: string,
    instagram: string,
    twitter: string,
    facebook: string
}

export const ProfileState: ProfileType = {
    id: '',
    updated_at: '',
    full_name: '',
    email: '',
    avatar_url: '',
    has_completed_onboarding: false,
    subscribe_to_product_updates: false,
    outreach_tag: '',
    first_name: '',
    last_name: '',
    website: '',
    bio: '',
    location: '',
    instagram: '',
    twitter: '',
    facebook: ''
}