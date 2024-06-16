import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const MeetupSpotsScreen = () => {
	const [meetupSpots, setMeetupSpots] = useState([]);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchMeetupSpots = async () => {
			try {
				const snapshot = await get(ref(database, `/meetupSpots`));
				const data = snapshot.val();
				const spotsArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
				setMeetupSpots(spotsArray);
			} catch (error) {
				console.error('Error fetching meetup spots:', error);
			}
		};

		fetchMeetupSpots();
	}, []);

	const handleDelete = (id) => {
		Alert.alert('Delete Meetup Spot', 'Are you sure you want to delete this meetup spot?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => deleteMeetupSpot(id) },
		]);
	};

	const deleteMeetupSpot = async (id) => {
		try {
			await remove(ref(database, `/meetupSpots/${id}`));
			setMeetupSpots(meetupSpots.filter((spot) => spot.id !== id));
		} catch (error) {
			console.error('Error deleting meetup spot:', error);
		}
	};

	const handleCreateMeetupSpot = () => {
		navigation.navigate('CreateMeetupSpot');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Meetup Spots</Text>
			<FlatList
				data={meetupSpots}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.meetupSpotItem}>
						<TouchableOpacity style={styles.meetupSpotTile} onPress={() => navigation.navigate('MeetupSpotDetail', { spotId: item.id })}>
							<Text style={styles.meetupSpotText}>{item.description}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
							<Text style={styles.deleteButtonText}>Delete</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
			<TouchableOpacity style={styles.addButton} onPress={handleCreateMeetupSpot}>
				<Text style={styles.addButtonText}>Add Meetup Spot</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	header: {
		fontSize: 24,
		marginBottom: 20,
	},
	meetupSpotItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	meetupSpotTile: {
		flex: 1,
		padding: 20,
		marginVertical: 10,
		backgroundColor: '#4CAF50',
		borderRadius: 10,
	},
	meetupSpotText: {
		color: '#fff',
		fontSize: 18,
	},
	deleteButton: {
		marginLeft: 10,
		backgroundColor: '#E53935',
		padding: 10,
		borderRadius: 5,
	},
	deleteButtonText: {
		color: '#fff',
	},
	addButton: {
		backgroundColor: '#4CAF50',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	addButtonText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default MeetupSpotsScreen;
