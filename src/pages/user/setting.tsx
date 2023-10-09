import { 
    Grid, 
    Box, 
    useMantineTheme,
    Avatar, 
    Flex, 
    Text, 
    Button, 
    Textarea, 
    Loader, 
    Image, 
    NavLink, 
    Card,
    Group,
    TextInput,
    PasswordInput,
    Divider,
} from "@mantine/core";
import { Dropzone } from '@mantine/dropzone';
import { IconChevronRight } from '@tabler/icons-react';
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from 'next/router';
import HomeContext from '@/state/index.context';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useForm, isNotEmpty, isEmail, isInRange, hasLength, matches, matchesField } from '@mantine/form';

const Setting = () => {
    const user = useUser();
    const router = useRouter();
    const theme = useMantineTheme();
    const openDropzoneRef = useRef<() => void>(null);

    const {
        state: { user_profile },
        dispatch: homeDispatch,
    } = useContext(HomeContext);

    const [avatarSrc, setAvatarSrc] = useState<string>(user_profile.avatar_url)
    const [isLoad, setIsLoad] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('');

    const accountform = useForm({
        initialValues: {
            full_name: user_profile.full_name,
            email: user_profile.email
        },

        validate: {
            full_name : isNotEmpty("Please Enter Username"),
            email: isEmail('Invalid email'),
        },
    });

    const securityform = useForm({
        initialValues: {
            password: '',
            password_confirm: ''
        },

        validate: {
            password : isNotEmpty("Please Enter Password"),
            password_confirm: matchesField('password', 'Passwords are not the same'),
        },
    });

    const profileform = useForm({
        initialValues: {
            avatar_url: user_profile.avatar_url,
            first_name: user_profile.first_name,
            last_name: user_profile.last_name,
            website: user_profile.website,
            bio: user_profile.bio,
            location: user_profile.location,
        },
    });

    const socialform = useForm({
        initialValues: {
            instagram_link: user_profile.instagram,
            facebook_link: user_profile.facebook,
            twitter_link: user_profile.twitter
        },
    });

    const updateAccount = async(values : any) => {
        if(values.full_name === user_profile.full_name && values.email === user_profile.email) {
            notifications.show({
                message: 'No updated information',
                color: 'warning'
            });
        }

        setIsLoad(true);
        try {
            const res = await fetch('/api/user/profile/update_account_information', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    user_id: user?.id,
                    full_name: values.full_name,
                    email: values.email
                }),
            })
            if (res.status == 200) {
                const data = await res.json();
                homeDispatch({
                    field: 'user_profile',
                    value: data[0]
                })
                notifications.show({
                    message: 'Success',
                    color: 'default'
                });
            } else {

            }
        } catch (e) {
            console.log(e);
        }
        setIsLoad(false);
    }

    const updateSecurity = async(values : any) => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/user/profile/update_security_information', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    user_id: user?.id,
                    password: values.password
                }),
            })
            if (res.status == 200) {
                notifications.show({
                    message: 'Success',
                    color: 'default'
                });
            } else {

            }
        } catch (e) {
            console.log(e);
        }
        setIsLoad(false);
    }

    const convertToBase64 = async (file: File) => {
        const readAsDataURL = () => {
            return new Promise((resolve, reject) => {
                const FR = new FileReader();

                FR.addEventListener("load", function (evt) {
                    const event = evt as ProgressEvent<FileReader>; // Casting evt to ProgressEvent<FileReader>

                    if (event.target && typeof event.target.result === "string") { // Adding type check for result property
                        const target = event.target as FileReader & {
                            result: string; // Specify the correct type for result property
                        };

                        resolve(target.result);
                    } else {
                        reject(new Error("Invalid file format"));
                    }
                });

                FR.onerror = () => {
                    reject(new Error("Failed to read file"));
                };

                FR.readAsDataURL(file);
            });
        };

        const result = await readAsDataURL();
        profileform.setFieldValue('avatar_url', result as string);
        setAvatarSrc(result as string);
    }

    const updateProfile = async(values : any) => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/user/profile/update_profile_information', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    user_id: user?.id,
                    avatar_url: values.avatar_url,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    website: values.website,
                    bio: values.bio,
                    location: values.location
                }),
            })
            if (res.status == 200) {
                const data = await res.json();
                homeDispatch({
                    field: 'user_profile',
                    value: data[0]
                })
                notifications.show({
                    message: 'Success',
                    color: 'default'
                });
            } else {

            }
        } catch (e) {
            console.log(e);
        }
        setIsLoad(false);
    }

    const updateSocial = async(values : any) => {
        setIsLoad(true);
        try {
            const res = await fetch('/api/user/profile/update_social_information', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    user_id: user?.id,
                    instagram_link: values.instagram_link,
                    twitter_link: values.twitter_link,
                    facebook_link: values.facebook_link
                }),
            })
            if (res.status == 200) {
                const data = await res.json();
                homeDispatch({
                    field: 'user_profile',
                    value: data[0]
                })
                notifications.show({
                    message: 'Success',
                    color: 'default'
                });
            } else {

            }
        } catch (e) {
            console.log(e);
        }
        setIsLoad(false);
    }

    useEffect(() => {
        if (user_profile.id === null || user_profile.id === '' ) {
            router.push('/');
        }

        const handleScroll = () => {
            const sections = Array.from(document.querySelectorAll('.link_section'));

            let currentSection = '';

            for (let i = sections.length - 1; i >= 0; i--) {
                const rect = sections[i].getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.5) {
                    currentSection = sections[i].id;
                    break;
                }
            }

            if(currentSection !== '') {
                setActiveSection(currentSection);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
    
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
        user && 
        <Grid>
            <Grid.Col 
                span={2}
            >
                <Box
                    style={{
                        position: 'sticky',
                        top: '85px',
                        left: '20px'
                    }}
                >
                    <Box
                        style={{
                            borderRadius: 5,
                            border: '1px solid',
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                            width: '100%',
                            height: 80,
                            padding: '0 20px'
                        }}
                    >
                        <Flex
                            align='center'
                            style={{
                                height: '100%'
                            }}
                        >
                            <Avatar color="blue" radius="50px" size={50}>
                            {
                                user_profile.avatar_url !== '' ?
                                <Image src={user_profile.avatar_url} alt="" /> : null
                            }
                            </Avatar>
                            <Text
                                sx={(theme) => ({
                                    color: theme.colors.gray[8],
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    marginLeft: 20
                                })}
                                size='1rem'
                                weight={800}
                            >
                                {
                                    user_profile.full_name
                                }
                            </Text>
                        </Flex>
                    </Box>
                    <Box 
                        style={{
                            marginTop: 15,
                            width: '100%',
                        }}
                    >
                        <NavLink
                            label="Account"
                            rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                            style={{
                                height: 50,
                                border: '1px solid',
                                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                                borderBottom: 'hidden',
                            }}
                            component="a"
                            href="#account_section"
                            active= {activeSection === 'account_section'? true : false}
                        />
                        <NavLink 
                            label="Security"
                            rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                            style={{
                                height: 50,
                                border: '1px solid',
                                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                                borderBottom: 'hidden',
                            }}
                            component="a"
                            href="#security_section"
                            active= {activeSection === 'security_section'? true : false}
                        />
                        <NavLink
                            label="Profile"
                            rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                            style={{
                                height: 50,
                                border: '1px solid',
                                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                                borderBottom: 'hidden',
                            }}
                            component="a"
                            href="#profile_section"
                            active= {activeSection === 'profile_section'? true : false}
                        />
                        <NavLink 
                            label="Social Profiles"
                            rightSection={<IconChevronRight size="0.8rem" stroke={3} />}
                            style={{
                                height: 50,
                                border: '1px solid',
                                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.dark[0],
                                // borderBottom: 'hidden',
                            }}
                            component="a"
                            href="#social_section"
                            active= {activeSection === 'social_section'? true : false}
                        />
                    </Box>
                </Box>
            </Grid.Col>
            <Grid.Col span={10}>
                {
                    isLoad ? 
                    <Box mt={30} sx={(theme) => ({
                        textAlign: 'center'
                    })}>
                        <Loader />
                    </Box>  
                    :
                    <Box>
                        <Card withBorder shadow="sm" radius="md" id="account_section" className="link_section">
                            <Card.Section withBorder pl="md" py="md" >
                                <Group position="apart">
                                    <Text weight={500}>Account</Text>
                                </Group>
                            </Card.Section>
    
                            <Card.Section p="md">
                                <Box
                                    style={{
                                        width : '30%'
                                    }}
                                >
                                    <form onSubmit={accountform.onSubmit((values) => updateAccount(values))}>
                                        <TextInput 
                                            label="Username" 
                                            placeholder="Enter Username"
                                            {...accountform.getInputProps('full_name')}
                                            required />
                                        <TextInput 
                                            label="Email" 
                                            placeholder="Enter Email"
                                            {...accountform.getInputProps('email')}
                                            required />
                                        <Group position="left" mt="md">
                                            <Button type="submit">Save</Button>
                                            <Button type="button" variant="default">Reset</Button>
                                        </Group>
                                    </form>
                                </Box>
                            </Card.Section>
                        </Card>
    
                        <Card withBorder shadow="sm" radius="md" mt='md' id="security_section" className="link_section">
                            <Card.Section withBorder pl="md" py="md" >
                                <Group position="apart">
                                    <Text weight={500}>Security</Text>
                                </Group>
                            </Card.Section>
    
                            <Card.Section p="md">
                                <Box
                                    style={{
                                        width : '30%'
                                    }}
                                >
                                    <form onSubmit={securityform.onSubmit((values) => updateSecurity(values))}>
                                        <PasswordInput 
                                            label="Password" 
                                            placeholder="Enter Password" 
                                            {...securityform.getInputProps('password')}
                                            required 
                                        />
                                        <PasswordInput 
                                            label="Password Confirmation" 
                                            name="password_confirm" 
                                            placeholder="Confirm Password" 
                                            {...securityform.getInputProps('password_confirm')}
                                            required 
                                        />
                                        <Group position="left" mt="md">
                                            <Button type="submit">Save</Button>
                                            <Button type="button" variant="default">Reset</Button>
                                        </Group>
                                    </form>
                                </Box>
                            </Card.Section>
                        </Card>
    
                        <Card withBorder shadow="sm" radius="md" mt='md' id="profile_section" className="link_section">
                            <Card.Section withBorder pl="md" py="md" >
                                <Group position="apart">
                                    <Text weight={500}>Profile</Text>
                                </Group>
                            </Card.Section>
    
                            <Card.Section p="md">
                                <Box
                                    style={{
                                        width : '30%'
                                    }}
                                >
                                    <form onSubmit={profileform.onSubmit((values) => updateProfile(values))}>
                                        <Group>
                                            <Avatar color="blue" radius="50px" size={50}>
                                            {
                                                avatarSrc !== '' ?
                                                <Image src={avatarSrc} alt="" /> : null
                                            }
                                            </Avatar>
                                            <Dropzone
                                                accept={{
                                                    'image/*': [], // All images
                                                    'text/html': ['.png', '.jpg'],
                                                }}
                                                sx={(theme) => ({
                                                    display: 'none'
                                                })}
                                                onDrop={(files) => { convertToBase64(files[0]) }}
                                                openRef={openDropzoneRef}
                                            >
                                            </Dropzone>
                                            <TextInput 
                                                sx={(theme) => ({
                                                    display: 'none'
                                                })}
                                                {...profileform.getInputProps('avatar_url')}
                                            />
                                            <Button onClick={() => openDropzoneRef.current && openDropzoneRef.current() }>Update Picture</Button>
                                            <Button type="button" variant="default">Delete Image</Button>
                                        </Group>
                                        <Divider my='md'/>
                                        <TextInput 
                                            label="First Name" 
                                            placeholder="Enter First Name" 
                                            {...profileform.getInputProps('first_name')}
                                        />
                                        <TextInput 
                                            label="Last Name" 
                                            placeholder="Enter Last Name" 
                                            {...profileform.getInputProps('last_name')}
                                        />
                                        <TextInput 
                                            label="Website" 
                                            placeholder="Enter Personal Website URL" 
                                            {...profileform.getInputProps('website')}
                                        />
                                        <Textarea 
                                            label="Bio" 
                                            placeholder="Enter Bio"
                                            {...profileform.getInputProps('bio')}
                                        />
                                        <TextInput 
                                            label="Location" 
                                            name="location" 
                                            {...profileform.getInputProps('location')}
                                        />
                                        <Group position="left" mt="md">
                                            <Button type="submit">Save</Button>
                                            <Button type="button" variant="default">Reset</Button>
                                        </Group>
                                    </form>
                                </Box>
                            </Card.Section>
                        </Card>
                        
                        <Card withBorder shadow="sm" radius="md" mt='md' id="social_section" className="link_section">
                            <Card.Section withBorder pl="md" py="md" >
                                <Group position="apart">
                                    <Text weight={500}>Profile</Text>
                                </Group>
                            </Card.Section>
                            
                            <Card.Section p="md">
                                <Box
                                    style={{
                                        width : '30%'
                                    }}
                                >
                                    <form onSubmit={socialform.onSubmit((values) => updateSocial(values))}>
                                        <TextInput 
                                            label="Instagram" 
                                            placeholder="Enter Instagram"
                                            {...socialform.getInputProps('instagram_link')}
                                        />
                                        <TextInput 
                                            label="Twitter" 
                                            placeholder="Enter Twitter" 
                                            {...socialform.getInputProps('twitter_link')}
                                        />
                                        <TextInput 
                                            label="Facebook" 
                                            placeholder="Enter Facebook" 
                                            {...socialform.getInputProps('facebook_link')}
                                        />
                                        <Group position="left" mt="md">
                                            <Button type="submit">Save</Button>
                                            <Button type="button" variant="default">Reset</Button>
                                        </Group>
                                    </form>
                                </Box>
                            </Card.Section>
                        </Card>
                    </Box>
                }
            </Grid.Col>
        </Grid>
    )
}

export default Setting;