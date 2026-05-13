import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  InfoIcon,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  UserPlus,
  UserRoundX,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Index() {
  const [showChoice, setShowChoice] = useState(false);

  // MOCK STATES
  const [userAuthenticated] = useState(false);
  const [isMerchant] = useState(false);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const FluidChoiceModal = () => {
    const scale = useRef(new Animated.Value(0.92)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 90,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <View style={styles.overlay}>
        {/* BACKDROP */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setShowChoice(false)}
        />

        {/* MODAL */}
        <Animated.View
          style={[
            styles.modalCard,
            {
              opacity,
              transform: [{ scale }, { translateY }],
            },
          ]}
        >
          {/* CLOSE */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.closeButton}
            onPress={() => setShowChoice(false)}
          >
            <X size={18} color="#A1A1AA" />
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.modalHeader}>
            <View style={styles.modalIcon} />


            <Text style={styles.modalTitle}>
              {!userAuthenticated
                ? "Continue your experience"
                :
                isMerchant
                  ? "Choose your workspace"
                  :
                  "Welcome back !"

              }
            </Text>

            <Text style={styles.modalSubtitle}>
              {!userAuthenticated
                ? "Explore products instantly or unlock personalized AI shopping."
                : isMerchant
                  ? "Switch between your Normal and merchant Accounts with a single click."
                  : "Ready to continue discovering products ?  "
              }

            </Text>
          </View>

          {/* ACTIONS */}
          <View style={styles.modalActions}>
            {!userAuthenticated ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.push("/Common/home")}
                  style={styles.primaryChoice}
                >
                  <View style={styles.choiceLeft}>
                    <UserRoundX size={18} color="#000" />
                    <Text style={styles.primaryChoiceText}>
                      Continue as Guest
                    </Text>
                  </View>

                  <ArrowRight size={18} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.push("/Forms/login")}
                  style={styles.secondaryChoice}
                >
                  <View style={styles.choiceLeft}>
                    <ShieldCheck size={18} color="#FFF" />
                    <Text style={styles.secondaryChoiceText}>
                      Login to Account
                    </Text>
                  </View>

                  <ArrowRight size={16} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.push("/Forms/register")}
                  style={styles.secondaryChoice}
                >
                  <View style={styles.choiceLeft}>
                    <UserPlus size={18} color="#FFF" />
                    <Text style={styles.secondaryChoiceText}>
                      Create New Account
                    </Text>
                  </View>

                  <ArrowRight size={16} color="#FFF" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => router.replace("/Common/home")}
                  style={styles.primaryChoice}
                >
                  <View style={styles.choiceLeft}>
                    <User size={18} color="#000" />
                    <Text style={styles.primaryChoiceText}>
                      Customer Dashboard
                    </Text>
                  </View>

                  <ArrowRight size={18} color="#000" />
                </TouchableOpacity>

                {isMerchant && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push("/Common/profile")}
                    style={styles.secondaryChoice}
                  >
                    <View style={styles.choiceLeft}>
                      <Store size={18} color="#FFF" />
                      <Text style={styles.secondaryChoiceText}>
                        Merchant Workspace
                      </Text>
                    </View>

                    <ArrowRight size={16} color="#FFF" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent />

      <ImageBackground
        source={require("../assets/images/bg1.png")}
        style={styles.container}
        resizeMode="cover"
      >
        {/* DARK DEPTH OVERLAY */}
        <LinearGradient
          colors={["#0508168a", "#05080eef", "#0508168a", "#111827"]}

          style={styles.overlayGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* TOP */}
            <Animated.View
              style={{
                opacity: heroOpacity,
                transform: [{ translateY: heroTranslate }],
              }}
            >
            

              {/* FLOATING CHIPS */}
              <View style={styles.chipsWrapper}>

                <TouchableOpacity style={[styles.chip, styles.chipPrimary]} onPress={()=>{
                  router.push("/Common/Docs/Inteligence")
                }}>
                  <Sparkles size={14} color="#FFD86B" />
                  <Text style={styles.chipPrimaryText}>Inteligent</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.chip} onPress={()=>{
                  router.push("/Common/Docs/Security")
                }}>
                  <ShieldCheck size={14} color="#C4B5FD" />
                  <Text style={styles.chipText}>Secure</Text>
                </TouchableOpacity>

              

                <TouchableOpacity style={[styles.chip, styles.chipAccent]} onPress={()=>{
                  router.push("/Common/Docs/Personalization")
                }}>
                  <User size={14} color="#7DD3FC" />
                  <Text style={styles.chipAccentText}>Personalized</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.chip, styles.chipAccent]}
                 onPress={()=>{
                  router.push("/Common/Docs/About")
                 }}
                >
                  <InfoIcon size={14} color="#7DD3FC" />
                </TouchableOpacity>

              </View>


              {/* HERO */}
              <View style={styles.heroSection}>
                <Text style={styles.title}>
                  Discover Products and Shop {"\n"}
                  <Text style={styles.highlight}>Intelligently</Text>
                </Text>


              </View>
            </Animated.View>

            {/* CTA */}
            <Animated.View
              style={{
                opacity: heroOpacity,
                transform: [{ translateY: heroTranslate }],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.primaryButton}
                onPress={() => setShowChoice(true)}
              >
                <LinearGradient
                  colors={["#c69f12", "#0508168a", "#070e2ed5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    Start Exploring
                  </Text>

                  <View style={styles.arrowContainer}>
                    <ArrowRight size={18} color="#000" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

            </Animated.View>
          </SafeAreaView>

          {/* MODAL */}
          {showChoice && <FluidChoiceModal />}
        </LinearGradient>
      </ImageBackground>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },

  overlayGradient: {
    flex: 1,
    backgroundColor: "rgba(10,10,10,0.72)",
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: "space-between",
  },

  



  chipsWrapper: {
  marginTop: 34,
  

  flexDirection: "row",
  flexWrap: "nowrap",

  justifyContent: "center",
  alignItems: "center",

  gap: 12,

  paddingHorizontal: 40,
},

chip: {
  flexDirection: "row",
  alignItems: "center",

  gap: 8,

  paddingHorizontal: 12,
  paddingVertical: 12,

  borderRadius: 999,

  backgroundColor: "rgba(255,255,255,0.06)",

  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.18,
  shadowRadius: 10,

  elevation: 5,
},

chipPrimary: {
  backgroundColor: "rgba(198,159,18,0.14)",
  borderColor: "rgba(198,159,18,0.35)",
},

chipAccent: {
  backgroundColor: "rgba(125,211,252,0.10)",
  borderColor: "rgba(125,211,252,0.22)",
},

chipText: {
  color: "#E4E4E7",

  fontSize: 9,
  fontWeight: "600",

  letterSpacing: 0.2,
},

chipPrimaryText: {
  color: "#FFD86B",

  fontSize: 9,
  fontWeight: "700",

  letterSpacing: 0.2,
},

chipAccentText: {
  color: "#BAE6FD",

  fontSize: 9,
  fontWeight: "700",

  letterSpacing: 0.2,
},





  heroSection: {
    marginTop: 200,
    alignItems: "center",
  },

  title: {
    color: "#FAFAFA",

    fontSize: width > 400 ? 48 : 40,

    fontWeight: "700",

    lineHeight: width > 400 ? 56 : 48,

    letterSpacing: -2,

    textAlign: "center",
  },

  highlight: {
    color: "#A1A1AA",
  },

  description: {
    marginTop: 24,

    color: "#A1A1AA",

    fontSize: 16,

    lineHeight: 28,

    textAlign: "center",

    maxWidth: "92%",
  },

  primaryButton: {
    borderRadius: 999,
    overflow: "hidden",
  },

  primaryGradient: {
    height: 58,

    borderRadius: 999,

    paddingHorizontal: 22,

    backgroundColor: "#FAFAFA",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,
  },

  primaryButtonText: {
    color: "#090909",

    fontSize: 15,

    fontWeight: "700",
  },

  arrowContainer: {
    width: 28,
    height: 28,

    borderRadius: 999,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#E4E4E7",
  },

  bottomText: {
    marginTop: 18,

    textAlign: "center",

    color: "#71717A",

    fontSize: 12,

    lineHeight: 18,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 20,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0,0,0,0.68)",
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,

    backgroundColor: "#111111",

    borderRadius: 28,

    padding: 22,

    borderWidth: 1,
    borderColor: "#232323",
  },

  closeButton: {
    position: "absolute",

    top: 16,
    right: 16,

    width: 34,
    height: 34,

    borderRadius: 999,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#181818",

    zIndex: 20,
  },

  modalHeader: {
    alignItems: "center",

    marginTop: 8,
  },

  modalIcon: {
    width: 52,
    height: 52,

    borderRadius: 999,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#1A1A1A",

    marginBottom: 18,
  },

  modalTitle: {
    color: "#FAFAFA",

    fontSize: 22,

    fontWeight: "700",

    textAlign: "center",
  },

  modalSubtitle: {
    marginTop: 10,

    color: "#A1A1AA",

    fontSize: 14,

    lineHeight: 24,

    textAlign: "center",

    maxWidth: "92%",
  },

  modalActions: {
    marginTop: 28,

    gap: 12,
  },

  choiceLeft: {
    flexDirection: "row",
    alignItems: "center",

    gap: 12,
  },

  primaryChoice: {
    height: 58,

    backgroundColor: "#FAFAFA",

    borderRadius: 18,

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  primaryChoiceText: {
    color: "#090909",

    fontSize: 15,

    fontWeight: "700",
  },

  secondaryChoice: {
    height: 58,

    backgroundColor: "#181818",

    borderRadius: 18,

    paddingHorizontal: 18,

    borderWidth: 1,
    borderColor: "#2A2A2A",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  secondaryChoiceText: {
    color: "#c69f12",

    fontSize: 15,

    fontWeight: "600",
  },
});