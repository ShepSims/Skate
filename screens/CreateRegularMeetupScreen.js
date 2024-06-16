import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const CreateRegularMeetupScreen = () => {
	const [title, setTitle] = useState('');
	const [recurrencePattern, setRecurrencePattern] = useState('');
	const [possibleRoutes, setPossibleRoutes] = useState('');
	const [nextUpcomingRoute, setNextUpcomingRoute] = useState('');
	const navigation = useNavigation();
	const database = getDatabase();

	const handleCreateRegularMeetup = async () => {
		try {
			const newMeetupRef = push(ref(database, `/regularMeetups`));
			await set(newMeetupRef, {
				title,
				recurrencePattern,
				possibleRoutes: possibleRoutes.split(',').map((route) => route.trim()),
				nextUpcomingRoute,
			});
			navigation.goBack();
		} catch (error) {
			console.error('Error creating regular meetup:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Create Regular Meetup</Text>
			<TextInput style={styles.input} placeholder='Title' value={title} onChangeText={setTitle} />
			<TextInput style={styles.input} placeholder='Recurrence Pattern' value={recurrencePattern} onChangeText={setRecurrencePattern} />
			<TextInput style={styles.input} placeholder='Possible Routes (comma separated)' value={possibleRoutes} onChangeText={setPossibleRoutes} />
			<TextInput style={styles.input} placeholder='Next Upcoming Route' value={nextUpcomingRoute} onChangeText={setNextUpcomingRoute} />
			<TouchableOpacity style={styles.button} onPress={handleCreateRegularMeetup}>
				<Text style={styles.buttonText}>Create</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	header: {
		fontSize: 24,
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	button: {
		backgroundColor: '#4CAF50',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default CreateRegularMeetupScreen;
