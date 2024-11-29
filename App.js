import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const askNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Notification permission is required for this app to work.');
      }
    };
    askNotificationPermission();
  }, []);

  // Schedule notifications
  const scheduleNotifications = (deadlineTime) => {
    const deadlineDate = new Date(deadlineTime);

    // Schedule notification for 12:00 PM (Noon) on the deadline day
    const noonNotificationTime = new Date(deadlineDate.setHours(12, 0, 0, 0)); // Set to 12:00 PM (Noon)
    if (noonNotificationTime > new Date()) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Assignment Reminder',
          body: `Your assignment is due today at 11:59 PM.`,
        },
        trigger: noonNotificationTime,
      });
    }

    // Schedule notification for 11:30 PM on the deadline day
    const elevenThirtyPMNotificationTime = new Date(deadlineDate.setHours(23, 30, 0, 0)); // Set to 11:30 PM
    if (elevenThirtyPMNotificationTime > new Date()) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Assignment Reminder',
          body: `Your assignment is due in 30 minutes.`,
        },
        trigger: elevenThirtyPMNotificationTime,
      });
    }
  };

  // Add a new assignment
  const addAssignment = () => {
    if (!title || !deadline) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    const newAssignment = {
      title,
      deadline,
    };

    setAssignments([newAssignment, ...assignments]);
    scheduleNotifications(deadline);
    setTitle('');
    setDeadline('');
  };

  // Mark assignment as completed
  const completeAssignment = (index) => {
    const updatedAssignments = [...assignments];
    updatedAssignments.splice(index, 1);
    setAssignments(updatedAssignments);
    Alert.alert('Completed', 'Assignment marked as completed.');
  };

  // Show popup to confirm completion
  const confirmCompletion = (index) => {
    Alert.alert(
      'Complete Assignment',
      'Have you completed this assignment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => completeAssignment(index) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Assignment Tracker</Text>

      <FlatList
        data={assignments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Text
            style={styles.assignment}
            onPress={() => confirmCompletion(index)} 
          >
            {item.title} - {item.deadline}
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.noAssignments}>No assignments yet.</Text>}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Assignment Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Deadline (YYYY-MM-DD)"
          value={deadline}
          onChangeText={setDeadline}
        />
        <Button title="Add Assignment" onPress={addAssignment} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  assignment: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  noAssignments: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
