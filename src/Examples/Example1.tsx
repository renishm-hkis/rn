import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {Text} from 'react-native';

const Example1 = () => {
  const [videoCall, setVideoCall] = useState(false);
  const connectionData = {
    appId: '41b859b3fa13417491d567330522854a',
    channel: 'test',
  };

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  return videoCall ? (
    <AgoraUIKit connectionData={connectionData} rtcCallbacks={callbacks} />
  ) : (
    <Text onPress={() => setVideoCall(true)}>Start Call</Text>
  );
};

export default Example1;
