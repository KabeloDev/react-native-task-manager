import { Models } from 'react-native-appwrite';

export interface Task extends Models.Document {
    user_id: string;
    title: string;
    description: string;
    frequency: string; 
    isComplete: boolean;
}