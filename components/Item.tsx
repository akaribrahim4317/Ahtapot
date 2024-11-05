import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

interface ItemProps {
    id: string;
    task: string;
    isFinished: boolean;
    onStatusChange: (id: string, newStatus: boolean) => void;
}

const Item: React.FC<ItemProps> = ({ id, task, isFinished: initialDone, onStatusChange }) => {
    const [done, setDone] = useState(initialDone);

    const toggleTamamlandi = async () => {
        const newStatus = !done;
        setDone(newStatus);

        try {
            await axios.put(`https://akakar-task-app-ccaef9101887.herokuapp.com/api/v1/elevator/update/${id}`, {
                isFinished: newStatus,
            });
            onStatusChange(id, newStatus);
        } catch (error) {
            console.error("Error updating task status:", error);
            setDone(done);
        }
    };

    return (
        <View style={styles.itemContainer}>
            <Text style={done ? styles.completedTask : styles.taskText}>{task}</Text>
            <TouchableOpacity onPress={toggleTamamlandi}>
                <Ionicons name={done ? "checkmark-circle" : "ellipse-outline"} size={24} color={done ? "green" : "gray"} />
            </TouchableOpacity>
        </View>
    );
};

export default Item;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    taskText: {
        color: 'black',
        fontSize: 16,
    },
    completedTask: {
        color: 'gray',
        fontSize: 16,
        textDecorationLine: 'line-through',
    },
});
