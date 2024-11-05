import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const NewTaskScreen = () => {
    const navigation = useNavigation();
    const [newTask, setNewTask] = useState('');
    const [error, setError] = useState('');

    const insertTask = async () => {
        if (!newTask.trim()) {
            setError("Görev boş olamaz!");
            return;
        }
        try {
            const response = await axios.post('https://akakar-task-app-ccaef9101887.herokuapp.com/api/v1/elevator/insert', {
                task: newTask,
                isFinished: false
            });
            console.log(response.data);
            setNewTask('');
            setError('');
            navigation.goBack();
        } catch (error) {
            console.error("Error adding task:", error);
            setError("Görev eklenemedi. Lütfen tekrar deneyin.");
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Geri</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Yeni Görev Ekle</Text>
            <TextInput
                style={styles.input}
                placeholder="Görev giriniz..."
                value={newTask}
                onChangeText={setNewTask}
                placeholderTextColor="#999"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={insertTask}>
                <Text style={styles.buttonText}>Görev Ekle</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NewTaskScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 3,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    backButton: {
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    backButtonText: {
        fontSize: 16,
        color: '#007bff',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 2,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
