import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';

const StatisticsScreen = () => {
	const [totalMiles, setTotalMiles] = useState(0);
	const [totalSkates, setTotalSkates] = useState(0);
	const database = getDatabase();

	useEffect(() => {
		const fetchStatistics = async () => {
			try {
				const snapshot = await get(ref(database, '/selectedRoutes'));
				const data = snapshot.val();
				const selectedRouteIds = data ? Object.keys(data).map((key) => data[key]) : [];

				const routePromises = selectedRouteIds.map(async (id) => {
					const routeSnapshot = await get(ref(database, `/routes/all/${id}`));
					return routeSnapshot.val();
				});

				const selectedRoutes = await Promise.all(routePromises);
				const miles = selectedRoutes.reduce((sum, route) => sum + (route ? route.distance : 0), 0);
				const skates = selectedRoutes.length;

				setTotalMiles(miles);
				setTotalSkates(skates);
			} catch (error) {
				console.error('Error fetching statistics:', error);
			}
		};

		fetchStatistics();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Statistics</Text>
			<Text style={styles.stat}>Total Miles: {totalMiles}</Text>
			<Text style={styles.stat}>Total Skates: {totalSkates}</Text>
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
	stat: {
		fontSize: 18,
		marginVertical: 5,
	},
});

export default StatisticsScreen;
