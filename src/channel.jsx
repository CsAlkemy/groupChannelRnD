
import React, { useState, useEffect } from 'react';
import SendBird from 'sendbird';

function Channel() {
  const [channelUrl, setChannelUrl] = useState('');
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);

  const handleUrlChange = (event) => {
    setChannelUrl(event.target.value);
  };

  const getChannel = async () => {
    setError(null); // Clear any previous errors before fetching

    try {
      const fetchedChannel = await SendBird.groupChannel.getChannel(channelUrl);
      setChannel(fetchedChannel);
    } catch (error) {
      setError(error);
      console.error('Error retrieving channel:', error);
    }
  };

  useEffect(() => {
    // Initialize SendBird only once on component mount
    if (SendBird.getInstance() === null) {
      SendBird.init('056577F4-6676-4C34-B8DB-C82332A6E52C');
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Channel URL"
        value={channelUrl}
        onChange={handleUrlChange}
      />
      <button onClick={getChannel}>Get Channel</button>
      {error && <p>Error: {error.message}</p>}
      {channel && (
        <div>
          <h2>Channel Details</h2>
          <p>Name: {channel.name}</p>
          <p>Member Count: {channel.memberCount}</p>
          {/* Access and work with other channel properties and methods here */}
        </div>
      )}
    </div>
  );
}

export default Channel;
