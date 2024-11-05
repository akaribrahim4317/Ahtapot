import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useNavigation } from '@react-navigation/native';

interface Task {
  _id: string;
  task: string;
  isFinished: boolean;
}

type TasksResultScreenNavigationProp = 'TasksResultScreen';

const TasksResultScreen = () => {
  const [explanation, setExplanation] = useState<string>('');
  const [liftTasks, setLiftTasks] = useState<Task[]>([]);
  const navigation = useNavigation<TasksResultScreenNavigationProp>();

  useEffect(() => {
    axios
      .get('https://akakar-task-app-ccaef9101887.herokuapp.com/api/v1/elevator/getAll')
      .then((response) => {
        setLiftTasks(response.data.models);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const generateHTML = (): string => {
    const tasksHTML = liftTasks
      .map(
        (task) => `
          <div style="margin-bottom: 10px;">
            <span style="font-weight: bold;">${task.task}</span> - 
            <span style="color: ${task.isFinished ? 'green' : 'red'};">
              ${task.isFinished ? '✔️' : '❌'}
            </span>
          </div>`
      )
      .join('');
    return `
      <body>
        <h2>Ahtapot Asansör</h2>
        <h1>Bakımda Yapılanlar</h1>
        <div>${tasksHTML}</div>
        <h2>${explanation}</h2>
      </body>
    `;
  };

  const print = async () => {
    const html = generateHTML();
    const file = await printToFileAsync({ html, base64: false });
    await shareAsync(file.uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Task Details</Text>
        <FlatList
          data={liftTasks}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <Text style={styles.taskText}>{item.task}</Text>
              {item.isFinished ? (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              ) : (
                <Entypo name="circle-with-cross" size={24} color="black" />
              )}
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
        <TextInput
          style={styles.inputContainer}
          placeholder="Açıklama..."
          placeholderTextColor="#999"
          value={explanation}
          onChangeText={setExplanation}
        />
        <TouchableOpacity style={styles.button} onPress={print}>
          <Text style={styles.buttonText}>PDF Olustur</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TasksResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  inputContainer: {
    height: 50,
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 3,
    marginVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
});
