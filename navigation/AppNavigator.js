import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RoutesScreen from '../screens/RoutesScreen';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import CreateRouteScreen from '../screens/CreateRouteScreen';
import SlidesScreen from '../screens/SlidesScreen';
import SlideDetailScreen from '../screens/SlideDetailScreen';
import CreateSlideScreen from '../screens/CreateSlideScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MeetupSpotsScreen from '../screens/MeetupSpotsScreen';
import MeetupSpotDetailScreen from '../screens/MeetupSpotDetailScreen';
import CreateMeetupSpotScreen from '../screens/CreateMeetupSpotScreen';
import RegularMeetupsScreen from '../screens/RegularMeetupsScreen';
import RegularMeetupDetailScreen from '../screens/RegularMeetupDetailScreen';
import CreateRegularMeetupScreen from '../screens/CreateRegularMeetupScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createStackNavigator();

function AppNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='Home'>
				<Stack.Screen name='Home' component={HomeScreen} />
				<Stack.Screen name='Routes' component={RoutesScreen} />
				<Stack.Screen name='RouteDetail' component={RouteDetailScreen} />
				<Stack.Screen name='CreateRoute' component={CreateRouteScreen} />
				<Stack.Screen name='Slides' component={SlidesScreen} />
				<Stack.Screen name='SlideDetail' component={SlideDetailScreen} />
				<Stack.Screen name='CreateSlide' component={CreateSlideScreen} />
				<Stack.Screen name='Profile' component={ProfileScreen} />
				<Stack.Screen name='MeetupSpots' component={MeetupSpotsScreen} />
				<Stack.Screen name='MeetupSpotDetail' component={MeetupSpotDetailScreen} />
				<Stack.Screen name='CreateMeetupSpot' component={CreateMeetupSpotScreen} />
				<Stack.Screen name='RegularMeetups' component={RegularMeetupsScreen} />
				<Stack.Screen name='RegularMeetupDetail' component={RegularMeetupDetailScreen} />
				<Stack.Screen name='CreateRegularMeetup' component={CreateRegularMeetupScreen} />
				<Stack.Screen name='Map' component={MapScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default AppNavigator;
