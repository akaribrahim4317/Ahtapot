import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Modal } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as FileSystem from 'expo-file-system';
import RNPrinter from 'react-native-thermal-receipt-printer';

interface Task {
    _id: string;
    task: string;
    isFinished: boolean;
}

const PngMakerScreen: React.FC = () => {
    const [liftTasks, setLiftTasks] = useState<Task[]>([]);
    const [explanation, setExplanation] = useState<string>('');
    const [submittedExplanation, setSubmittedExplanation] = useState<string>('');
    const [imageUris, setImageUris] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const viewRef = useRef<View>(null);

    useEffect(() => {
        axios
            .get('https://akakar-task-app-ccaef9101887.herokuapp.com/api/v1/elevator/getAll')
            .then((response) => {
                setLiftTasks(response.data.models);
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error);
            });
    }, []);

    const addExplanation = () => {
        if (explanation.trim()) {
            setSubmittedExplanation(explanation);
            setExplanation('');
        } else {
            alert("Please enter an explanation");
        }
    };

    const capturePNG = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access media library is required!');
                return;
            }

            if (viewRef.current) {
                const uri = await captureRef(viewRef, {
                    format: 'png',
                    quality: 1,
                });

                const fileName = `${FileSystem.documentDirectory}image_${Date.now()}.png`;
                await FileSystem.copyAsync({ from: uri, to: fileName });
                await MediaLibrary.saveToLibraryAsync(fileName);
                setImageUris(prevUris => [...prevUris, fileName]);
                alert('Image saved locally and ready to share!');
            }
        } catch (error) {
            console.error('Error capturing PNG:', error);
        }
    };

    const openImage = (uri: string) => {
        setSelectedImageUri(uri);
        setModalVisible(true);
    };

    const shareImage = async () => {
        if (selectedImageUri) {
            try {
                await Sharing.shareAsync(selectedImageUri);
            } catch (error) {
                console.error('Error sharing image:', error);
            }
        }
    };

    const printImage = async (uri: string) => {
        if (!uri) {
            alert("No image selected for printing.");
            return;
        }

        try {
            const imageBase64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const response = await RNPrinter.printImage(imageBase64);
            if (response) {
                alert("Image sent to printer.");
            } else {
                alert("Failed to send image to printer.");
            }
        } catch (error) {
            console.error('Error printing image:', error);
            alert("Error printing the image. Please try again.");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View ref={viewRef} style={{ backgroundColor: 'white', padding: 20 }}>
                <View style={styles.header}>
                    <View style={{ marginRight: 10 }}>
                        <FontAwesome5 name="octopus-deploy" size={30} color="orange" />
                    </View>
                    <Text style={styles.title}>Ahtapot Asansör</Text>
                </View>
                <FlatList
                    data={liftTasks}
                    renderItem={({ item }) => (
                        <View style={styles.taskContainer}>
                            <Text style={styles.taskText}>{item.task}</Text>
                            {item.isFinished ? (
                                <Ionicons name="checkmark-circle" size={24} color="green" />
                            ) : (
                                <Entypo name="circle-with-cross" size={24} color="red" />
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                />
                {submittedExplanation && (
                    <Text style={styles.explanation}>{submittedExplanation}</Text>
                )}
            </View>
            <View style={styles.explanationContainer}>
                <TextInput
                    style={styles.explanationInput}
                    placeholder="Bir açıklama yazınız (optional)"
                    value={explanation}
                    onChangeText={setExplanation}
                />
                <TouchableOpacity style={styles.addButton} onPress={addExplanation}>
                    <Ionicons name="add-circle" size={24} color="#007bff" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={capturePNG}>
                <Text style={styles.buttonText}>Generate PNG</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                {imageUris.map((uri, index) => (
                    <TouchableOpacity key={index} onPress={() => openImage(uri)}>
                        <Image
                            source={{ uri }}
                            style={styles.smallImage}
                        />
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity
                style={styles.printButton}
                onPress={() => {
                    if (selectedImageUri) {
                        printImage(selectedImageUri);
                    } else {
                        alert("Please select an image to print.");
                    }
                }}
            >
                <Text style={styles.buttonText}>Print Image</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={false} animationType="slide">
                <View style={styles.modalBackground}>
                    <Image source={{ uri: selectedImageUri }} style={styles.fullScreenImage} resizeMode="contain" />
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                        <Ionicons name="close" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton} onPress={shareImage}>
                        <Ionicons name="share-social" size={30} color="gray" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.printButton} onPress={() => printImage(selectedImageUri)}>
                        <Text style={styles.buttonText}>Print Image</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default PngMakerScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    taskText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    explanation: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '500',
        color: '#007bff',
        paddingHorizontal: 8,
    },
    explanationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    explanationInput: {
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        flex: 1,
        marginRight: 10,
    },
    addButton: {
        padding: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    smallImage: {
        width: 80,
        height: 80,
        marginRight: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '80%',
        borderRadius: 5,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    printButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    shareButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
});
