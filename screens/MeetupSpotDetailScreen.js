import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const MeetupSpotDetailScreen = ({ route }) => {
	const { spotId } = route.params;
	const [spotDetails, setSpotDetails] = useState(null);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchSpotDetails = async () => {
			try {
				const snapshot = await get(ref(database, `/meetupSpots/${spotId}`));
				setSpotDetails(snapshot.val());
			} catch (error) {
				console.error('Error fetching meetup spot details:', error);
			}
		};

		fetchSpotDetails();
	}, [spotId]);

	const handleDelete = () => {
		Alert.alert('Delete Meetup Spot', 'Are you sure you want to delete this meetup spot?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: deleteMeetupSpot },
		]);
	};

	const deleteMeetupSpot = async () => {
		try {
			await remove(ref(database, `/meetupSpots/${spotId}`));
			navigation.goBack();
		} catch (error) {
			console.error('Error deleting meetup spot:', error);
		}
	};

	if (!spotDetails) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Meetup Spot Details</Text>
			<Text style={styles.text}>Description: {spotDetails.description}</Text>
			<Text style={styles.text}>Location: {spotDetails.location}</Text>
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

export default MeetupSpotDetailScreen;
