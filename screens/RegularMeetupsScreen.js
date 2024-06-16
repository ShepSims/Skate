import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const RegularMeetupsScreen = () => {
	const [regularMeetups, setRegularMeetups] = useState([]);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchRegularMeetups = async () => {
			try {
				const snapshot = await get(ref(database, `/regularMeetups`));
				const data = snapshot.val();
				const meetupsArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
				setRegularMeetups(meetupsArray);
			} catch (error) {
				console.error('Error fetching regular meetups:', error);
			}
		};

		fetchRegularMeetups();
	}, []);

	const handleDelete = (id) => {
		Alert.alert('Delete Regular Meetup', 'Are you sure you want to delete this regular meetup?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => deleteRegularMeetup(id) },
		]);
	};

	const deleteRegularMeetup = async (id) => {
		try {
			await remove(ref(database, `/regularMeetups/${id}`));
			setRegularMeetups(regularMeetups.filter((meetup) => meetup.id !== id));
		} catch (error) {
			console.error('Error deleting regular meetup:', error);
		}
	};

	const handleCreateRegularMeetup = () => {
		navigation.navigate('CreateRegularMeetup');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Regular Meetups</Text>
			<FlatList
				data={regularMeetups}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.meetupItem}>
						<TouchableOpacity style={styles.meetupTile} onPress={() => navigation.navigate('RegularMeetupDetail', { meetupId: item.id })}>
							<Text style={styles.meetupText}>{item.title}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
							<Text style={styles.deleteButtonText}>Delete</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
			<TouchableOpacity style={styles.addButton} onPress={handleCreateRegularMeetup}>
				<Text style={styles.addButtonText}>Add Regular Meetup</Text>
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
	meetupItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	meetupTile: {
		flex: 1,
		padding: 20,
		marginVertical: 10,
		backgroundColor: '#4CAF50',
		borderRadius: 10,
	},
	meetupText: {
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

export default RegularMeetupsScreen;
