import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const ProfileScreen = () => {
	const [userDetails, setUserDetails] = useState({
		name: '',
		instagram: '',
		telegram: '',
		bio: '',
		skaterSince: '',
		skateType: '',
		completedSlides: [],
	});
	const [editing, setEditing] = useState(false);
	const navigation = useNavigation();
	const database = getDatabase();
	const auth = getAuth();
	const user = auth.currentUser;

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const snapshot = await get(ref(database, `/users/${user.uid}`));
				setUserDetails(snapshot.val() || {});
			} catch (error) {
				console.error('Error fetching user details:', error);
			}
		};

		fetchUserDetails();
	}, [user.uid]);

	const handleSave = async () => {
		try {
			await update(ref(database, `/users/${user.uid}`), userDetails);
			setEditing(false);
		} catch (error) {
			console.error('Error saving user details:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Profile</Text>
			{editing ? (
				<>
					<TextInput
						style={styles.input}
						placeholder='Name'
						value={userDetails.name}
						onChangeText={(text) => setUserDetails({ ...userDetails, name: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder='Instagram'
						value={userDetails.instagram}
						onChangeText={(text) => setUserDetails({ ...userDetails, instagram: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder='Telegram'
						value={userDetails.telegram}
						onChangeText={(text) => setUserDetails({ ...userDetails, telegram: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder='Bio'
						value={userDetails.bio}
						onChangeText={(text) => setUserDetails({ ...userDetails, bio: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder='Skater Since'
						value={userDetails.skaterSince}
						onChangeText={(text) => setUserDetails({ ...userDetails, skaterSince: text })}
					/>
					<TextInput
						style={styles.input}
						placeholder='Type of Skate(s)'
						value={userDetails.skateType}
						onChangeText={(text) => setUserDetails({ ...userDetails, skateType: text })}
					/>
					<TouchableOpacity style={styles.button} onPress={handleSave}>
						<Text style={styles.buttonText}>Save</Text>
					</TouchableOpacity>
				</>
			) : (
				<>
					<Text style={styles.text}>Name: {userDetails.name}</Text>
					<Text style={styles.text}>Instagram: {userDetails.instagram}</Text>
					<Text style={styles.text}>Telegram: {userDetails.telegram}</Text>
					<Text style={styles.text}>Bio: {userDetails.bio}</Text>
					<Text style={styles.text}>Skater Since: {userDetails.skaterSince}</Text>
					<Text style={styles.text}>Type of Skate(s): {userDetails.skateType}</Text>
					<TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
						<Text style={styles.buttonText}>Edit</Text>
					</TouchableOpacity>
				</>
			)}
			<Text style={styles.header}>Completed Slides</Text>
			<FlatList
				data={userDetails.completedSlides}
				keyExtractor={(item) => item}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.slideTile} onPress={() => navigation.navigate('SlideDetail', { slideId: item })}>
						<Text style={styles.slideText}>Slide {item}</Text>
					</TouchableOpacity>
				)}
			/>
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
	text: {
		fontSize: 18,
		marginVertical: 5,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
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
	slideTile: {
		padding: 20,
		marginVertical: 10,
		backgroundColor: '#4CAF50',
		borderRadius: 10,
	},
	slideText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default ProfileScreen;
