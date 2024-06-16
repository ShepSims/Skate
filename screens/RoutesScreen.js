import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const RoutesScreen = () => {
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

	const handleDelete = (id) => {
		Alert.alert('Delete Route', 'Are you sure you want to delete this route?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => deleteRoute(id) },
		]);
	};

	const deleteRoute = async (id) => {
		try {
			await remove(ref(database, `/routes/${id}`));
			setRoutes(routes.filter((route) => route.id !== id));
		} catch (error) {
			console.error('Error deleting route:', error);
		}
	};

	const handleCreateRoute = async () => {
		navigation.navigate('CreateRoute');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Routes</Text>
			<FlatList
				data={routes}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.routeItem}>
						<TouchableOpacity style={styles.routeTile} onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}>
							<Text style={styles.routeText}>
								{item.googleMapsRoute} - {item.distance} miles - {item.difficulty}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
							<Text style={styles.deleteButtonText}>Delete</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
			<TouchableOpacity style={styles.addButton} onPress={handleCreateRoute}>
				<Text style={styles.addButtonText}>Add Route</Text>
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
	routeItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	routeTile: {
		flex: 1,
		padding: 20,
		marginVertical: 10,
		backgroundColor: '#4CAF50',
		borderRadius: 10,
	},
	routeText: {
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

export default RoutesScreen;
