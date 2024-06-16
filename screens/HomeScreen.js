import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Skate Tracker</Text>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Routes')}>
				<Text style={styles.buttonText}>Routes</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Slides')}>
				<Text style={styles.buttonText}>Slides</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MeetupSpots')}>
				<Text style={styles.buttonText}>Meetup Spots</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RegularMeetups')}>
				<Text style={styles.buttonText}>Regular Meetups</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
				<Text style={styles.buttonText}>Profile</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		fontSize: 32,
		marginBottom: 20,
	},
	button: {
		width: '80%',
		padding: 15,
		margin: 10,
		backgroundColor: '#4CAF50',
		borderRadius: 5,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default HomeScreen;
