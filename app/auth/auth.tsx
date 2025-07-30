import { useAuth } from "@/app_context/auth_context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signUp, signIn } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
  }

  const handleAuth = async () => {

    if (isSignUp && !name) {
      setError("Please enter your username.");
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");

    try {
      if (isSignUp) {
        const error = await signUp(name, email, password);
        if (error) {
          setError("Sign Up failed. Please try again.");
          return;
        }
        router.replace("/");
      } else {
        const error = await signIn(email, password);
        if (error) {
          setError("Sign In failed. Please check your credentials.");
          return;
        }
        router.replace("/");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error(err);
    }
  };

  return <KeyboardAvoidingView behavior={Platform.OS === "android" ? "height" : "padding"} style={{ flex: 1 }}>
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }} >
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.reactLogo}
      />
      <View style={styles.loginForm}>
        <Text style={styles.headerText}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>

        {isSignUp ?
          <>
            <TextInput
              label="Username"
              placeholder="your username"
              autoCapitalize="none"
              keyboardType="default"
              mode="outlined"
              style={styles.userNameInput}
              onChangeText={setName} />

            <TextInput
              label="Email"
              placeholder="example@gmail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              style={styles.emailInput}
              onChangeText={setEmail} />

            <TextInput
              label="Password"
              placeholder="your password"
              autoCapitalize="none"
              secureTextEntry={true}
              keyboardType="default"
              mode="outlined"
              style={styles.passwordInput}
              onChangeText={setPassword} />
          </>
          :
          <>
            <TextInput
              label="Email"
              placeholder="example@gmail.com"
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              style={styles.emailInput}
              onChangeText={setEmail} />

            <TextInput
              label="Password"
              placeholder="your password"
              autoCapitalize="none"
              secureTextEntry={true}
              keyboardType="default"
              mode="outlined"
              style={styles.passwordInput}
              onChangeText={setPassword} />
          </>
        }
        {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>{isSignUp ? "Sign Up" : "Sign In"}</Button>
        <Button mode="text" onPress={toggleAuthMode}>{isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</Button>
      </View>
    </View>
  </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userNameInput: {
    marginBottom: 10,
  },
  emailInput: {
    marginBottom: 10,
  },
  passwordInput: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#74b1c2ff",
  },
  reactLogo: {
    height: 250,
    width: 400,
    bottom: -25,
    left: 0,
    position: 'absolute',
  },
  loginForm: {
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