
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AlertCircle, ChevronDown, Filter, Menu, Plus, Search, SlidersHorizontal, Sparkles, Wand2, } from 'lucide-react-native';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState, } from 'react';

import { ActivityIndicator, Animated, ImageBackground, LayoutAnimation, Platform, ScrollView, StatusBar, Text, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');


// Providers
import { useAuth } from '@/Providers/AuthProvider';
import { UseBasics } from '@/Providers/BasicsProvider';
import { useConversation } from '@/Providers/ConversationProvider';
import { usePrompt } from '@/Providers/MainProptsProvider';
import { useProducts } from '@/Providers/ProductProvider';


// Components
import SearchAndResponseMenuView from '@/Components/SearchAndResponseMenu';
import MerchantProfileView from '@/SubScreens/MerchantProfileScreen';
import ProductDetailsView from '@/SubScreens/ProductViewScreen';
import PromptInputBox from '@/SubScreens/PromptInput';


// Constants
import { COLORS } from '@/constants';
import styles from '@/Styles/DiscoveryPageStyles';


// Enable on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const customLayoutAnim = {
    duration: 300,
    update: { type: LayoutAnimation.Types.easeInEaseOut },
    create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
};

export default function SearchAndResponse() {

    // ------------------------------------------------------
    // PROVIDERS and CONTEXTS 
    // ------------------------------------------------------

    const { user, isAuthenticated } = useAuth();

    const { welcomeNote, fetchandSetuserWelcomePrompt } = UseBasics();

    const { currentConversation, performNewSearch, performFollowupSearch, closeConversation, } = useConversation();

    const { selectedProduct, setSelectedProductById, } = useProducts();

    const { activePrompt, clearPrompt, } = usePrompt();

    const PromptRegex = /^[a-zA-Z0-9\s\.,!\?\$\-'"]*$/



    // ------------------------------------------------------
    // LOCAL STATES
    // ------------------------------------------------------

    const [menuVisible, setMenuVisible] = useState(false);

    const [isSearching, setIsSearching] = useState(false);

    const [showInputBox, setShowInputBox] = useState(false);

    const [openMerchantProfile, setOpenMerchantProfile] = useState(false);



    // ------------------------------------------------------
    // ANIMATIONS
    // ------------------------------------------------------

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const slideAnim = useRef(new Animated.Value(18)).current;


    // ------------------------------------------------------
    // REFS
    // ------------------------------------------------------

    const scrollRef = useRef<ScrollView>(null);



    // ------------------------------------------------------
    // EFFECTS
    // ------------------------------------------------------

    useEffect(() => { if (!isAuthenticated) { router.replace('/AppForms/Signin'); return; } fetchandSetuserWelcomePrompt(); }, [isAuthenticated]);

    useEffect(() => {
        Animated.parallel([Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true, }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true, }),
        ]).start();

    }, []);

    useEffect(() => { if (!activePrompt) return; handleSearchExecution(activePrompt.text); clearPrompt(); }, [activePrompt]);



    // ------------------------------------------------------
    // MEMOS
    // ------------------------------------------------------

    const activeSearchTitle = useMemo(() => { return currentConversation?.title || 'discovery'; }, [currentConversation]);



    // ------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------

    const scrollToBottom = useCallback(() => {
        setTimeout(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, 150);
    }, []);


    const onNewSearchTopicSet = useCallback(() => {
        closeConversation();
        setShowInputBox(true);
        setIsSearching(false);
    }, []);



    // ------------------------------------------------------
    // SEARCH EXECUTION
    // ------------------------------------------------------

    const handleSearchExecution = useCallback(async (text: string) => {

        const cleaned = text?.trim();


        if (!cleaned || !PromptRegex.test(cleaned)) return;

        setShowInputBox(false);

        setIsSearching(true);

        try {

            if (!currentConversation) {

                await performNewSearch({
                    text: cleaned,
                    filters: []
                });

            } else {

                await performFollowupSearch(
                    {
                        text: cleaned,
                        filters: [],
                    },
                    currentConversation.conversationId,
                );
            }

        } catch (error) {

            console.log('Search Error:', error);

        } finally {

            setIsSearching(false);

            scrollToBottom();
        }

    }, [
        currentConversation,
        performFollowupSearch,
        performNewSearch,
    ]);









    // ------------------------------------------------------
    // RENDER
    // ------------------------------------------------------

    return (
        <View style={styles.container}>

            <StatusBar barStyle="light-content" />

            <LinearGradient colors={['#021B1A', '#053D2C', '#0B1F38']} style={styles.flex1} >

                {/* ------------------------------------------------ */}
                {/* HEADER */}
                {/* ------------------------------------------------ */}


                <SafeAreaView edges={['top']} style={styles.safeAreaHeader} >

                    <Animated.View
                        style={[
                            styles.headerContainer,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    {
                                        translateY: slideAnim,
                                    },
                                ],
                            },
                        ]}
                    >

                        <TouchableOpacity style={styles.headerIconBtn} onPress={() => setMenuVisible(true)} >
                            <Menu size={22} color={COLORS.light} />
                        </TouchableOpacity>


                        <View style={styles.headerTitleContainer}>
                            <Text numberOfLines={1} style={styles.headerTitleText} > {activeSearchTitle} </Text>
                        </View>


                        <TouchableOpacity style={styles.headerIconBtn} onPress={onNewSearchTopicSet} >
                            <Plus size={22} color={COLORS.accent} />
                        </TouchableOpacity>

                    </Animated.View>
                </SafeAreaView>



                {/* ------------------------------------------------ */}
                {/* MAIN SCROLL AREA */}
                {/* ------------------------------------------------ */}

                <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} onContentSizeChange={scrollToBottom}>

                    {
                        !currentConversation && !isSearching && (
                            <EmptyState fadeAnim={fadeAnim} slideAnim={slideAnim} welcomeNote={welcomeNote} onOpenSearch={() => { setShowInputBox(true); }} />
                        )
                    }


                    {
                        currentConversation && (

                            <View style={styles.chatContainer}>

                                {
                                    currentConversation.conversationHistory.map((item: any, index: number) => (
                                        <RenderHistoryItem
                                            key={item.id || index}
                                            item={item}
                                            isSearching={isSearching}
                                            isLast={index === currentConversation.conversationHistory.length - 1}
                                            conversationId={currentConversation.conversationId}
                                            onProductPress={setSelectedProductById}
                                        />
                                    ))
                                }

                            </View>
                        )
                    }



                    {
                        isSearching && (

                            <View style={styles.loadingContainer}>

                                <ActivityIndicator
                                    size="small"
                                    color={COLORS.accent}
                                />

                                <Text style={styles.loadingText}>
                                    Analysing ypur search  and curating results...
                                </Text>

                            </View>
                        )
                    }

                </ScrollView>




                {/* ------------------------------------------------ */}
                {/* FLOATING ACTION */}
                {/* ------------------------------------------------ */}

                {
                    currentConversation &&
                    !isSearching &&
                    !showInputBox && (

                        <Animated.View style={[styles.floatingActionContainer, { opacity: fadeAnim, },]}>

                            <TouchableOpacity style={styles.floatingSearchBtn} onPress={() => { setShowInputBox(true); }} >
                                <Sparkles size={18} color={COLORS.dark} />
                                <Text style={styles.floatingBtnText}> Refine Results </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )
                }

            </LinearGradient>




            {/* ------------------------------------------------ */}
            {/* MODALS */}
            {/* ------------------------------------------------ */}

            <PromptInputBox visible={showInputBox} onClose={() => setShowInputBox(false)} />

            {
                menuVisible && (
                    <SearchAndResponseMenuView visible={menuVisible} user={user} onClose={() => setMenuVisible(false)} onNewSearchTopicSet={onNewSearchTopicSet} />
                )
            }


            {
                selectedProduct && (
                    <ProductDetailsView onClose={() => setSelectedProductById(null)} onViewMerchant={() => setOpenMerchantProfile(true)} />
                )
            }


            {
                openMerchantProfile && (
                    <MerchantProfileView
                        onClose={() => setOpenMerchantProfile(false)}
                    />
                )
            }

        </View>
    );
}



// ==========================================================
// EMPTY STATE
// ==========================================================

const EmptyState = ({
    welcomeNote,
    onOpenSearch,
    fadeAnim,
    slideAnim,
}: any) => {

    return (
        <View style={styles.heroContent}>

            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                    alignItems: 'center',
                }}
            >

                <Text style={styles.heroSubtitle}>
                    {welcomeNote || 'Your AI commerce assistant'}
                </Text>

                <View style={styles.minimalDivider} />

                <Text style={[styles.heroSubtext, { display: "none" }]}> Search products naturally using conversational AI. </Text>

            </Animated.View>


            <TouchableOpacity
                style={[
                    styles.initialSearchBtn,
                    {
                        marginTop: 40,
                    },
                ]}
                onPress={onOpenSearch}
            >

                <Search
                    color={COLORS.dark}
                    size={18}
                />

                <Text style={styles.initialSearchBtnText}>
                    Search for anything...
                </Text>

            </TouchableOpacity>

        </View>
    );
};











// ==========================================================
// HISTORY ITEM
// ==========================================================

const RenderHistoryItem = memo(({
    item,
    conversationId,
    isSearching,
    isLast,
    onProductPress,
}: any) => {

    const { markMessageAsStreamed } = useConversation();


    const [streamingText, setStreamingText] = useState('');

    const [visibleProducts, setVisibleProducts] = useState<any[]>([]);

    const [isStreaming, setIsStreaming] = useState(false);


    const hasStarted = useRef(false);


    // ------------------------------------------------------
    // DATA EXTRACTION
    // ------------------------------------------------------

    const response = item?.agent_response || {};

    const fullText = response?.message || '';

    const products = response?.products || [];

    const relatedResults = response?.related_results || [];

    const alternatives = response?.alternatives || [];

    const suggestions = response?.suggestions || [];

    const filterReasons = response?.filter_reasons || [];

    const type = response?.type || 'search_results';






    // ------------------------------------------------------
    // STREAMING EFFECT
    // ------------------------------------------------------

    useEffect(() => {
        if (!response) return;

        if (item.has_been_streamed || !isLast) {
            setStreamingText(fullText);
            setVisibleProducts(products);
            return;
        }

        if (isLast && !isSearching && !hasStarted.current) {
            hasStarted.current = true;
            setIsStreaming(true);

            let index = 0;
            const interval = setInterval(() => {

                setStreamingText(fullText.substring(0, (index + 1) * 2));
                index++;

                if (index >= fullText.length / 2) {

                    clearInterval(interval);

                    setIsStreaming(false);

                    // Mount everything once
                    setVisibleProducts(products);

                    markMessageAsStreamed(
                        conversationId,
                        item.id,
                    );
                }
            }, 12);

            return () => clearInterval(interval);
        }
    }, [response]);




    
    // -----------------------------------------------------

    // MEMORIES
    const leftColumn = useMemo(
        () => visibleProducts.filter((_, i) => i % 2 === 0),
        [visibleProducts]
    );


    const rightColumn = useMemo(
        () => visibleProducts.filter((_, i) => i % 2 !== 0),
        [visibleProducts]
    );


    
    // ------------------------------------------------------
    // UI
    // ------------------------------------------------------

    return (
        <View style={styles.historyItemWrapper}>

            {/* ------------------------------------------------ */}
            {/* USER BUBBLE */}
            {/* ------------------------------------------------ */}

            <View style={styles.userBubble}>

                <LinearGradient
                    colors={['#FFE082', '#E1F5FE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.userBubbleGradient}
                >

                    <Text style={styles.userText}>
                        {item.user_query?.text}
                    </Text>

                </LinearGradient>
            </View>


            {/* ------------------------------------------------ */}
            {/* AI HEADER */}
            {/* ------------------------------------------------ */}

            <View style={styles.aiHeader}>

                <View style={styles.aiIcon}>
                    <Sparkles
                        size={14}
                        color={COLORS.dark}
                    />
                </View>

                <Text style={styles.aiName}>
                    {isStreaming
                        ? 'Analysing...'
                        : 'AI Assistant'}
                </Text>

            </View>


            {/* ------------------------------------------------ */}
            {/* MAIN RESPONSE */}
            {/* ------------------------------------------------ */}

            <Text style={styles.aiLargeText}>

                {streamingText}

                {
                    isStreaming && (
                        <Text style={{ color: COLORS.accent }}>
                            {' '}▎
                        </Text>
                    )
                }

            </Text>


            {/* ------------------------------------------------ */}
            {/* FOLLOWUP / CLARIFICATION */}
            {/* ------------------------------------------------ */}

            {
                type === 'presearch_followup' && (

                    <View
                        style={{
                            marginTop: 18,
                            gap: 12,
                        }}
                    >

                        {
                            suggestions.map((s: string, i: number) => (

                                <TouchableOpacity
                                    key={i}
                                    style={styles.suggestionChip}
                                >

                                    <Wand2
                                        size={14}
                                        color={COLORS.accent}
                                    />

                                    <Text style={styles.suggestionText}>
                                        {s}
                                    </Text>

                                </TouchableOpacity>
                            ))
                        }

                    </View>
                )
            }



            {/* ------------------------------------------------ */}
            {/* PRODUCTS */}
            {/* ------------------------------------------------ */}



            {
                visibleProducts.length > 0 && (

                    <View style={[styles.gridContainer, { minHeight: height - 200 }]}>

                        <View style={styles.gridColumn}>

                            {
                               leftColumn.map((p: any, idx: number) => (
                                        <ProductCard
                                            key={p.id}
                                            index={idx}
                                            product={p}
                                            height={260}
                                            onPress={() => onProductPress(p.id)}
                                        />
                                    ))

                            }

                        </View>


                        <View style={styles.gridColumn}>

                            { rightColumn.map((p: any) => (

                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            height={220}
                                            onPress={() => onProductPress(p.id)}
                                        />
                                    ))
                            }

                        </View>

                    </View>
                )
            }



            {/* ------------------------------------------------ */}
            {/* FILTER REASONS */}
            {/* ------------------------------------------------ */}


            {
                filterReasons.length > 0 && !isStreaming && (

                    <View
                        style={{
                            marginTop: 24,
                            gap: 10,
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >

                            <Filter
                                size={14}
                                color={COLORS.accent}
                            />

                            <Text
                                style={{
                                    color: COLORS.accent,
                                    fontSize: 12,
                                    fontWeight: '700',
                                }}
                            >
                                WHY THESE RESULTS
                            </Text>

                        </View>


                        {
                            filterReasons.map((reason: string, i: number) => (

                                <View
                                    key={i}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        gap: 8,
                                    }}
                                >

                                    <View
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: 10,
                                            backgroundColor: COLORS.accent,
                                            marginTop: 7,
                                        }}
                                    />

                                    <Text
                                        style={{
                                            color: 'rgba(255,255,255,0.75)',
                                            fontSize: 13,
                                            lineHeight: 20,
                                            flex: 1,
                                        }}
                                    >
                                        {reason}
                                    </Text>

                                </View>
                            ))
                        }

                    </View>
                )
            }




            {/* ------------------------------------------------ */}
            {/* RELATED RESULTS */}
            {/* ------------------------------------------------ */}



            {
                relatedResults.length > 0 && !isStreaming && (

                    <HorizontalResultsSection
                        title="Related Results"
                        data={relatedResults}
                        onProductPress={onProductPress}
                    />
                )
            }




            {/* ------------------------------------------------ */}
            {/* ALTERNATIVES */}
            {/* ------------------------------------------------ */}



            {
                alternatives.length > 0 && !isStreaming && (

                    <HorizontalResultsSection
                        title="Alternative Picks"
                        data={alternatives}
                        onProductPress={onProductPress}
                    />
                )
            }




            {/* ------------------------------------------------ */}
            {/* SUGGESTIONS */}
            {/* ------------------------------------------------ */}



            {
                suggestions.length > 0 && !isStreaming && (

                    <View
                        style={{
                            marginTop: 28,
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 14,
                            }}
                        >

                            <SlidersHorizontal
                                size={14}
                                color={'orange'}
                            />

                            <Text
                                style={{
                                    color: 'orange',
                                    fontSize: 11,
                                    fontWeight: '700',
                                    letterSpacing: 1,
                                }}
                            >
                                QUICK REFINEMENTS
                            </Text>

                            <ChevronDown
                                size={14}
                                color={'orange'}
                            />

                        </View>


                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.suggestionScroll}
                        >

                            {
                                suggestions.map((f: string, i: number) => (

                                    <TouchableOpacity
                                        key={i}
                                        style={styles.suggestionChip}
                                    >

                                        <Text style={styles.suggestionText}>
                                            {f}
                                        </Text>

                                    </TouchableOpacity>
                                ))
                            }

                        </ScrollView>

                    </View>
                )
            }





            {/* ------------------------------------------------ */}
            {/* NO RESULTS */}
            {/* ------------------------------------------------ */}




            {
                type === 'no_results' && (

                    <View
                        style={{
                            marginTop: 18,
                            padding: 18,
                            borderRadius: 18,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.08)',
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >

                            <AlertCircle
                                size={18}
                                color={'orange'}
                            />

                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '700',
                                    fontSize: 15,
                                }}
                            >
                                No Exact Match Found
                            </Text>

                        </View>

                    </View>
                )
            }

        </View>
    );
});




// ==========================================================
// PRODUCT CARD
// ==========================================================

const ProductCard = memo(({
    product,
    height,
    onPress,
    index,
}: any) => {

    const opacity = useRef(
        new Animated.Value(0)
    ).current;

    const translateY = useRef(
        new Animated.Value(18)
    ).current;

    useEffect(() => {

        Animated.parallel([

            Animated.timing(opacity, {
                toValue: 1,
                duration: 350,
                delay: index * 70,
                useNativeDriver: true,
            }),

            Animated.spring(translateY, {
                toValue: 0,
                tension: 70,
                friction: 10,
                delay: index * 70,
                useNativeDriver: true,
            }),

        ]).start();

    }, []);

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    height,
                    opacity,
                    transform: [
                        { translateY },
                    ],
                },
            ]}
        >

            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                style={styles.flex1}
            >

                <ImageBackground
                    source={{ uri: product.image }}
                    style={styles.flex1}
                    imageStyle={{
                        borderRadius: 22,
                    }}
                >

                    <LinearGradient
                        colors={[
                            'transparent',
                            'rgba(0,0,0,0.9)',
                        ]}
                        style={styles.cardGradient}
                    >

                        <Text
                            numberOfLines={2}
                            style={styles.cardTitle}
                        >
                            {product.name}
                        </Text>

                        <Text style={styles.cardPrice}>
                            KSH {product.price?.toLocaleString()}
                        </Text>

                    </LinearGradient>

                </ImageBackground>

            </TouchableOpacity>

        </Animated.View>
    );
});





// ==========================================================
// HORIZONTAL RESULTS SECTION
// ==========================================================



const HorizontalResultsSection = ({
    title,
    data,
    onProductPress,
}: any) => {

    return (
        <View
            style={{
                marginTop: 26,
            }}
        >

            <Text
                style={{
                    color: 'white',
                    fontWeight: '700',
                    fontSize: 16,
                    marginBottom: 14,
                }}
            >
                {title}
            </Text>


            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >

                {
                    data.map((product: any) => (

                        <TouchableOpacity
                            key={product.id}
                            onPress={() => onProductPress(product.id)}
                            style={{
                                width: 180,
                                height: 240,
                                marginRight: 14,
                                borderRadius: 22,
                                overflow: 'hidden',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                            }}
                        >

                            <ImageBackground
                                source={{ uri: product.image }}
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                }}
                            >

                                <LinearGradient
                                    colors={[
                                        'transparent',
                                        'rgba(0,0,0,0.85)',
                                    ]}
                                    style={{
                                        padding: 14,
                                    }}
                                >

                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            color: 'white',
                                            fontWeight: '700',
                                            fontSize: 14,
                                        }}
                                    >
                                        {product.name}
                                    </Text>


                                    <Text
                                        style={{
                                            color: COLORS.accent,
                                            marginTop: 6,
                                            fontWeight: '700',
                                        }}
                                    >
                                        KSH {product.price?.toLocaleString()}
                                    </Text>

                                </LinearGradient>

                            </ImageBackground>
                        </TouchableOpacity>
                    ))
                }

            </ScrollView>
        </View>
    );
};


