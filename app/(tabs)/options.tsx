import { account } from '@/app_context/appwrite';
import { useAuth } from '@/app_context/auth_context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';


export default function SignOutScreen() {
    const { signOut, user } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [username, setUserName] = useState('');
    
    

     const handleUpdateUsername = async () => {
        setIsModalVisible(false);
        try {
          if (!user) return;
    
          await account.updateName(username);
          user.name = username;
         
        } catch (error) {
          console.log(error);
        }
    }

    return (
        <View style={styles.body}>
            <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo}
            />
            <View style={styles.button}>
                <Button onPress={async () => {
                   
                }}>
                    <Text style={styles.signOutText}>Change Theme</Text>
                </Button>
            </View>
            <View style={styles.button}>
                <Button onPress={async () => {
                    setIsModalVisible(true);
                }}>
                    <Text style={styles.signOutText}>Update Username</Text>
                </Button>
            </View>
            <View style={styles.button}>
                <Button onPress={async () => {
                    await signOut();
                    router.replace("/auth/auth");
                }}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Button>
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
                      <Text style={{marginBottom: 25}} variant="titleLarge">Update Username</Text>
                      <TextInput style={{marginBottom: 50}} defaultValue={user?.name} label="Username" mode="outlined" onChangeText={setUserName} />                      
                      <Button mode="contained" style={{backgroundColor: '#74b1c2ff'}} disabled={!username} onPress={() => handleUpdateUsername()}>Save</Button>
                    </ScrollView>
                  </View>
                </Modal>
              </Portal>
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
    button: {
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
    editview: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
});
