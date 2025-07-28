import { Account, Client, Databases } from "react-native-appwrite";


export const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

export const account = new Account(client);

export const database = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID!;
export const TASKS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID!;