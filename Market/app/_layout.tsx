import { AuthProvider } from "@/Providers/AuthProvider";
import { BasicsProvider } from "@/Providers/BasicsProvider";
import { CartProvider } from "@/Providers/CartProvider";
import { ConversationProvider } from "@/Providers/ConversationProvider";
import { ImageUploadProvider } from "@/Providers/ImageUploadProvider";
import { PromptProvider } from "@/Providers/MainProptsProvider";
import { NotificationProvider } from "@/Providers/NotificationProvider";
import { OrderProvider } from "@/Providers/OrderProvider";
import { PaymentProvider } from "@/Providers/PaymentProvider";
import { ProductProvider } from "@/Providers/ProductProvider";
import { ReviewProvider } from "@/Providers/ReviewProvider";
import { SearchProvider } from "@/Providers/SearchProvider";
import { ChatProvider } from "@/Providers/VendorCustomerChat";

import { Stack } from "expo-router";

export default function Layout() {
    return (
        <AuthProvider>
            <BasicsProvider>
                <NotificationProvider>
                    {/* CRITICAL FIX: 
                        1. PromptProvider must be above ConversationProvider (because Conversation uses usePrompt)
                        2. ConversationProvider must be above ProductProvider (because Product uses useConversation)
                    */}
                    <PromptProvider>
                        <ConversationProvider>
                            <ProductProvider>
                                <SearchProvider>
                                    <CartProvider>
                                        <OrderProvider>
                                            <PaymentProvider>
                                                <ImageUploadProvider>
                                                    <ChatProvider>
                                                        <ReviewProvider>
                                                            
                                                            <Stack
                                                                screenOptions={{
                                                                    headerShown: false,
                                                                    contentStyle: { backgroundColor: '#FFFFFF' }
                                                                }}
                                                            />

                                                        </ReviewProvider>
                                                    </ChatProvider>
                                                </ImageUploadProvider>
                                            </PaymentProvider>
                                        </OrderProvider>
                                    </CartProvider>
                                </SearchProvider>
                            </ProductProvider>
                        </ConversationProvider>
                    </PromptProvider>
                </NotificationProvider>
            </BasicsProvider>
        </AuthProvider>
    );
}