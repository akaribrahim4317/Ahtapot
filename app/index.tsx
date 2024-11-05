import { StyleSheet, Text, FlatList, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import Item from '../components/Item';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface Task {
  _id: string;
  task: string;
  isFinished: boolean;
}
type RootStackParamList = {
  TasksResultScreen: { tasks: Task[] };
  NewTaskScreen: undefined;
  PngMakerScreen: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();



  const [liftTasks, setLiftTasks] = useState<Task[]>([]);

  useEffect(() => {
    axios.get('https://akakar-task-app-ccaef9101887.herokuapp.com/api/v1/elevator/getAll')
      .then((response) => {
        setLiftTasks(response.data.models);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ahtapot Asansör</Text>
      <FlatList
        data={liftTasks}
        renderItem={({ item }) => (
          <Item
            id={item._id}
            task={item.task}
            isFinished={item.isFinished}
            onStatusChange={(id, newStatus) => {
              setLiftTasks(prevTasks =>
                prevTasks.map(task =>
                  task._id === id ? { ...task, isFinished: newStatus } : task
                )
              );
            }}
          />
        )}
        keyExtractor={(item) => item._id}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewTaskScreen')}>
          <Text style={styles.buttonText}>Görev Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PngMakerScreen')}>
          <Text style={styles.buttonText}>PNG oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF4545' }]} onPress={() => {
          console.log('Navigating with tasks:', liftTasks);
          navigation.navigate('TasksResultScreen', { tasks: liftTasks });
        }}>
          <Text style={styles.buttonText}>Yazdır</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: 'column'
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    elevation: 2,
    margin: 2,
    height: 50,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
