// /* eslint-disable react-native/no-inline-styles */
// import React, {useRef, useState, useEffect, useMemo} from 'react';
// import {
//   Button,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {PermissionsAndroid, Platform} from 'react-native';
// import {
//   ClientRoleType,
//   createAgoraRtcEngine,
//   IRtcEngine,
//   RtcSurfaceView,
//   ChannelProfileType,
// } from 'react-native-agora';

// const Example2 = () => {
//   const appId = '41b859b3fa13417491d567330522854a';
//   const channelName = 'test';
//   const token = '41b859b3fa13417491d567330522854a';
//   // const uid = 0;
//   const uid = useMemo(() => Math.floor(Math.random() * 1000000), []);
//   const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
//   const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
//   const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
//   const [remoteUsersId, setRemoteUsersId] = useState(Array.from(new Set())); // Uid of the remote user
//   console.log('remoteUsersId', remoteUsersId);

//   const [message, setMessage] = useState(''); // Message to the user
//   const [isHost, setIsHost] = useState(false); // Message to the user

//   function showMessage(msg: string) {
//     setMessage(msg);
//   }

//   const getPermission = async () => {
//     if (Platform.OS === 'android') {
//       await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//       ]);
//     }
//   };

//   useEffect(() => {
//     // Initialize Agora engine when the app starts
//     setupVideoSDKEngine();
//   });

//   const setupVideoSDKEngine = async () => {
//     try {
//       // use the helper function to get permissions
//       if (Platform.OS === 'android') {
//         await getPermission();
//       }
//       agoraEngineRef.current = createAgoraRtcEngine();
//       const agoraEngine = agoraEngineRef.current;
//       agoraEngine.registerEventHandler({
//         onJoinChannelSuccess: () => {
//           showMessage('Successfully joined the channel ' + channelName);
//           setIsJoined(true);
//         },
//         onUserJoined: (_connection, Uid) => {
//           console.log('CONECTION', _connection);

//           setRemoteUid(Uid);
//           setRemoteUsersId(previousState =>
//             Array.from(new Set([...previousState, Uid])),
//           );
//         },
//         onUserOffline: (_connection, Uid) => {
//           showMessage('Remote user left the channel. uid: ' + Uid);
//           setRemoteUsersId([...remoteUsersId.filter(ID => ID !== Uid)]);
//         },
//       });
//       agoraEngine.initialize({
//         appId: appId,
//         channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
//       });
//       agoraEngine.enableVideo();
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const joinAsBroadCast = async () => {
//     setIsHost(true);
//     if (isJoined) {
//       return;
//     }
//     try {
//       agoraEngineRef.current?.setChannelProfile(
//         ChannelProfileType.ChannelProfileCommunication,
//       );
//       agoraEngineRef.current?.startPreview();
//       agoraEngineRef.current?.joinChannel(token, channelName, uid, {
//         clientRoleType: ClientRoleType.ClientRoleBroadcaster,
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const joinAsAttendee = async () => {
//     setIsHost(false);
//     if (isJoined) {
//       return;
//     }
//     try {
//       agoraEngineRef.current?.setChannelProfile(
//         ChannelProfileType.ChannelProfileCommunication,
//       );
//       // agoraEngineRef.current?.startPreview();
//       // agoraEngineRef.current?.joinChannel(token, channelName, uid, {
//       //   clientRoleType: ClientRoleType.ClientRoleAudience,
//       // });
//       agoraEngineRef.current?.joinChannel(token, channelName, uid, {
//         clientRoleType: ClientRoleType.ClientRoleAudience,
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const leave = () => {
//     try {
//       agoraEngineRef.current?.leaveChannel();
//       setRemoteUid(0);
//       setIsJoined(false);
//       showMessage('You left the channel');
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   if (isJoined) {
//     return (
//       <View style={styles.mainVideoView}>
//         {isJoined ? (
//           <React.Fragment key={0}>
//             <View style={styles.videoView}>
//               <RtcSurfaceView canvas={{uid: 0}} />
//             </View>
//             {isJoined && remoteUsersId.length !== 0 ? (
//               <View
//                 style={{
//                   overflow: 'hidden',
//                   width: '50%',
//                   flex: 1,
//                 }}>
//                 <RtcSurfaceView canvas={{uid: remoteUid}} />
//               </View>
//             ) : null}
//             <View
//               style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//               <TextInput
//                 placeholder="Write something..."
//                 style={{
//                   width: '97%',
//                   position: 'absolute',
//                   bottom: 10,
//                   borderWidth: 1,
//                   borderRadius: 2,
//                   alignSelf: 'center',
//                 }}
//               />
//             </View>
//           </React.Fragment>
//         ) : (
//           <Text>Join a channel</Text>
//         )}
//         <View>
//           <Button title="Leave" onPress={leave} />
//         </View>
//         {!isHost ? (
//           <TouchableOpacity
//             style={{
//               position: 'absolute',
//               top: 20,
//               backgroundColor: 'blue',
//               width: '50%',
//               alignSelf: 'center',
//               borderRadius: 50,
//               height: 20,
//             }}
//             onPress={joinAsBroadCast}>
//             <Text style={{color: 'white', textAlign: 'center'}}>
//               Be come a host
//             </Text>
//           </TouchableOpacity>
//         ) : null}
//       </View>
//     );
//   }

//   if (isJoined) {
//     return (
//       <>
//         {isJoined &&
//           remoteUsersId.length !== 0 &&
//           remoteUsersId.map(id => {
//             return (
//               <View
//                 style={{
//                   overflow: 'hidden',
//                   width: '50%',
//                   height: 200,
//                   backgroundColor: 'red',
//                 }}>
//                 <RtcSurfaceView canvas={{uid: id}} />
//               </View>
//             );
//           })}
//       </>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.main}>
//       {/* <Text style={styles.head}>Agora Video Calling Quickstart</Text> */}
//       <View style={styles.btnContainer}>
//         <Text onPress={joinAsBroadCast} style={styles.button}>
//           Go Live
//         </Text>
//         <Text onPress={joinAsAttendee} style={styles.button}>
//           Join Channel
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     paddingHorizontal: 25,
//     paddingVertical: 4,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     backgroundColor: '#0055cc',
//     margin: 5,
//   },
//   main: {flex: 1, alignItems: 'center', justifyContent: 'center'},
//   scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
//   mainVideoView: {
//     flex: 1,
//   },
//   videoView: {
//     width: '100%',
//     height: '100%',
//     overflow: 'hidden',
//     flex: 2,
//   },
//   scrollContainer: {alignItems: 'center'},
//   btnContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   head: {fontSize: 20},
//   info: {backgroundColor: '#ffffe0', color: '#0000ff'},
// });

// export default Example2;

import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Switch,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
} from 'react-native-agora';

const appId = '41b859b3fa13417491d567330522854a';
const channelName = 'testing';
const token = '41b859b3fa13417491d567330522854a';
const uid = 0;

const App = () => {
  const agoraEngineRef = useRef<IRtcEngine>(); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [isHost, setIsHost] = useState(true); // Client role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // Message to the user

  const [allUsers, setAllUsers] = useState([]);
  console.log('allUsers', allUsers);

  useEffect(() => {
    // Initialize Agora engine when the app starts
    setupVideoSDKEngine();
  });

  const setupVideoSDKEngine = async () => {
    try {
      // use the helper function to get permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user joined with uid ' + Uid);
          setRemoteUid(Uid);

          if (!allUsers.includes(Uid)) {
            setAllUsers([...allUsers, Uid]);
          }
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setRemoteUid(0);
          setAllUsers([...allUsers.filter(ID => ID !== Uid)]);
        },
        onLocalUserRegistered(uid, userAccount) {
          console.log('UID', uid);
          console.log('USER-ACCROUNT', userAccount);
        },
      });
      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };

  const joinAChannel = async () => {
    if (isJoined) {
      return;
    }
    try {
      setIsHost(false);
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleAudience,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const HostCHannel = async () => {
    if (isJoined) {
      return leave(HostCHannel);
    }
    try {
      setIsHost(true);
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      // Host A Channel
      agoraEngineRef.current?.startPreview();
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = HostCHannel => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('You left the channel');
    } catch (e) {
      console.log(e);
    }
    HostCHannel();
  };

  function showMessage(msg: string) {
    setMessage(msg);
  }

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.btnContainer}>
        <Text onPress={HostCHannel} style={styles.button}>
          Go Live
        </Text>
        <Text onPress={joinAChannel} style={styles.button}>
          Join
        </Text>
        <Text onPress={leave} style={styles.button}>
          Leave
        </Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}>
        {isJoined && isHost ? (
          <React.Fragment key={0}>
            <RtcSurfaceView canvas={{uid: 0}} style={styles.videoView} />
            <Text>Local user uid: {uid}</Text>
          </React.Fragment>
        ) : (
          <Text>{isHost ? 'Join a channel' : ''}</Text>
        )}
        {isJoined && allUsers.length !== 0 ? (
          <>
            {allUsers.map(ID => {
              return (
                <React.Fragment key={ID}>
                  <RtcSurfaceView canvas={{uid: ID}} style={styles.videoView} />
                  <Text>Remote user uid: {ID}</Text>
                </React.Fragment>
              );
            })}
          </>
        ) : null}
        <Text style={styles.info}>{message}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  videoView: {width: '90%', height: 200},
  btnContainer: {flexDirection: 'row', justifyContent: 'center'},
  head: {fontSize: 20},
  info: {backgroundColor: '#ffffe0', paddingHorizontal: 8, color: '#0000ff'},
});

export default App;
