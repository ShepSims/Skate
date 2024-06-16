import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const RegularMeetupDetailScreen = ({ route }) => {
	const { meetupId } = route.params;
	const [meetupDetails, setMeetupDetails] = useState(null);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchMeetupDetails = async () => {
			try {
				const snapshot = await get(ref(database, `/regularMeetups/${meetupId}`));
				setMeetupDetails(snapshot.val());
			} catch (error) {
				console.error('Error fetching regular meetup details:', error);
			}
		};

		fetchMeetupDetails();
	}, [meetupId]);

	const handleDelete = () => {
		Alert.alert('Delete Regular Meetup', 'Are you sure you want to delete this regular meetup?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: deleteMeetup },
		]);
	};

	const deleteMeetup = async () => {
		try {
			await remove(ref(database, `/regularMeetups/${meetupId}`));
			navigation.goBack();
		} catch (error) {
			console.error('Error deleting regular meetup:', error);
		}
	};

	if (!meetupDetails) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Regular Meetup Details</Text>
			<Text style={styles.text}>Title: {meetupDetails.title}</Text>
			<Text style={styles.text}>Recurrence Pattern: {meetupDetails.recurrencePattern}</Text>
			<Text style={styles.text}>Possible Routes: {meetupDetails.possibleRoutes.join(', ')}</Text>
			<Text style={styles.text}>Next Upcoming Route: {meetupDetails.nextUpcomingRoute}</Text>
			<TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
				<Text style={styles.deleteButtonText}>Delete</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	header: {
		fontSize: 24,
		marginBottom: 20,
	},
	text: {
		fontSize: 18,
		marginVertical: 5,
	},
	deleteButton: {
		backgroundColor: '#E53935',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default RegularMeetupDetailScreen;
