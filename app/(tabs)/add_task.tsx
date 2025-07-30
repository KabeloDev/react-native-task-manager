import { database, DATABASE_ID, TASKS_COLLECTION_ID } from '@/app_context/appwrite';
import { useAuth } from '@/app_context/auth_context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ID } from 'react-native-appwrite';
import { Button, SegmentedButtons, TextInput, useTheme } from 'react-native-paper';

const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly"];
type Frequency = (typeof FREQUENCY_OPTIONS)[number];

export default function AddTaskScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("Daily");
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const { user } = useAuth();

    const handleSubmit = async () => {
        if (!user) return;

        try {
            await database.createDocument(
                DATABASE_ID,
                TASKS_COLLECTION_ID,
                ID.unique(),
                {
                    user_id: user.$id,
                    title: title,
                    description: description,
                    frequency: frequency,
                    isComplete: false,
                }
            );
            router.replace('/');
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to add task");
        }
    }

    return (
        <View style={styles.body}>
            <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo}
            />
            <View style={styles.taskForm}>
                <View style={styles.addView}>
                    <TextInput label="Title" mode="outlined" onChangeText={setTitle} style={styles.formMargin} />
                    <TextInput label="Description" mode="outlined" multiline numberOfLines={4} style={styles.formMargin} onChangeText={setDescription} />
                    <SegmentedButtons style={styles.formMargin}
                        value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}
                        buttons={FREQUENCY_OPTIONS.map((item) => ({
                            value: item,
                            label: item.charAt(0).toUpperCase() + item.slice(1),
                            style: { backgroundColor: frequency === item ? '#74b1c2ff' : 'transparent' }
                        }))} />

                    <Button mode="contained" disabled={!title || !description} onPress={handleSubmit} style={styles.addButton}>
                        Add Task
                    </Button>

                    {error && <Text style={{ color: theme.colors.error, marginTop: 10 }}>{error}</Text>}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    taskForm: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 10
    },
    formMargin: {
        marginBottom: 20
    },
    addButton: {
        marginTop: 20,
        backgroundColor: '#74b1c2ff'
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    addView: {
        flex: 1,
        padding: 30,
        backgroundColor: "#fff",
        elevation: 1,
        borderRadius: 8,
        margin: 16,
        height: '10%',
        marginVertical: 250
    },
});
