import { database, DATABASE_ID, TASKS_COLLECTION_ID } from '@/app_context/appwrite';
import { useAuth } from '@/app_context/auth_context';
import { Task } from '@/type/databases.type';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Badge, Text } from 'react-native-paper';


export default function DashboardScreen() {

    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>();

    console.log("User in DashboardScreen:", user);

    const completeCount = tasks?.filter(task => task.isComplete === true).length;
    const inCompleteCount = tasks?.filter(task => task.isComplete === false).length;
    const completePercentage = completeCount! / tasks?.length! * 100;
    const inCompletePercentage = inCompleteCount! / tasks?.length! * 100;
    const pieData = [{ value: completeCount!, color: "green", text: `${completePercentage.toFixed(1)}%`, showText: true }, { value: inCompleteCount!, color: "darkorange", text:  `${inCompletePercentage.toFixed(1)}%`, showText: true }];
    const barData = [{ value: completeCount, frontColor: "green" }, { value: inCompleteCount, frontColor: "darkorange" }];
    const noValues = pieData.every(item => item.value === 0);

    console.log('Completed tasks: ', completeCount);
    console.log('Incomplete tasks: ', inCompleteCount);

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
        <View style={styles.body}>
            {noValues ? (
                <Text variant="bodyMedium">No data available</Text>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <View style={{marginBottom:15}}>
                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                            <Text variant="bodyMedium">Complete</Text>
                            <Badge style={{ backgroundColor: "green", marginBottom: 10, marginLeft: 10 }}></Badge>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text variant="bodyMedium">Incomplete</Text>
                            <Badge style={{ backgroundColor: "darkorange", marginBottom: 10, marginLeft: 10 }}></Badge>
                        </View>
                    </View>
                    <PieChart data={pieData} textColor="white" textSize={12} radius={150} showText />
                    <BarChart data={barData} horizontal />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
