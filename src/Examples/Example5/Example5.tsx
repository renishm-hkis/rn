import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import requestCameraAndAudioPermission from '../../Components/Permission';

export default function Example5(props) {
  console.log('Props', props);
  const [state, setState] = useState({
    AppID: '41b859b3fa13417491d567330522854a', //Set your APPID here
    ChannelName: 'test', //Set a default channel or leave blank
  });

  const handleSubmit = () => {
    let AppID = state.AppID;
    let ChannelName = state.ChannelName;
    if (AppID !== '' && ChannelName !== '') {
      //   Actions.video({AppID, ChannelName});
      props.navigation.navigate('Video', {AppID, ChannelName});
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      //Request required permissions from Android
      requestCameraAndAudioPermission().then(_ => {
        console.log('requested!');
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>App ID</Text>
      <TextInput
        style={styles.formInput}
        onChangeText={AppID => setState({...state, AppID})}
        value={state.AppID}
      />
      <Text style={styles.formLabel}>Channel Name</Text>
      <TextInput
        style={styles.formInput}
        onChangeText={ChannelName => setState({...state, ChannelName})}
        value={state.ChannelName}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          title="Start Call!"
          onPress={handleSubmit}
          style={styles.submitButton}>
          <Text style={{color: '#ffffff'}}> Start Call </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 20,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formLabel: {
    paddingBottom: 10,
    paddingTop: 10,
    color: '#0093E9',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  submitButton: {
    paddingHorizontal: 60,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  formInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    color: '#0093E9',
    borderRadius: 4,
    paddingLeft: 20,
  },
});
