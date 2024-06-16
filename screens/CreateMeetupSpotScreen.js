import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const CreateMeetupSpotScreen = () => {
	const [description, setDescription] = useState('');
	const [location, setLocation] = useState('');
	const navigation = useNavigation();
	const database = getDatabase();

	const handleCreateMeetupSpot = async () => {
		try {
			const newSpotRef = push(ref(database, `/meetupSpots`));
			await set(newSpotRef, {
				description,
				location,
			});
			navigation.goBack();
		} catch (error) {
			console.error('Error creating meetup spot:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Create Meetup Spot</Text>
			<TextInput style={styles.input} placeholder='Description' value={description} onChangeText={setDescription} />
			<TextInput style={styles.input} placeholder='Location' value={location} onChangeText={setLocation} />
			<TouchableOpacity style={styles.button} onPress={handleCreateMeetupSpot}>
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

export default CreateMeetupSpotScreen;
