/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, NativeModules, Platform, Text} from 'react-native';
import {RtcEngine, RtcSurfaceView} from 'react-native-agora';

// const {Agora} = NativeModules; //Define Agora object as a native module

// const {AudioProfileDefault, AudioScenarioDefault} = Agora; //Set defaults for Stream

export default function Video(props) {
  const {AppID, ChannelName} = props.route.params;

  const [state, setState] = useState({
    peerIds: [], //Array for storing connected peers
    uid: Math.floor(Math.random() * 100), //Generate a UID for local user
    appid: AppID, //Enter the App ID generated from the Agora Website
    channelName: ChannelName, //Channel Name for the current session
    vidMute: false, //State variable for Video Mute
    audMute: false, //State variable for Audio Mute
    joinSucceed: false, //State variable for storing success
  });

  useEffect(() => {
    if (Platform.OS === 'android') {
      const config = {
        //Setting config of the app
        appid: state.appid, //App ID
        channelProfile: 0, //Set channel profile as 0 for RTC
        mode: 1,
        videoEncoderConfig: {
          width: 720,
          height: 1080,
          bitrate: 1,
          //   frameRate: FPS30,
          //   orientationMode: Adaptative,
        },
        // audioProfile: AudioProfileDefault,
        // audioScenario: AudioScenarioDefault,
      };
      RtcEngine.init(config); //Initialize the RTC engine
    }
  }, []);

  useEffect(() => {
    RtcEngine.on('userJoined', data => {
      const {peerIds} = state; //Get currrent peer IDs
      if (peerIds.indexOf(data.uid) === -1) {
        //If new user has joined
        setState({
          ...state,
          peerIds: [...peerIds, data.uid], //add peer ID to state array
        });
      }
    });
    RtcEngine.on('userOffline', data => {
      //If user leaves
      setState({
        ...state,
        peerIds: state.peerIds.filter(uid => uid !== data.uid), //remove peer ID from state array
      });
    });
    RtcEngine.on('joinChannelSuccess', data => {
      //If Local user joins RTC channel
      RtcEngine.startPreview(); //Start RTC preview
      setState({
        ...state,
        joinSucceed: true, //Set state variable to true
      });
    });
    RtcEngine.joinChannel(state.channelName, state.uid); //Join Channel
    RtcEngine.enableAudio(); //Enable the audio
  });

  const toggleAudio = () => {
    let mute = state.audMute;
    console.log('Audio toggle', mute);
    RtcEngine.muteLocalAudioStream(!mute);
    setState({...state, audMute: !mute});
  };

  const toggleVideo = () => {
    let mute = state.vidMute;
    console.log('Video toggle', mute);
    setState({...state, vidMute: !mute});
    RtcEngine.muteLocalVideoStream(!state.vidMute);
  };

  function endCall() {
    RtcEngine.destroy();
    // Actions.home();
    props.navigation.navigate('Home');
  }

  return (
    <>
      <View style={{flex: 1}}>
        {state.peerIds.length > 3 ? ( //view for four videostreams
          <View style={{flex: 1}}>
            <View style={{flex: 1 / 2, flexDirection: 'row'}}>
              {/* <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={state.peerIds[0]}
                mode={1}
              /> */}
              <RtcSurfaceView canvas={{uid: state.peerIds[0]}} />
              {/* <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={state.peerIds[1]}
                mode={1}
              /> */}
              <RtcSurfaceView canvas={{uid: state.peerIds[1]}} />
            </View>
            <View style={{flex: 1 / 2, flexDirection: 'row'}}>
              {/* <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={state.peerIds[2]}
                mode={1}
              />
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={state.peerIds[3]}
                mode={1}
              /> */}
              <RtcSurfaceView canvas={{uid: state.peerIds[2]}} />
              <RtcSurfaceView canvas={{uid: state.peerIds[3]}} />
            </View>
          </View>
        ) : state.peerIds.length > 2 ? ( //view for three videostreams
          <View style={{flex: 1}}>
            <View style={{flex: 1 / 2}}>
              {/* <AgoraView
                style={{flex: 1}}
                remoteUid={state.peerIds[0]}
                mode={1}
              /> */}
              <RtcSurfaceView canvas={{uid: state.peerIds[0]}} />
            </View>
            <View style={{flex: 1 / 2, flexDirection: 'row'}}>
              {/* <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={state.peerIds[1]}
                mode={1}
              />
              <AgoraView
                style={{flex: 1 / 2}}
                remoteUid={state.peerIds[2]}
                mode={1}
              /> */}
              <RtcSurfaceView canvas={{uid: state.peerIds[1]}} />
              <RtcSurfaceView canvas={{uid: state.peerIds[2]}} />
            </View>
          </View>
        ) : state.peerIds.length > 1 ? ( //view for two videostreams
          <View style={{flex: 1}}>
            {/* <AgoraView
              style={{flex: 1}}
              remoteUid={state.peerIds[0]}
              mode={1}
            />
            <AgoraView
              style={{flex: 1}}
              remoteUid={state.peerIds[1]}
              mode={1}
            /> */}
            <RtcSurfaceView canvas={{uid: state.peerIds[0]}} />
            <RtcSurfaceView canvas={{uid: state.peerIds[1]}} />
          </View>
        ) : state.peerIds.length > 0 ? ( //view for videostream
          //   <AgoraView style={{flex: 1}} remoteUid={state.peerIds[0]} mode={1} />
          <RtcSurfaceView canvas={{uid: state.peerIds[0]}} />
        ) : (
          <View />
        )}
        {!state.vidMute ? ( //view for local video
          //   <AgoraView
          //     style={styles.localVideoStyle}
          //     zOrderMediaOverlay={true}
          //     showLocalVideo={true}
          //     mode={1}
          //   />
          <RtcSurfaceView canvas={{uid: state.peerIds[0]}} />
        ) : (
          <View />
        )}
        <View style={styles.buttonBar}>
          <Text onPress={() => toggleAudio()}>
            {state.audMute ? 'mic-off' : 'mic'}
          </Text>
          <Text onPress={() => endCall()}>call-end</Text>
          <Text onPress={() => toggleVideo()}>
            {state.vidMute ? 'videocam-off' : 'videocam'}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonBar: {
    height: 50,
    backgroundColor: '#0093E9',
    display: 'flex',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  localVideoStyle: {
    width: 140,
    height: 160,
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 100,
  },
  iconStyle: {
    fontSize: 34,
    paddingTop: 15,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 15,
    borderRadius: 0,
  },
});
