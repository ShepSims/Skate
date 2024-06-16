import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';

const EventDetailScreen = ({ route, navigation }) => {
	const { eventId, day } = route.params;
	const [eventDetails, setEventDetails] = useState(null);
	const database = getDatabase();

	useEffect(() => {
		const fetchEventDetails = async () => {
			try {
				const snapshot = await get(ref(database, `/routes/${eventId}`));
				setEventDetails(snapshot.val());
			} catch (error) {
				console.error('Error fetching event details:', error);
			}
		};

		fetchEventDetails();
	}, [eventId, day]);

	const handleDelete = () => {
		Alert.alert('Delete Route', 'Are you sure you want to delete this route?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: deleteRoute },
		]);
	};

	const deleteRoute = async () => {
		try {
			await remove(ref(database, `/routes/${eventId}`));
			navigation.goBack();
		} catch (error) {
			console.error('Error deleting route:', error);
		}
	};

	if (!eventDetails) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Event Details</Text>
			<Text style={styles.text}>Google Maps Route: {eventDetails.googleMapsRoute}</Text>
			<Text style={styles.text}>Distance: {eventDetails.distance} miles</Text>
			<Text style={styles.text}>Difficulty: {eventDetails.difficulty}</Text>
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

export default EventDetailScreen;
