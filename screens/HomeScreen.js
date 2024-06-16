import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
	const handlePress = () => {
		navigation.navigate('EventPage');
	};

	return (
		<View style={styles.container}>
			{[...Array(6)].map((_, index) => (
				<TouchableOpacity key={index} style={styles.tile} onPress={handlePress}>
					<Text style={styles.tileText}>Event {index + 1}</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
	},
	tile: {
		width: '45%',
		margin: '2.5%',
		height: 150,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#4CAF50',
		borderRadius: 10,
	},
	tileText: {
		color: '#fff',
		fontSize: 18,
	},
});

export default HomeScreen;
