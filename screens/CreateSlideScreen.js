import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { getDatabase, ref, push, set, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const CreateSlideScreen = () => {
	const [startTime, setStartTime] = useState('');
	const [lengthOfTime, setLengthOfTime] = useState('');
	const [meetupSpot, setMeetupSpot] = useState('');
	const [selectedRoute, setSelectedRoute] = useState('');
	const [date, setDate] = useState('');
	const [routes, setRoutes] = useState([]);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchRoutes = async () => {
			try {
				const snapshot = await get(ref(database, `/routes`));
				const data = snapshot.val();
				const routesArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
				setRoutes(routesArray);
			} catch (error) {
				console.error('Error fetching routes:', error);
			}
		};

		fetchRoutes();
	}, []);

	const handleCreateSlide = async () => {
		try {
			const newSlideRef = push(ref(database, `/slides`));
			await set(newSlideRef, {
				startTime,
				lengthOfTime: parseFloat(lengthOfTime),
				meetupSpot,
				route: selectedRoute,
				date,
			});
			navigation.goBack();
		} catch (error) {
			console.error('Error creating slide:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Create Slide</Text>
			<TextInput style={styles.input} placeholder='Start Time' value={startTime} onChangeText={setStartTime} />
			<TextInput style={styles.input} placeholder='Length of Time' value={lengthOfTime} onChangeText={setLengthOfTime} keyboardType='numeric' />
			<TextInput style={styles.input} placeholder='Meetup Spot' value={meetupSpot} onChangeText={setMeetupSpot} />
			<Text style={styles.subHeader}>Select Route</Text>
			<FlatList
				data={routes}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={[styles.routeItem, selectedRoute === item.id && styles.selectedRouteItem]}
						onPress={() => setSelectedRoute(item.id)}
					>
						<Text style={styles.routeText}>
							{item.googleMapsRoute} - {item.distance} miles - {item.difficulty}
						</Text>
					</TouchableOpacity>
				)}
			/>
			<TextInput style={styles.input} placeholder='Date' value={date} onChangeText={setDate} />
			<TouchableOpacity style={styles.button} onPress={handleCreateSlide}>
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
	subHeader: {
		fontSize: 18,
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	routeItem: {
		padding: 20,
		marginVertical: 10,
		backgroundColor: '#4CAF50',
		borderRadius: 10,
	},
	selectedRouteItem: {
		backgroundColor: '#388E3C',
	},
	routeText: {
		color: '#fff',
		fontSize: 18,
	},
	button: {
		backgroundColor: '#4CAF50',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default CreateSlideScreen;
