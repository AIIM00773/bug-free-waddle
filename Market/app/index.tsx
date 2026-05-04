import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bell, LayoutGrid, Search } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

/* Components & Providers */
import MenuModal from "@/Components/AppMenu";
import BottomNav from "@/Components/Footer";
import { useAuth } from "@/Providers/AuthProvider";
import PromptInputBox from "@/SubScreens/PromptInput";
import DropAILandingGate from "@/SubScreens/UnauthorizedState";

/* Styles & Constants */
import { COLORS } from '@/constants';
import { styles } from "@/Styles/IndexPageStyles";

export default function InitScreen() {
  const { user, loading, isAuthenticated } = useAuth();
  
  // State Management
  const [isSearching, setIsSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Only run animations if the user is authenticated and not loading
    if (!loading && (user || isAuthenticated)) {
      const animationGroup = Animated.parallel([
        Animated.timing(fadeAnim, { 
          toValue: 1, 
          duration: 1000, 
          useNativeDriver: true 
        }),
        Animated.timing(slideUpAnim, { 
          toValue: 0, 
          duration: 800, 
          useNativeDriver: true 
        }),
      ]);

      animationGroup.start();

      // CLEANUP: Prevents memory leaks if component unmounts mid-animation
      return () => animationGroup.stop();
    }
  }, [loading, isAuthenticated]);

  // Memoized Handlers (Prevents child re-renders)
  const toggleSearch = useCallback((val: boolean) => setIsSearching(val), []);
  const toggleMenu = useCallback((val: boolean) => setShowMenu(val), []);
  const handleInboxNavigation = useCallback(() => router.push("/General/Inbox"), []);
  const handleSearchNavigation = useCallback(() => router.push("/General/SearchAndResponse"), []);

  // 1. Auth Guard (Early Return)
  if (loading || (!user && !isAuthenticated)) {
    return <DropAILandingGate isLoading={loading} />;
  }

  return (
    <View style={styles.container}>
      {/* Ensure Status bar is consistent across iOS/Android */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#033e3b', '#06622c', '#395889']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.flex1}
      >
        <ImageBackground 
          source={{ uri: 'https://t4.ftcdn.net/jpg/04/78/90/97/240_F_478909787_uEm9AvyBOi4pvrZdCosojg1ZSX2QA980.jpg' }}
          style={StyleSheet.absoluteFill}
          imageStyle={{ 
            opacity: 0.2, 
            resizeMode: 'cover' 
          }}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* HEADER */}
            <Animated.View 
              style={[
                styles.header, 
                { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }
              ]}
            >
              <View style={styles.brand}>
                <View style={styles.versionBadge}>
                  <Text style={styles.versionText}>Drop v0.6</Text>
                </View>
              </View>
              
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.glassIcon} 
                  onPress={handleInboxNavigation}
                >
                  <Bell size={20} color={COLORS.light} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  style={styles.glassIcon} 
                  onPress={() => toggleMenu(true)}
                >
                  <LayoutGrid size={20} color={COLORS.light} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* HERO */}
            <View style={styles.heroContent}>
              <Animated.View 
                style={[
                  styles.titleWrapper, 
                  { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }
                ]}
              >
                <Text style={styles.subtitle}>Shop smarter. Faster. Better.</Text>
                <Text style={styles.subtext}>Fast Efficient and Stress-less Discovery</Text>
              </Animated.View>

              <Animated.View 
                style={[
                  { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }], marginTop: 20 }
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.floatingSearchBtn}
                  onPress={() => toggleSearch(true)}
                >
                  <Search color={"white"} size={16} />
                  <Text style={styles.floatingBtnText}>Find any product...</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>

      {/* FOOTER & MODALS */}
      <BottomNav 
        activeTab="Find" 
        onSearchClick={() => toggleSearch(true)} 
      />

      {showMenu && (
        <MenuModal 
          visible={showMenu} 
          onClose={() => toggleMenu(false)} 
        />
      )}

      <PromptInputBox
        visible={isSearching}
        onClose={() => toggleSearch(false)}
        placeholder="What can I find for you today?"
        switchPage={handleSearchNavigation}
      />
    </View>
  );
}