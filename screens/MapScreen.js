import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {
	const [markers, setMarkers] = useState([]);
	const [routeName, setRouteName] = useState('');
	const navigation = useNavigation();
	const database = getDatabase();

	const handleLongPress = (event) => {
		setMarkers([...markers, event.nativeEvent.coordinate]);
	};

	const handleSaveRoute = async () => {
		try {
			const newRouteRef = push(ref(database, `/routes`));
			await set(newRouteRef, {
				name: routeName,
				coordinates: markers,
			});
			navigation.goBack();
		} catch (error) {
			console.error('Error creating route:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Create Route</Text>
			<MapView style={styles.map} onLongPress={handleLongPress}>
				{markers.map((marker, index) => (
					<Marker key={index} coordinate={marker} />
				))}
				{markers.length > 1 && <Polyline coordinates={markers} strokeWidth={2} />}
			</MapView>
			<TextInput style={styles.input} placeholder='Route Name' value={routeName} onChangeText={setRouteName} />
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
		height: Dimensions.get('window').height * 0.6,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
		width: '100%',
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

export default MapScreen;
