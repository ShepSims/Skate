import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { database } from '../App';

const CreateEventScreen = ({ route }) => {
	const { day } = route.params;
	const [difficulty, setDifficulty] = useState('');
	const [distance, setDistance] = useState('');
	const [googleMapsRoute, setGoogleMapsRoute] = useState('');
	const navigation = useNavigation();

	const handleCreateEvent = async () => {
		try {
			const newEventRef = push(ref(database, `/routes`));
			await set(newEventRef, {
				difficulty,
				distance: parseFloat(distance),
				googleMapsRoute,
			});
			navigation.goBack();
		} catch (error) {
			console.error('Error creating event:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Create Event</Text>
			<TextInput style={styles.input} placeholder='Difficulty' value={difficulty} onChangeText={setDifficulty} />
			<TextInput style={styles.input} placeholder='Distance' value={distance} onChangeText={setDistance} keyboardType='numeric' />
			<TextInput style={styles.input} placeholder='Google Maps Route' value={googleMapsRoute} onChangeText={setGoogleMapsRoute} />
			<TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
				<Text style={styles.buttonText}>Continue</Text>
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

export default CreateEventScreen;
