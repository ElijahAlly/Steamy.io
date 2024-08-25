import { supabase } from "@/lib/supabase";
import { ChannelFromSupabase, ChannelSearchFromTwitch } from "@/types/channel";
import { SectionType } from "@/types/section";
import { UserFromSupabase, UserTypeForSteamy } from "@/types/user";
import { steamySections } from "@/util/sections";

// Insert a new channel into the supabase DB
export const addChannelToSupabase = async (channel: ChannelSearchFromTwitch, user: UserFromSupabase) => {
    try {
        // Step 1: Check if the channel exists in the twitch_channels table
        let { data: existingChannel, error: fetchError } = await supabase
            .from('twitch_channels')
            .select('broadcaster_login')
            .eq('broadcaster_login', channel.broadcaster_login)
            .single();

        // console.log('existingChannel', existingChannel);
        // console.log('fetch channel Error', fetchError);

        if (fetchError && fetchError.code !== 'PGRST116') {
            // Handle errors other than "No rows found" (which is expected when the channel doesn't exist)
            console.error('Error fetching channel:', fetchError);
            return;
        }

        if (!existingChannel) {
            console.log('aadding channel and sections....')
            // channel does not exist, create channel
            let { data: newChannel, error: insertError } = await supabase
                .from('twitch_channels')
                .insert([{
                    broadcaster_login: channel.broadcaster_login, 
                    channel_id: channel.id,
                    thumbnail_url: channel.thumbnail_url
                }])
                .single();

            // console.log('newchannel', newChannel);
            // console.log('insert channel Error', insertError);

            if (insertError) {
                console.error('Error inserting new channel:', insertError);
                return;
            }

            steamySections.map(async (section) => {
                let { data: newChannelSection, error: insertSectionsError } = await supabase
                    .from('sections')
                    .insert([{ ...section, broadcaster_login: channel.broadcaster_login }])
                    .single();

                // console.log('new Channel Section', newChannelSection);
                // console.log('insert Sections Error', insertSectionsError);
            })
        }

        // Step 3: Append the channel ID to the user's twitch_channels array
        let { data: updatedUser, error: appendError } = await supabase
            .rpc('append_and_return_twitch_channels', {
                user_id: user.id,
                new_channel_broadcaster_login: channel.broadcaster_login
            });

        if (appendError) {
            console.error('Error appending channel to user:', appendError);
            return;
        }

        // console.log('Channel added to user:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.log('error', error)
    }
}

// Get channels user added
export const getUserChannelsFromSupabase = async (user: UserFromSupabase): Promise<ChannelFromSupabase[] | undefined>  => {
    try {
        let { data: usersChannels, error: fetchError } = await supabase
            .from('twitch_channels')
            .select('*')
            .in('broadcaster_login', user.twitch_channels as string[]);

        // console.log('usersChannels', usersChannels);
        return usersChannels || [];
    } catch (err) {
        console.error(err);
    }
}

// Get channels user added
export const removeChannelFromUserSupabase = async (user: UserTypeForSteamy, broadcasterLogin: string): Promise<UserFromSupabase | undefined>  => {
    if (!broadcasterLogin) return;
    try {
        let { data: updatedUser, error: removeError } = await supabase
            .rpc('remove_channel_and_return_user', {
                user_id: user?.supabase.id,
                channel_to_remove: broadcasterLogin
            });

        console.log('updatedUser', updatedUser);
        return updatedUser || undefined;
    } catch (err) {
        console.error(err);
    }
}

// Get channel sections
export const getChannelSectionsFromSupabase = async (broadcasterLogin: string): Promise<SectionType[] | undefined>  => {
    try {
        // console.log(broadcasterLogin);
        let { data: channelSections, error: fetchError } = await supabase
            .from('sections')
            .select('*')
            .eq('broadcaster_login', broadcasterLogin);

        // console.log('channelSections', channelSections);
        return channelSections || [];
    } catch (err) {
        console.error(err);
    }
}