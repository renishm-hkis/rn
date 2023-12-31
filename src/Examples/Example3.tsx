// import React, {Component, useEffect, useState} from 'react';
// import {
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import RtcEngine, {
//   RtcRemoteView,
//   RtcLocalView,
//   VideoRenderMode,
// } from 'react-native-agora';
// import requestCameraAndAudioPermission from '../Components/Permission';
// import styles from '../Components/Style';
// import RtmEngine from 'agora-react-native-rtm';

// interface Props {}

// /**
//  * @property appId Agora App ID as string
//  * @property token Token for the channel
//  * @property channelName Channel Name for the current session
//  * @property inCall Boolean to store if we're in an active video chat room
//  * @property inLobby Boolean to store if we're in the lobby
//  * @property input String to store input
//  * @property peerIds Array for storing connected peers during a video chat
//  * @property seniors Array storing senior members in the joined channel
//  * @property myUsername Username to log in to RTM
//  * @property rooms Dictionary to store room names and their member count
//  */
// interface State {
//   appId: string;
//   token: string | null;
//   channelName: string;
//   inCall: boolean;
//   inLobby: boolean;
//   input: string;
//   peerIds: number[];
//   seniors: string[];
//   myUsername: string;
//   rooms: {[name: string]: number};
// }

// export default function Example3() {
//   var _rtcEngine: RtcEngine;
//   var _rtmEngine: RtmEngine;

//   const [state, setState] = useState({
//     appId: '41b859b3fa13417491d567330522854a',
//     token: null,
//     channelName: '',
//     inCall: false,
//     input: '',
//     inLobby: false,
//     peerIds: [],
//     seniors: [],
//     myUsername: '' + new Date().getTime(),
//     rooms: {},
//   });

//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       // Request required permissions from Android
//       requestCameraAndAudioPermission().then(() => {
//         console.log('requested!');
//       });
//     }
//     initRTC();
//     initRTM();
//     return () => {
//       _rtmEngine?.destroyClient();
//       _rtcEngine?.destroy();
//     };
//   }, []);

//   /**
//    * @name initRTC
//    * @description Function to initialize the Rtc Engine, attach event listeners and actions
//    */
//   const initRTC = async () => {
//     const {appId} = state;
//     _rtcEngine = await RtcEngine.create(appId);
//     await _rtcEngine.enableVideo();

//     _rtcEngine.addListener('Error', err => {
//       console.log('Error', err);
//     });

//     _rtcEngine.addListener('UserJoined', uid => {
//       // Get current peer IDs
//       const {peerIds, inCall, seniors, channelName} = state;
//       // If new user
//       if (peerIds.indexOf(uid) === -1) {
//         if (inCall && seniors.length < 2) {
//           _rtmEngine?.sendMessageByChannelId(
//             'lobby',
//             channelName + ':' + (peerIds.length + 2),
//           );
//         }
//         setState({
//           // Add peer ID to state array
//           ...state,
//           peerIds: [...peerIds, uid],
//         });
//       }
//     });

//     _rtcEngine.addListener('UserOffline', uid => {
//       const {peerIds} = state;
//       setState({
//         // Remove peer ID from state array
//         ...state,
//         peerIds: peerIds.filter(id => id !== uid),
//       });
//     });

//     // If Local user joins RTC channel
//     _rtcEngine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
//       console.log('JoinChannelSuccess', channel, uid, elapsed);
//       setState({
//         ...state,
//         inCall: true,
//       });
//     });
//   };

//   /**
//    * @name initRTM
//    * @description Function to initialize the Rtm Engine, attach event listeners and use them to sync usernames
//    */
//   const initRTM = async () => {
//     let {appId, myUsername} = state;
//     _rtmEngine = new RtmEngine();

//     _rtmEngine.on('error', evt => {
//       console.log(evt);
//     });

//     _rtmEngine.on('channelMessageReceived', evt => {
//       // received message is of the form - channel:membercount, add it to the state
//       let {text} = evt;
//       let data = text.split(':');
//       setState({...state, rooms: {...state.rooms, [data[0]]: data[1]}});
//     });

//     _rtmEngine.on('messageReceived', evt => {
//       // received message is of the form - channel:membercount, add it to the state
//       let {text} = evt;
//       let data = text.split(':');
//       setState({...state, rooms: {...state.rooms, [data[0]]: data[1]}});
//     });

//     _rtmEngine.on('channelMemberJoined', evt => {
//       let {channelName, seniors, peerIds, inCall} = state;
//       let {channelId, uid} = evt;
//       // if we're in call and receive a lobby message and also we're the senior member (oldest member in the channel), signal channel status to joined peer
//       if (inCall && channelId === 'lobby' && seniors.length < 2) {
//         _rtmEngine
//           ?.sendMessageToPeer({
//             peerId: uid,
//             text: channelName + ':' + (peerIds.length + 1),
//             offline: false,
//           })
//           .catch(e => console.log(e));
//       }
//     });

//     _rtmEngine.on('channelMemberLeft', evt => {
//       let {channelId, uid} = evt;
//       let {channelName, seniors, inCall, peerIds, rooms} = state;
//       if (channelName === channelId) {
//         // Remove seniors UID from state array
//         setState({
//           ...state,
//           seniors: seniors.filter(id => id !== uid),
//           rooms: {...rooms, [channelName]: peerIds.length},
//         });
//         if (inCall && seniors.length < 2) {
//           // if we're in call and we're the senior member (oldest member in the channel), signal channel status to all users
//           _rtmEngine
//             ?.sendMessageByChannelId(
//               'lobby',
//               channelName + ':' + (peerIds.length + 1),
//             )
//             .catch(e => console.log(e));
//         }
//       }
//     });

//     await _rtmEngine.createClient(appId).catch(e => console.log(e));
//     await _rtmEngine?.login({uid: myUsername}).catch(e => console.log(e));
//     await _rtmEngine?.joinChannel('lobby').catch(e => console.log(e));
//     setState({...state, inLobby: true});
//   };

//   /**
//    * @name joinCall
//    * @description Function to join a room and start the call
//    */
//   const joinCall = async (channelName: string) => {
//     console.log('channelName', channelName);

//     setState({...state, channelName});
//     let {token} = state;
//     // Join RTC Channel using null token and channel name
//     await _rtcEngine?.joinChannel(token, channelName, null, 0);
//     await _rtmEngine?.joinChannel(channelName).catch(e => console.log(e));
//     let {members} = await _rtmEngine?.getChannelMembersBychannelId(channelName);
//     // if we're the only member, broadcast to room to all users on RTM
//     if (members.length === 1) {
//       await _rtmEngine
//         ?.sendMessageByChannelId('lobby', channelName + ':' + 1)
//         .catch(e => console.log(e));
//     }
//     setState({
//       ...state,
//       inLobby: false,
//       seniors: members.map((m: any) => m.uid),
//     });
//   };

//   /**
//    * @name endCall
//    * @description Function to end the call and return to lobby
//    */
//   const endCall = async () => {
//     let {channelName, myUsername, peerIds, seniors} = state;
//     // if we're the senior member, broadcast room to all users before leaving
//     if (seniors.length < 2) {
//       await _rtmEngine
//         ?.sendMessageByChannelId('lobby', channelName + ':' + peerIds.length)
//         .catch(e => console.log(e));
//     }
//     await _rtcEngine?.leaveChannel();

//     await _rtmEngine?.logout();
//     await _rtmEngine?.login({uid: myUsername});
//     await _rtmEngine?.joinChannel('lobby');

//     setState({
//       ...state,
//       peerIds: [],
//       inCall: false,
//       inLobby: true,
//       seniors: [],
//       channelName: '',
//     });
//   };

//   const _renderRooms = () => {
//     const {inLobby, rooms, input} = state;
//     return inLobby ? (
//       <View style={styles.fullView}>
//         <Text style={styles.subHeading}>Room List</Text>
//         <ScrollView>
//           {Object.keys(rooms).map((key, index) => {
//             return (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => joinCall(key)}
//                 style={styles.roomsBtn}>
//                 <Text>
//                   <Text style={styles.roomHead}>{key}</Text>
//                   <Text style={styles.whiteText}>
//                     {' (' + rooms[key] + ' users)'}
//                   </Text>
//                 </Text>
//               </TouchableOpacity>
//             );
//           })}
//           <Text>
//             {Object.keys(rooms).length === 0
//               ? 'No active rooms, please create new room'
//               : null}
//           </Text>
//         </ScrollView>
//         <TextInput
//           value={input}
//           onChangeText={val => setState({...state, input: val})}
//           style={styles.input}
//           placeholder="Enter Room Name"
//         />
//         <TouchableOpacity
//           onPress={async () => {
//             input ? await joinCall(input) : null;
//           }}
//           style={styles.button}>
//           <Text style={styles.buttonText}>Create Room</Text>
//         </TouchableOpacity>
//       </View>
//     ) : null;
//   };

//   const _renderCall = () => {
//     const {inCall, peerIds, channelName} = state;
//     return inCall ? (
//       <View style={styles.fullView}>
//         <RtcLocalView.SurfaceView
//           style={styles.video}
//           channelId={channelName}
//           renderMode={VideoRenderMode.Hidden}
//         />
//         <ScrollView>
//           {peerIds.map((key, index) => {
//             return (
//               <RtcRemoteView.SurfaceView
//                 channelId={channelName}
//                 renderMode={VideoRenderMode.Hidden}
//                 key={index}
//                 uid={key}
//                 style={styles.video}
//               />
//             );
//           })}
//         </ScrollView>
//         <TouchableOpacity onPress={endCall} style={styles.button}>
//           <Text style={styles.buttonText}>Leave Room</Text>
//         </TouchableOpacity>
//       </View>
//     ) : null;
//   };

//   const {inCall, channelName, inLobby} = state;
//   return (
//     <SafeAreaView style={styles.max}>
//       <View style={styles.spacer}>
//         <Text style={styles.roleText}>
//           {inCall ? "You're in " + channelName : 'Lobby: Join/Create a room'}
//         </Text>
//       </View>
//       {_renderRooms()}
//       {_renderCall()}
//       {!inLobby && !inCall ? (
//         <Text style={styles.waitText}>Please wait, joining room...</Text>
//       ) : null}
//     </SafeAreaView>
//   );
// }

// --------------------------------------------------------------------------------------------------------------

import React, {Component} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, {
  RtcRemoteView,
  RtcLocalView,
  VideoRenderMode,
} from 'react-native-agora';
import requestCameraAndAudioPermission from '../Components/Permission';
import styles from '../Components/Style';
import RtmEngine from 'agora-react-native-rtm';

interface Props {}

/**
 * @property appId Agora App ID as string
 * @property token Token for the channel
 * @property channelName Channel Name for the current session
 * @property inCall Boolean to store if we're in an active video chat room
 * @property inLobby Boolean to store if we're in the lobby
 * @property input String to store input
 * @property peerIds Array for storing connected peers during a video chat
 * @property seniors Array storing senior members in the joined channel
 * @property myUsername Username to log in to RTM
 * @property rooms Dictionary to store room names and their member count
 */
interface State {
  appId: string;
  token: string | null;
  channelName: string;
  inCall: boolean;
  inLobby: boolean;
  input: string;
  peerIds: number[];
  seniors: string[];
  myUsername: string;
  rooms: {[name: string]: number};
}

export default class App extends Component<null, State> {
  _rtcEngine?: RtcEngine;
  _rtmEngine?: RtmEngine;

  constructor(props: any) {
    super(props);
    this.state = {
      appId: '41b859b3fa13417491d567330522854a',
      token: 'a13417491d',
      channelName: '',
      inCall: false,
      input: '',
      inLobby: false,
      peerIds: [],
      seniors: [],
      myUsername: '' + new Date().getTime(),
      rooms: {},
    };
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }

  componentDidMount() {
    // initialize the SDKs
    this.initRTC();
    this.initRTM();
  }

  componentWillUnmount() {
    // destroy the engine instances
    this._rtmEngine?.destroyClient();
    this._rtcEngine?.destroy();
  }

  /**
   * @name initRTC
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  initRTC = async () => {
    const {appId} = this.state;
    this._rtcEngine = await RtcEngine.create(appId);
    await this._rtcEngine.enableVideo();

    this._rtcEngine.addListener('Error', err => {
      console.log('Error', err);
    });

    this._rtcEngine.addListener('UserJoined', uid => {
      // Get current peer IDs
      const {peerIds, inCall, seniors, channelName} = this.state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        if (inCall && seniors.length < 2) {
          this._rtmEngine?.sendMessageByChannelId(
            'lobby',
            channelName + ':' + (peerIds.length + 2),
          );
        }
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._rtcEngine.addListener('UserOffline', uid => {
      const {peerIds} = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter(id => id !== uid),
      });
    });

    // If Local user joins RTC channel
    this._rtcEngine.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        this.setState({
          inCall: true,
        });
      },
    );
  };

  /**
   * @name initRTM
   * @description Function to initialize the Rtm Engine, attach event listeners and use them to sync usernames
   */
  initRTM = async () => {
    let {appId, myUsername} = this.state;
    this._rtmEngine = new RtmEngine();

    this._rtmEngine.on('error', evt => {
      console.log(evt);
    });

    this._rtmEngine.on('channelMessageReceived', evt => {
      // received message is of the form - channel:membercount, add it to the state
      let {text} = evt;
      let data = text.split(':');
      this.setState({rooms: {...this.state.rooms, [data[0]]: data[1]}});
    });

    this._rtmEngine.on('messageReceived', evt => {
      // received message is of the form - channel:membercount, add it to the state
      let {text} = evt;
      let data = text.split(':');
      this.setState({rooms: {...this.state.rooms, [data[0]]: data[1]}});
    });

    this._rtmEngine.on('channelMemberJoined', evt => {
      let {channelName, seniors, peerIds, inCall} = this.state;
      let {channelId, uid} = evt;
      // if we're in call and receive a lobby message and also we're the senior member (oldest member in the channel), signal channel status to joined peer
      if (inCall && channelId === 'lobby' && seniors.length < 2) {
        this._rtmEngine
          ?.sendMessageToPeer({
            peerId: uid,
            text: channelName + ':' + (peerIds.length + 1),
            offline: false,
          })
          .catch(e => console.log(e));
      }
    });

    this._rtmEngine.on('channelMemberLeft', evt => {
      let {channelId, uid} = evt;
      let {channelName, seniors, inCall, peerIds, rooms} = this.state;
      if (channelName === channelId) {
        // Remove seniors UID from state array
        this.setState({
          seniors: seniors.filter(id => id !== uid),
          rooms: {...rooms, [channelName]: peerIds.length},
        });
        if (inCall && seniors.length < 2) {
          // if we're in call and we're the senior member (oldest member in the channel), signal channel status to all users
          this._rtmEngine
            ?.sendMessageByChannelId(
              'lobby',
              channelName + ':' + (peerIds.length + 1),
            )
            .catch(e => console.log(e));
        }
      }
    });

    await this._rtmEngine.createClient(appId).catch(e => console.log(e));
    await this._rtmEngine?.login({uid: myUsername}).catch(e => console.log(e));
    await this._rtmEngine?.joinChannel('lobby').catch(e => console.log(e));
    this.setState({inLobby: true});
  };

  /**
   * @name joinCall
   * @description Function to join a room and start the call
   */
  joinCall = async (channelName: string) => {
    this.setState({channelName});
    let {token} = this.state;
    // Join RTC Channel using null token and channel name
    await this._rtcEngine?.joinChannel(token, channelName, null, 0);
    await this._rtmEngine?.joinChannel(channelName).catch(e => console.log(e));
    let {members} = await this._rtmEngine?.getChannelMembersBychannelId(
      channelName,
    );
    // if we're the only member, broadcast to room to all users on RTM
    if (members.length === 1) {
      await this._rtmEngine
        ?.sendMessageByChannelId('lobby', channelName + ':' + 1)
        .catch(e => console.log(e));
    }
    this.setState({
      inLobby: false,
      seniors: members.map((m: any) => m.uid),
    });
  };

  /**
   * @name endCall
   * @description Function to end the call and return to lobby
   */
  endCall = async () => {
    let {channelName, myUsername, peerIds, seniors} = this.state;
    // if we're the senior member, broadcast room to all users before leaving
    if (seniors.length < 2) {
      await this._rtmEngine
        ?.sendMessageByChannelId('lobby', channelName + ':' + peerIds.length)
        .catch(e => console.log(e));
    }
    await this._rtcEngine?.leaveChannel();

    await this._rtmEngine?.logout();
    await this._rtmEngine?.login({uid: myUsername});
    await this._rtmEngine?.joinChannel('lobby');

    this.setState({
      peerIds: [],
      inCall: false,
      inLobby: true,
      seniors: [],
      channelName: '',
    });
  };

  render() {
    const {inCall, channelName, inLobby} = this.state;
    return (
      <SafeAreaView style={styles.max}>
        <View style={styles.spacer}>
          <Text style={styles.roleText}>
            {inCall ? "You're in " + channelName : 'Lobby: Join/Create a room'}
          </Text>
        </View>
        {this._renderRooms()}
        {this._renderCall()}
        {!inLobby && !inCall ? (
          <Text style={styles.waitText}>Please wait, joining room...</Text>
        ) : null}
      </SafeAreaView>
    );
  }

  _renderRooms = () => {
    const {inLobby, rooms, input} = this.state;
    return inLobby ? (
      <View style={styles.fullView}>
        <Text style={styles.subHeading}>Room List</Text>
        <ScrollView>
          {Object.keys(rooms).map((key, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => this.joinCall(key)}
                style={styles.roomsBtn}>
                <Text>
                  <Text style={styles.roomHead}>{key}</Text>
                  <Text style={styles.whiteText}>
                    {' (' + rooms[key] + ' users)'}
                  </Text>
                </Text>
              </TouchableOpacity>
            );
          })}
          <Text>
            {Object.keys(rooms).length === 0
              ? 'No active rooms, please create new room'
              : null}
          </Text>
        </ScrollView>
        <TextInput
          value={input}
          onChangeText={val => this.setState({input: val})}
          style={styles.input}
          placeholder="Enter Room Name"
        />
        <TouchableOpacity
          onPress={async () => {
            input ? await this.joinCall(input) : null;
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Create Room</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };

  _renderCall = () => {
    const {inCall, peerIds, channelName} = this.state;
    return inCall ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.video}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        <ScrollView>
          {peerIds.map((key, index) => {
            return (
              <RtcRemoteView.SurfaceView
                channelId={channelName}
                renderMode={VideoRenderMode.Hidden}
                key={index}
                uid={key}
                style={styles.video}
              />
            );
          })}
        </ScrollView>
        <TouchableOpacity onPress={this.endCall} style={styles.button}>
          <Text style={styles.buttonText}>Leave Room</Text>
        </TouchableOpacity>
      </View>
    ) : null;
  };
}
