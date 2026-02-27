import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';

export default function App() {
    const [enteredGoalText, setEnteredGoalText] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('Medium');
    const [courseGoals, setCourseGoals] = useState([]);

    // Editing State
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [editText, setEditText] = useState('');

    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        Montserrat_600SemiBold
    });

    if (!fontsLoaded) {
        return null;
    }

    const completedCount = courseGoals.filter(goal => goal.completed).length;
    const totalCount = courseGoals.length;

    const priorities = [
        { label: 'Low', color: '#3b82f6' },
        { label: 'Medium', color: '#f59e0b' },
        { label: 'High', color: '#ef4444' }
    ];

    function addGoalHandler() {
        if (enteredGoalText.trim().length === 0) return;
        setCourseGoals((currentCourseGoals) => [
            ...currentCourseGoals,
            {
                text: enteredGoalText,
                id: Math.random().toString(),
                completed: false,
                priority: selectedPriority
            },
        ]);
        setEnteredGoalText('');
    }

    function toggleGoalHandler(id) {
        setCourseGoals((currentCourseGoals) => {
            return currentCourseGoals.map((goal) =>
                goal.id === id ? { ...goal, completed: !goal.completed } : goal
            );
        });
    }

    function deleteGoalHandler(id) {
        Alert.alert(
            "Delete Goal",
            "Are you sure you want to delete this goal?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive", onPress: () => {
                        setCourseGoals((currentCourseGoals) => currentCourseGoals.filter((goal) => goal.id !== id));
                    }
                }
            ]
        );
    }

    function startEditHandler(goal) {
        setEditingGoal(goal);
        setEditText(goal.text);
        setIsEditModalVisible(true);
    }

    function saveEditHandler() {
        if (editText.trim().length === 0) return;
        setCourseGoals((currentCourseGoals) => {
            return currentCourseGoals.map((goal) =>
                goal.id === editingGoal.id ? { ...goal, text: editText } : goal
            );
        });
        setIsEditModalVisible(false);
        setEditingGoal(null);
    }

    function clearCompletedHandler() {
        setCourseGoals((currentCourseGoals) => currentCourseGoals.filter((goal) => !goal.completed));
    }

    const getPriorityColor = (label) => priorities.find(p => p.label === label)?.color || '#64748b';

    return (
        <View style={styles.appContainer}>
            <StatusBar barStyle="light-content" />

            {/* Edit Modal */}
            <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Goal</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editText}
                            onChangeText={setEditText}
                            autoFocus={true}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={saveEditHandler}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>My Goals</Text>
                    <Text style={styles.subtitle}>
                        {totalCount > 0 ? `${completedCount} of ${totalCount} completed` : "Helwan University - Lab 01"}
                    </Text>
                </View>
                {completedCount > 0 && (
                    <TouchableOpacity onPress={clearCompletedHandler}>
                        <Text style={styles.clearText}>Clear Done</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Input & Priority Selector */}
            <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="What's your goal?"
                        placeholderTextColor="#94a3b8"
                        onChangeText={setEnteredGoalText}
                        value={enteredGoalText}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addGoalHandler}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.prioritySelector}>
                    {priorities.map((p) => (
                        <TouchableOpacity
                            key={p.label}
                            style={[
                                styles.priorityOption,
                                selectedPriority === p.label && { backgroundColor: p.color, borderColor: p.color }
                            ]}
                            onPress={() => setSelectedPriority(p.label)}
                        >
                            <Text style={[
                                styles.priorityOptionText,
                                selectedPriority === p.label && { color: 'white' }
                            ]}>{p.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* List */}
            <View style={styles.goalsContainer}>
                <FlatList
                    data={courseGoals}
                    renderItem={(itemData) => (
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => toggleGoalHandler(itemData.item.id)}
                            onLongPress={() => deleteGoalHandler(itemData.item.id)}
                        >
                            <View style={[styles.goalItem, itemData.item.completed && styles.goalItemCompleted]}>
                                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(itemData.item.priority) }]} />
                                <View style={styles.goalTextContainer}>
                                    <Text style={[styles.goalText, itemData.item.completed && styles.goalTextCompleted]}>
                                        {itemData.item.text}
                                    </Text>
                                    <Text style={styles.priorityLabel}>{itemData.item.priority} Priority</Text>
                                </View>
                                <View style={styles.itemActions}>
                                    {!itemData.item.completed && (
                                        <TouchableOpacity onPress={() => startEditHandler(itemData.item)}>
                                            <Text style={styles.editIcon}>✏️</Text>
                                        </TouchableOpacity>
                                    )}
                                    {itemData.item.completed && <Text style={styles.checkIcon}>✓</Text>}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>No goals yet. Select a priority and add one!</Text>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    appContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 24, backgroundColor: '#0f172a' },
    header: { marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    title: { fontSize: 34, fontFamily: 'Montserrat_600SemiBold', color: '#f8fafc', letterSpacing: -0.5 },
    subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#64748b', marginTop: 4 },
    clearText: { color: '#6366f1', fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 4 },

    inputWrapper: { marginBottom: 32 },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#334155',
        marginBottom: 12
    },
    textInput: { flex: 1, paddingHorizontal: 16, color: '#f8fafc', fontSize: 16, fontFamily: 'Inter_400Regular' },
    addButton: { backgroundColor: '#6366f1', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
    buttonText: { color: 'white', fontFamily: 'Inter_700Bold', fontSize: 14 },

    prioritySelector: { flexDirection: 'row', justifyContent: 'space-between' },
    priorityOption: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#334155',
        alignItems: 'center',
        backgroundColor: '#0f172a'
    },
    priorityOptionText: { color: '#94a3b8', fontFamily: 'Inter_700Bold', fontSize: 12 },

    goalsContainer: { flex: 1 },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#1e293b',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155'
    },
    goalItemCompleted: { opacity: 0.5, backgroundColor: '#0f172a' },
    priorityBadge: { width: 4, height: 40, borderRadius: 2, marginRight: 16 },
    goalTextContainer: { flex: 1 },
    goalText: { color: '#e2e8f0', fontSize: 16, fontFamily: 'Inter_400Regular' },
    goalTextCompleted: { textDecorationLine: 'line-through', color: '#64748b' },
    priorityLabel: { fontSize: 10, color: '#64748b', fontFamily: 'Inter_700Bold', marginTop: 2, textTransform: 'uppercase' },
    itemActions: { flexDirection: 'row', alignItems: 'center' },
    editIcon: { fontSize: 18, marginRight: 8 },
    checkIcon: { color: '#10b981', fontSize: 18 },
    emptyText: { color: '#475569', fontSize: 16, textAlign: 'center', marginTop: 80 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
    modalContent: { backgroundColor: '#1e293b', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#334155' },
    modalTitle: { color: 'white', fontSize: 20, fontFamily: 'Montserrat_600SemiBold', marginBottom: 16 },
    modalInput: { backgroundColor: '#0f172a', color: 'white', padding: 16, borderRadius: 12, marginBottom: 24, fontSize: 16 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    cancelButton: { padding: 12, marginRight: 8 },
    cancelButtonText: { color: '#64748b', fontFamily: 'Inter_700Bold' },
    saveButton: { backgroundColor: '#6366f1', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
    saveButtonText: { color: 'white', fontFamily: 'Inter_700Bold' }
});
