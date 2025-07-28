import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { signOut } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileField = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
    <View className="profile-field">
        <View className="profile-field__icon">
            <Image source={icon} className="size-6" resizeMode="contain" tintColor="#FE8C00" />
        </View>
        <View className="flex-1">
            <Text className="body-medium text-gray-200 mb-1">{label}</Text>
            <Text className="paragraph-bold text-dark-100">{value}</Text>
        </View>
    </View>
);

const MenuOption = ({ icon, title, onPress, showArrow = true }: { 
    icon: any; 
    title: string; 
    onPress: () => void;
    showArrow?: boolean;
}) => (
    <TouchableOpacity 
        className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 shadow-sm shadow-black/5"
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View className="flex-row items-center">
            <View className="size-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Image source={icon} className="size-5" resizeMode="contain" tintColor="#FE8C00" />
            </View>
            <Text className="paragraph-semibold text-dark-100">{title}</Text>
        </View>
        {showArrow && (
            <Image source={images.arrowRight} className="size-4" resizeMode="contain" tintColor="#878787" />
        )}
    </TouchableOpacity>
);

const Profile = () => {
    const { user, setIsAuthenticated, setUser } = useAuthStore();

    const handleSignOut = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut();
                            setIsAuthenticated(false);
                            setUser(null);
                            router.replace('/sign-in');
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 justify-center items-center px-5">
                    <Text className="h3-bold text-dark-100 mb-4">No User Data</Text>
                    <CustomButton title="Sign In" onPress={() => router.replace('/sign-in')} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView 
                className="flex-1" 
                contentContainerClassName="pb-32"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="bg-white px-5 pt-5 pb-8 rounded-b-3xl shadow-sm shadow-black/5">
                    <Text className="h3-bold text-dark-100 text-center mb-8">My Profile</Text>
                    
                    {/* Profile Avatar */}
                    <View className="items-center mb-6">
                        <View className="profile-avatar">
                            <Image 
                                source={{ uri: user.avatar }} 
                                className="size-full rounded-full"
                                resizeMode="cover"
                            />
                            <TouchableOpacity className="profile-edit">
                                <Image 
                                    source={images.pencil} 
                                    className="size-3" 
                                    resizeMode="contain" 
                                    tintColor="white"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text className="h3-bold text-dark-100 mt-4 mb-1">{user.name}</Text>
                        <Text className="body-regular text-gray-200">{user.email}</Text>
                    </View>
                </View>

                {/* Profile Information */}
                <View className="px-5 mt-6">
                    <Text className="base-bold text-dark-100 mb-4">Personal Information</Text>
                    <View className="bg-white rounded-2xl p-5 shadow-sm shadow-black/5 mb-6">
                        <ProfileField 
                            icon={images.user}
                            label="Full Name"
                            value={user.name}
                        />
                        <ProfileField 
                            icon={images.envelope}
                            label="Email Address"
                            value={user.email}
                        />
                        <ProfileField 
                            icon={images.phone}
                            label="Phone Number"
                            value="+1 (555) 123-4567"
                        />
                        <View className="profile-field border-b-0">
                            <View className="profile-field__icon">
                                <Image source={images.location} className="size-6" resizeMode="contain" tintColor="#FE8C00" />
                            </View>
                            <View className="flex-1">
                                <Text className="body-medium text-gray-200 mb-1">Address</Text>
                                <Text className="paragraph-bold text-dark-100">MSU Marawi, Lanao del Sur</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu Options */}
                    <Text className="base-bold text-dark-100 mb-4">Settings</Text>
                    
                    <MenuOption 
                        icon={images.bag}
                        title="Order History"
                        onPress={() => Alert.alert('Coming Soon', 'Order history feature will be available soon!')}
                    />
                    
                    <MenuOption 
                        icon={images.location}
                        title="Delivery Address"
                        onPress={() => Alert.alert('Coming Soon', 'Address management feature will be available soon!')}
                    />
                    
                    <MenuOption 
                        icon={images.dollar}
                        title="Payment Methods"
                        onPress={() => Alert.alert('Coming Soon', 'Payment methods feature will be available soon!')}
                    />
                    
                    <MenuOption 
                        icon={images.star}
                        title="Rate the App"
                        onPress={() => Alert.alert('Thank You!', 'Thanks for considering rating our app!')}
                    />
                    
                    <MenuOption 
                        icon={images.logout}
                        title="Sign Out"
                        onPress={handleSignOut}
                        showArrow={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;