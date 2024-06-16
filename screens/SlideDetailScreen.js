import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const SlideDetailScreen = ({ route }) => {
	const { slideId } = route.params;
	const [slideDetails, setSlideDetails] = useState(null);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchSlideDetails = async () => {
			try {
				const snapshot = await get(ref(database, `/slides/${slideId}`));
				setSlideDetails(snapshot.val());
			} catch (error) {
				console.error('Error fetching slide details:', error);
			}
		};

		fetchSlideDetails();
	}, [slideId]);

	const handleDelete = () => {
		Alert.alert('Delete Slide', 'Are you sure you want to delete this slide?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: deleteSlide },
		]);
	};

	const deleteSlide = async () => {
		try {
			await remove(ref(database, `/slides/${slideId}`));
			navigation.goBack();
		} catch (error) {
			console.error('Error deleting slide:', error);
		}
	};

	if (!slideDetails) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Loading...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Slide Details</Text>
			<Text style={styles.text}>Start Time: {slideDetails.startTime}</Text>
			<Text style={styles.text}>Length of Time: {slideDetails.lengthOfTime} hours</Text>
			<Text style={styles.text}>Meetup Spot: {slideDetails.meetupSpot}</Text>
			<Text style={styles.text}>Date: {slideDetails.date}</Text>
			<TouchableOpacity style={styles.routeLink} onPress={() => navigation.navigate('RouteDetail', { routeId: slideDetails.route })}>
				<Text style={styles.routeLinkText}>View Route Details</Text>
			</TouchableOpacity>
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
	routeLink: {
		marginTop: 10,
		marginBottom: 20,
	},
	routeLinkText: {
		color: '#4CAF50',
		fontSize: 18,
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

export default SlideDetailScreen;
