import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const RouteDetailScreen = ({ route }) => {
	const { routeId } = route.params;
	const [routeDetails, setRouteDetails] = useState(null);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchRouteDetails = async () => {
			try {
				const snapshot = await get(ref(database, `/routes/${routeId}`));
				setRouteDetails(snapshot.val());
			} catch (error) {
				console.error('Error fetching route details:', error);
			}
		};

		fetchRouteDetails();
	}, [routeId]);

	const handleDelete = () => {
		Alert.alert('Delete Route', 'Are you sure you want to delete this route?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: deleteRoute },
		]);
	};

	const deleteRoute = async () => {
		try {
			await remove(ref(database, `/routes/${routeId}`));
			navigation.goBack();
		} catch (error) {
			console.error('Error deleting route:', error);
		}
	};

	if (!routeDetails) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Route Details</Text>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: routeDetails.coordinates[0].latitude,
					longitude: routeDetails.coordinates[0].longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
			>
				<Polyline coordinates={routeDetails.coordinates} strokeWidth={2} />
			</MapView>
			<Text style={styles.text}>Name: {routeDetails.name}</Text>
			<Text style={styles.text}>Difficulty: {routeDetails.difficulty}</Text>
			<Text style={styles.text}>Distance: {routeDetails.distance} miles</Text>
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
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 0.6,
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
	},
	deleteButtonText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default RouteDetailScreen;
