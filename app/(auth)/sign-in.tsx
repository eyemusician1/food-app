import { router } from 'expo-router'
import { Button, Text, View } from 'react-native'

const signIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Button title='Sign Up' onPress={() => router.push("/sign-up")} />
    </View>
  )
}

export default signIn