import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

export default function App() {
  const [enteredGoalText, setEnteredGoalText] = useState('');
  const [courseGoals, setCourseGoals] = useState([]);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Montserrat_600SemiBold
  });

  if (!fontsLoaded) {
    return null;
  }

  function goalInputHandler(enteredText) {
    setEnteredGoalText(enteredText);
  }

  function addGoalHandler() {
    if (enteredGoalText.trim().length === 0) return;
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      { text: enteredGoalText, id: Math.random().toString() },
    ]);
    setEnteredGoalText('');
  }

  function deleteGoalHandler(id) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.id !== id);
    });
  }

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>My Goals</Text>
        <Text style={styles.subtitle}>Helwan University - Lab 01</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="What's your goal?"
          placeholderTextColor="#94a3b8"
          onChangeText={goalInputHandler}
          value={enteredGoalText}
        />
        <TouchableOpacity style={styles.button} onPress={addGoalHandler} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Add Goal</Text>
        </TouchableOpacity>
      </View>

      {/* List Section */}
      <View style={styles.goalsContainer}>
        <FlatList
          data={courseGoals}
          renderItem={(itemData) => (
            <TouchableOpacity 
              activeOpacity={0.6} 
              onLongPress={() => deleteGoalHandler(itemData.item.id)}
            >
              <View style={styles.goalItem}>
                <View style={styles.goalDot} />
                <Text style={styles.goalText}>{itemData.item.text}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No goals yet. Start adding some!</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#0f172a', // Deep slate background
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748b',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#f8fafc',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#6366f1', // Indigo primary
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  goalsContainer: {
    flex: 5,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    marginRight: 16,
  },
  goalText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#475569',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});
