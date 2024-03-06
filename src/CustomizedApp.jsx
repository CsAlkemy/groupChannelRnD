import React, {useState} from 'react';
import SBConversation from '@sendbird/uikit-react/GroupChannel';
import SBChannelList from '@sendbird/uikit-react/GroupChannelList';
import SBChannelSettings from '@sendbird/uikit-react/ChannelSettings';
import SendbirdChat from "@sendbird/chat";
import {GroupChannelModule} from "@sendbird/chat/groupChannel";

const APP_ID ='056577F4-6676-4C34-B8DB-C82332A6E52C'

export default function CustomizedApp() {
  const [showSettings, setShowSettings] = useState(false);
  const [currentChannelUrl, setCurrentChannelUrl] = useState('sendbird_group_channel_353430624_aad377fd9c7e771d78fb2797a0f077b7b7176b56');

  const inviteUsers = async (userIds) => {
    try {
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
      console.log("##########",channel);

      // Add users as participants to the group channel
      await channel.addParticipants(userIds);
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
      <button onClick={() => inviteUsers(['USER_ID_1', 'USER_ID_2'])}>Invite Users</button>
    </div>
  );
}
