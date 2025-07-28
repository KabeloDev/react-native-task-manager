import { useAuth } from '@/app_context/auth_context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';


export default function SignOutScreen() {
    const { signOut, user } = useAuth();

    return (
        <View style={styles.body}>
            <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo}
            />
            <Text style={styles.titleContainer}>Are you sure you want to sign out?</Text>
            <View style={styles.signOutButton}>
                <Button onPress={async () => {
                    await signOut();
                    router.replace("/auth/auth");
                }}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Button>
            </View>
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
    signOutButton: {
        backgroundColor: "#74b1c2ff",
        padding: 5,
        borderRadius: 15,
        marginTop: 20,
        width: '50%',
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signOutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});
