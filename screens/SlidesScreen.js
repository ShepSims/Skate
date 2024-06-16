import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getDatabase, ref, get, remove, push, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const SlidesScreen = () => {
	const [slides, setSlides] = useState([]);
	const navigation = useNavigation();
	const database = getDatabase();

	useEffect(() => {
		const fetchSlides = async () => {
			try {
				const snapshot = await get(ref(database, `/slides`));
				const data = snapshot.val();
				const slidesArray = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
				setSlides(slidesArray);
			} catch (error) {
				console.error('Error fetching slides:', error);
			}
		};

		fetchSlides();
	}, []);

	const handleDelete = (id) => {
		Alert.alert('Delete Slide', 'Are you sure you want to delete this slide?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Delete', style: 'destructive', onPress: () => deleteSlide(id) },
		]);
	};

	const deleteSlide = async (id) => {
		try {
			await remove(ref(database, `/slides/${id}`));
			setSlides(slides.filter((slide) => slide.id !== id));
		} catch (error) {
			console.error('Error deleting slide:', error);
		}
	};

	const handleCreateSlide = () => {
		navigation.navigate('CreateSlide');
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Slides</Text>
			<FlatList
				data={slides}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.slideItem}>
						<TouchableOpacity style={styles.slideTile} onPress={() => navigation.navigate('SlideDetail', { slideId: item.id })}>
							<Text style={styles.slideText}>
								{item.meetupSpot} - {item.date}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
							<Text style={styles.deleteButtonText}>Delete</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
			<TouchableOpacity style={styles.addButton} onPress={handleCreateSlide}>
				<Text style={styles.addButtonText}>Add Slide</Text>
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
	slideItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	slideTile: {
		flex: 1,
		padding: 20,
		marginVertical: 10,
		backgroundColor: '#4CAF50',
		borderRadius: 10,
	},
	slideText: {
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

export default SlidesScreen;
