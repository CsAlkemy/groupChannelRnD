import React, { useState } from 'react';
import SBConversation from '@sendbird/uikit-react/GroupChannel';
import SBChannelList from '@sendbird/uikit-react/GroupChannelList';
import SBChannelSettings from '@sendbird/uikit-react/ChannelSettings';
import SendbirdChat from "@sendbird/chat";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";

const APP_ID = '056577F4-6676-4C34-B8DB-C82332A6E52C';

export default function CustomizedApp() {
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannelUrl, setCurrentChannelUrl] = useState('sendbird_group_channel_353430624_aad377fd9c7e771d78fb2797a0f077b7b7176b56');

  const createUserInSendBird = async (userId) => {
    try {
      const response = await fetch(`https://api-${APP_ID}.sendbird.com/v3/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Token': '577e2f6c46a0f5f6d7381f3e6d9f25814133e212', // Replace with your SendBird API token
        },
        body: JSON.stringify({
          user_id: userId,
          nickname: userId,
          profile_url:userId,
          profile_file:userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const userData = await response.json();
      console.log('User created successfully:', userData);
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };

  const inviteUsers = async (userIds) => {
    try {
      await Promise.all(userIds.map(createUserInSendBird));

      // Initialize Sendbird Chat instance
      const sendbirdChat = await SendbirdChat.init({
        appId: APP_ID,
        localCacheEnabled: true,
        modules: [new GroupChannelModule()]
      });

      // Connect to Sendbird server
      await sendbirdChat.connect('sendbirdian-200720');

      // Retrieve the group channel
      const channel = await sendbirdChat.groupChannel.getChannel(currentChannelUrl);
      console.log(channel.members);

      // Invite users as members to the group channel
      await channel.inviteWithUserIds(userIds);

      console.log('Users invited successfully.');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="customized-app">
      <div className="sendbird-app__wrap">
        <div className="sendbird-app__channellist-wrap">
          <SBChannelList
            allowProfileEdit={false}
            selectedChannelUrl={currentChannelUrl}
            onChannelCreated={(channel) => {
              setCurrentChannelUrl(channel.url);
            }}
            onChannelSelect={(channel) => {
              setCurrentChannelUrl(channel?.url); // Optional chaining to handle undefined channel
            }}
          />
        </div>
        <div className="sendbird-app__conversation-wrap">
          <SBConversation
            channelUrl={currentChannelUrl}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
          />
        </div>
      </div>
      {showSettings && (
        <div className="sendbird-app__settingspanel-wrap">
          <SBChannelSettings
            channelUrl={currentChannelUrl}
            onCloseClick={() => {
              setShowSettings(false);
            }}
          />
        </div>
      )}
      <button onClick={() => inviteUsers(['Hello', 'world'])}>Invite Users</button>
    </div>
  );
}
