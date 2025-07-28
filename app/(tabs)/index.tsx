import { database, DATABASE_ID, TASKS_COLLECTION_ID } from '@/app_context/appwrite';
import { useAuth } from '@/app_context/auth_context';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Task } from '@/type/databases.type';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { Badge, Button, Divider, IconButton, Modal, Portal, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [isComplete, setIsComplete] = useState(false);

  const theme = useTheme();


  const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly"];
  type Frequency = (typeof FREQUENCY_OPTIONS)[number];


  console.log("User in HomeScreen:", user);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        router.replace("/auth/auth");
      } else {
        fetchTasks();
      }
    }, [])
  );

  const fetchTasks = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      console.log("Tasks fetched:", response.documents);
      setTasks(response.documents as unknown as Task[]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }



  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hi, {user?.name}!</ThemedText>
      </ThemedView>
      <View>
        {tasks?.length === 0 ? (
          <Text variant="bodyMedium" style={{ padding: 50 }}>No tasks found. Start by creating one!</Text>
        ) : (tasks?.map((task) => (
          <View key={task.$id} style={{ backgroundColor: "#dfdfdfff", padding: 16, borderRadius: 8, marginBottom: 16 }}>

            <ScrollView showsVerticalScrollIndicator={false}>

              <Text variant="titleMedium">{task.title}</Text>
              <Text variant="bodyMedium">{task.description}</Text>
              <Text variant="bodySmall">{task.frequency}</Text>
              <Badge style={{ backgroundColor: isComplete ? "green":  "darkorange", fontWeight: "bold", fontSize: 15 }}></Badge>
              <Divider style={styles.divider}></Divider>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <IconButton size={20} icon="delete-outline"></IconButton>
                <IconButton size={20} icon="square-edit-outline"></IconButton>
              </View>
              <Portal>
                <Modal
                  visible={isModalVisible}
                  contentContainerStyle={{ backgroundColor: "white", padding: 20, margin: 20, borderRadius: 8, minHeight: 500 }}
                  dismissable={true}
                  onDismiss={() => setIsModalVisible(false)}
                >
                  <View style={styles.editview}>
                    <ScrollView>
                      <Text variant="titleLarge">Update Task</Text>
                      <TextInput label="Title" mode="outlined" onChangeText={setTitle} />
                      <TextInput label="Description" mode="outlined" multiline numberOfLines={4} style={{ marginBottom: 10 }} onChangeText={setDescription} />
                      <SegmentedButtons style={{ marginBottom: 20 }}
                        value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}
                        buttons={FREQUENCY_OPTIONS.map((frequency) => ({
                          value: frequency,
                          label: frequency.charAt(0).toUpperCase() + frequency.slice(1),
                        }))} />
                      <Button icon={isComplete ? "tray-remove" : "checkbox-marked-circle-outline"} mode="contained-tonal" onPress={() => setIsComplete(!isComplete)} style={{ marginBottom: 20, backgroundColor: theme.colors.background }}>
                        {isComplete ? "Mark as Incomplete" : "Mark as Complete"}
                      </Button>
                      <Button mode="contained">Save</Button>
                    </ScrollView>
                  </View>
                </Modal>
              </Portal>
            </ScrollView>

          </View>
        ))
        )}
      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  editview: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: "#ccc",
    height: 1,

  }
});
