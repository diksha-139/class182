import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	StatusBar,
	Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as FaceDetector from 'expo-face-detector';
import Filter1 from './Filter1';

export default class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission: null,
			faces: [],
		};
	}

	componentDidMount() {
		Permissions.askAsync(Permissions.CAMERA).then(this.onCameraPermission);
	}

	onCameraPermission = (data) => {
		this.setState({ hasCameraPermission: data.status === 'granted' });
	};

	onFacesDetected = (faces) => {
		this.setState({ faces: faces });
		console.log(this.state.faces)
	};

	onFaceDetectionError = (error) => {
		console.log(error);
	};

	render() {
		const { hasCameraPermission } = this.state;
		if (hasCameraPermission === null) {
			return <View />;
		}
		if (hasCameraPermission === false) {
			return (
				<View style={styles.container}>
					<Text>No access to camera</Text>
				</View>
			);
		}
		
		return (
			<View style={styles.container}>
				<SafeAreaView style={styles.droidSafeArea} />
				<View style={styles.headingContainer}>
					<Text style={styles.titleText}>FRAPP</Text>
				</View>
				<View style={styles.cameraStyle}>
					<Camera
						style={{ flex: 1 }}
						type={Camera.Constants.Type.front}
						faceDetectorSettings={{
							mode: FaceDetector.FaceDetectorMode.fast,
							detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
							runClassifications: FaceDetector.FaceDetectorClassifications.all,
						}}
						onFacesDetected={this.onFacesDetected}
						onFacesDetectionError={this.onFacesDetectionError}
					/>
					{console.log(this.state.faces)}
					{this.state.faces.map((face)=>{
						return <Filter1  face={face} />;
					})}
				</View>
				<View style={styles.filterContainer}></View>
				<View style={styles.actionContainer}></View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	droidSafeArea: {
		marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	headingContainer: {
		flex: 0.1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		fontSize: 30,
	},
	cameraStyle: {
		flex: 0.65,
	},
	filterContainer: {},
	actionContainer: {},
});