/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import Example1 from './src/Examples/Example1';
import Example2 from './src/Examples/Example2';
import Example3 from './src/Examples/Example3';
import Example4 from './src/Examples/Example4';
import Example5 from './src/Examples/Example5/Example5';
import 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Video from './src/Examples/Example5/Video';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const STACK = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Example5} />
        <Stack.Screen name="Video" component={Video} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* <Tab.Screen name="Example1" component={Example1} /> */}
        <Tab.Screen name="Example2" component={Example2} />
        {/* <Tab.Screen name="Example3" component={Example3} /> */}
        {/* <Tab.Screen name="Example4" component={Example4} /> */}
        <Tab.Screen name="Example5" component={STACK} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
