import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EventPage from '../screens/EventPage';

const Stack = createStackNavigator();

function AppNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Home'>
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='EventPage' component={EventPage} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default AppNavigator;