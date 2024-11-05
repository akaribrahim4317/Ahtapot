import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './index';
import NewTaskScreen from './NewTaskScreen'
import TasksResultScreen from './TasksResultScreen';
import PngMakerScreen from './PngMakerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TasksResultScreen" component={TasksResultScreen} />
        <Stack.Screen name="NewTaskScreen" component={NewTaskScreen} />
        <Stack.Screen name="PngMakerScreen" component={PngMakerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
