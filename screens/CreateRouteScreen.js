import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const CreateRouteScreen = () => {
	const [markers, setMarkers] = useState([]);
	const [routeName, setRouteName] = useState('');
	const [difficulty, setDifficulty] = useState('');
	const [distance, setDistance] = useState(0);
	const [initialRegion, setInitialRegion] = useState(null);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const getLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setInitialRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			});
		};

		getLocation();
	}, []);

	const handleLongPress = (event) => {
		const newMarker = event.nativeEvent.coordinate;
		setMarkers([...markers, newMarker]);
		if (markers.length > 0) {
			const lastMarker = markers[markers.length - 1];
			const newDistance = calculateDistance(lastMarker, newMarker);
			setDistance(distance + newDistance);
		}
	};

	const handlePlaceSelect = (data, details) => {
		const newMarker = {
			latitude: details.geometry.location.lat,
			longitude: details.geometry.location.lng,
		};
		setMarkers([...markers, newMarker]);
		if (markers.length > 0) {
			const lastMarker = markers[markers.length - 1];
			const newDistance = calculateDistance(lastMarker, newMarker);
			setDistance(distance + newDistance);
		}
	};

	const calculateDistance = (coord1, coord2) => {
		const toRad = (value) => (value * Math.PI) / 180;
		const R = 6371; // Radius of Earth in km
		const dLat = toRad(coord2.latitude - coord1.latitude);
		const dLon = toRad(coord2.longitude - coord1.longitude);
		const lat1 = toRad(coord1.latitude);
		const lat2 = toRad(coord2.latitude);

		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = R * c; // Distance in km
		return d * 0.621371; // Convert km to miles
	};

	const handleSaveRoute = async () => {
		if (!routeName || markers.length < 2) {
			Alert.alert('Please provide a route name and mark at least two points on the map.');
			return;
		}
		try {
			const newRouteRef = push(ref(database, `/routes`));
			await set(newRouteRef, {
				name: routeName,
				difficulty: difficulty,
				distance: distance,
				coordinates: markers,
			});
			navigation.goBack();
		} catch (error) {
			console.error('Error creating route:', error);
		}
	};

	if (!initialRegion) {
		return (
			<View style={styles.container}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Create Route</Text>
			<GooglePlacesAutocomplete
				placeholder='Search for places'
				onPress={handlePlaceSelect}
				query={{
					key: 'YOUR_GOOGLE_API_KEY',
					language: 'en',
				}}
				fetchDetails
				styles={{
					textInputContainer: styles.textInputContainer,
					textInput: styles.textInput,
				}}
			/>
			<MapView style={styles.map} initialRegion={initialRegion} onLongPress={handleLongPress}>
				{markers.map((marker, index) => (
					<Marker key={index} coordinate={marker} />
				))}
				{markers.length > 1 && <Polyline coordinates={markers} strokeWidth={2} />}
			</MapView>
			<TextInput style={styles.input} placeholder='Route Name' value={routeName} onChangeText={setRouteName} />
			<TextInput style={styles.input} placeholder='Difficulty' value={difficulty} onChangeText={setDifficulty} />
			<Text style={styles.distance}>Distance: {distance.toFixed(2)} miles</Text>
			<TouchableOpacity style={styles.button} onPress={handleSaveRoute}>
				<Text style={styles.buttonText}>Save Route</Text>
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
		height: Dimensions.get('window').height * 0.4,
	},
	textInputContainer: {
		width: '100%',
		marginBottom: 10,
	},
	textInput: {
		height: 40,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		backgroundColor: '#fff',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
		width: '100%',
	},
	distance: {
		fontSize: 18,
		marginBottom: 10,
	},
	button: {
		backgroundColor: '#4CAF50',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
		width: '100%',
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default CreateRouteScreen;
