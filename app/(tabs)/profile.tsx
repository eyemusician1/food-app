import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { images } from "@/constants";
import { signOut, updateUser } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileField = ({ icon, label, value, onEdit }: { 
    icon: any; 
    label: string; 
    value: string;
    onEdit?: () => void;
}) => (
    <TouchableOpacity className="profile-field" onPress={onEdit} activeOpacity={onEdit ? 0.7 : 1}>
        <View className="profile-field__icon">
            <Image source={icon} className="size-6" resizeMode="contain" tintColor="#FE8C00" />
        </View>
        <View className="flex-1">
            <Text className="body-medium text-gray-200 mb-1">{label}</Text>
            <Text className="paragraph-bold text-dark-100">{value}</Text>
        </View>
        {onEdit && (
            <Image source={images.pencil} className="size-4" resizeMode="contain" tintColor="#878787" />
        )}
    </TouchableOpacity>
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

const EditProfileModal = ({ 
    visible, 
    onClose, 
    user, 
    onSave 
}: { 
    visible: boolean; 
    onClose: () => void; 
    user: any;
    onSave: (data: { name: string; email: string }) => void;
}) => {
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!form.name.trim() || !form.email.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await onSave(form);
            onClose();
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 px-5">
                    {/* Header */}
                    <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
                        <TouchableOpacity onPress={onClose}>
                            <Text className="paragraph-semibold text-gray-200">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="base-bold text-dark-100">Edit Profile</Text>
                        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                            <Text className="paragraph-semibold text-primary">Save</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View className="flex-1 pt-8">
                        <View className="mb-6">
                            <CustomInput
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                            />
                        </View>

                        <View className="mb-6">
                            <CustomInput
                                label="Email Address"
                                placeholder="Enter your email"
                                value={form.email}
                                onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
                                keyboardType="email-address"
                            />
                        </View>

                        <CustomButton
                            title="Save Changes"
                            onPress={handleSave}
                            isLoading={isLoading}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const Profile = () => {
    const { user, setIsAuthenticated, setUser } = useAuthStore();
    const [editModalVisible, setEditModalVisible] = useState(false);

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

    const handleEditProfile = () => {
        setEditModalVisible(true);
    };

    const handleSaveProfile = async (data: { name: string; email: string }) => {
        if (!user) return;

        try {
            const updatedUser = await updateUser(user.$id, data);
            setUser(updatedUser);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
            throw error; // Re-throw to handle loading state in modal
        }
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
                            <TouchableOpacity className="profile-edit" onPress={handleEditProfile}>
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
                            onEdit={handleEditProfile}
                        />
                        <ProfileField 
                            icon={images.envelope}
                            label="Email Address"
                            value={user.email}
                            onEdit={handleEditProfile}
                        />
                        <ProfileField 
                            icon={images.phone}
                            label="Phone Number"
                            value="+1 (555) 123-4567"
                            onEdit={() => Alert.alert('Coming Soon', 'Phone number editing will be available soon!')}
                        />
                        <View className="profile-field border-b-0">
                            <View className="profile-field__icon">
                                <Image source={images.location} className="size-6" resizeMode="contain" tintColor="#FE8C00" />
                            </View>
                            <View className="flex-1">
                                <Text className="body-medium text-gray-200 mb-1">Address</Text>
                                <Text className="paragraph-bold text-dark-100">MSU Marawi, Lanao del Sur</Text>
                            </View>
                            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Address editing will be available soon!')}>
                                <Image source={images.pencil} className="size-4" resizeMode="contain" tintColor="#878787" />
                            </TouchableOpacity>
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

            {/* Edit Profile Modal */}
            <EditProfileModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                user={user}
                onSave={handleSaveProfile}
            />
        </SafeAreaView>
    );
};

export default Profile;