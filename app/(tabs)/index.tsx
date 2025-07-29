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
  const [titleUpdate, setTitleUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [isComplete, setIsComplete] = useState(false);
  const [id, setId] = useState("");

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

  const openModal = async (status: boolean, taskId: string, title: string, description: string) => {
    console.log('Modal status: ' + status + ' Task Id: ' + taskId);
    setIsModalVisible(status);
    setTitle(title);
    setTitleUpdate(title);
    setDescription(description);
    setDescriptionUpdate(description);
    setId(taskId);
  }

  const handleUpdateTask = async (taskId: string) => {
    console.log("Task to be updated:", taskId);
    setIsModalVisible(false);
    try {
      const task = tasks?.find(t => t.$id === taskId);
      console.log('Task Id: ', task?.$id)
      console.log('Task completion status: ', task?.isComplete);
      if (!task) return;


      await database.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId,
      {
          user_id: user?.$id,
          title: title || task.title,
          description: description || task.description,
          frequency: frequency || task.frequency,
          isComplete: isComplete
      });
      console.log('task data:', task);
      console.log('isComplete: ' + isComplete + ', for task ID: ' + taskId);
      console.log("Task updated:", taskId);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await database.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId);
      console.log("Task deleted:", taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
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
              <View style={styles.isCompleteView}>
                <Text style={styles.isCompleteText}>{task.isComplete ? "Complete" : "Incomplete"}</Text>
                <Badge style={{ backgroundColor: task.isComplete ? "green":  "darkorange"}}></Badge>
              </View>
              <Divider style={styles.divider}></Divider>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                <IconButton size={20} icon="delete-outline" onPress={() => handleDeleteTask(task.$id)}></IconButton>
                <IconButton size={20} icon="square-edit-outline" onPress={() => openModal(true, task.$id, task.title, task.description)}></IconButton>
              </View>
              <Portal>
                <Modal
                  visible={isModalVisible}
                  contentContainerStyle={{ backgroundColor: "white", padding: 20, margin: 20, borderRadius: 8, minHeight: 500 }}
                  dismissable={true}
                  onDismiss={() => setIsModalVisible(false)}
                >
                  <View style={styles.editview} >
                    <ScrollView>
                      <Text variant="titleLarge">Update Task</Text>
                      <TextInput defaultValue={titleUpdate} label="Title" mode="outlined" onChangeText={setTitle} />
                      <TextInput defaultValue={descriptionUpdate} label="Description" mode="outlined" multiline numberOfLines={4} style={{ marginBottom: 10 }} onChangeText={setDescription} />
                      <SegmentedButtons 
                        value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}
                        buttons={FREQUENCY_OPTIONS.map((item) => ({
                          value: item,
                          label: item.charAt(0).toUpperCase() + item.slice(1),
                          style:{ marginBottom: 20, backgroundColor: frequency === item ? '#74b1c2ff' : 'transparent' }
                        }))} />
                      <Button mode="contained-tonal" onPress={() => setIsComplete(!isComplete)} style={{ marginBottom: 20, backgroundColor: theme.colors.background }}>
                        {isComplete ? "Mark as Complete" : "Mark as Incomplete"}
                      </Button>
                      <Button mode="contained" style={{backgroundColor: '#74b1c2ff'}} disabled={!title || !description} onPress={() => handleUpdateTask(id)}>Save</Button>
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

  },
  isCompleteView: {
    flex:1, 
    flexDirection:"row", 
    justifyContent:"flex-end"
  },
  isCompleteText: {
    marginRight:10
  }
});
