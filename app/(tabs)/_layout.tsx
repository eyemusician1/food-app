import { Redirect, Slot } from 'expo-router';

export default function _layout() {
    const isAuthenticated = false; // Replace with actual authentication logic

    if(!isAuthenticated) return <Redirect href="/sign-in" />
  return <Slot />
}