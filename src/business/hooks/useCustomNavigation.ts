import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuctionStackParamList = {
  Home: undefined;
  AuctionDetails: { auctionId: string };
  Profile: { userId?: string };
  Bidding: { auctionId: string };
  Wishlist: undefined;
  Notifications: undefined;
  Settings: undefined;
  Login: undefined;
  Register: undefined;
};

type NavigationProp = StackNavigationProp<AuctionStackParamList>;

export const useCustomNavigation = () => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToAuction = (auctionId: string) => {
    navigation.navigate('AuctionDetails', { auctionId });
  };

  const navigateToProfile = (userId?: string) => {
    navigation.navigate('Profile', { userId });
  };

  const navigateToBidding = (auctionId: string) => {
    navigation.navigate('Bidding', { auctionId });
  };

  const navigateToWishlist = () => {
    navigation.navigate('Wishlist');
  };

  const navigateToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToAuth = (screen: 'Login' | 'Register') => {
    navigation.navigate(screen);
  };

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const resetToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return {
    navigation,
    navigateToAuction,
    navigateToProfile,
    navigateToBidding,
    navigateToWishlist,
    navigateToNotifications,
    navigateToSettings,
    navigateToAuth,
    goBack,
    resetToHome,
  };
};