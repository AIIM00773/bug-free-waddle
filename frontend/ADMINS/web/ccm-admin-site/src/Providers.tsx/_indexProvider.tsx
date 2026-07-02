


import React from 'react'
import { AdminAuthProvider } from './AdminAuthAndProfileContext'
import { CatalogProvider } from './ProductCatalogContext'
import { MarketplaceProvider } from './MarketplaceProfilesContex'
import { TaxonomyMatricesProvider } from './TaxonomyMatricesContext'
import { DirectMerchantsProvider } from './PartnerMerchantsContext'
import { PlatformUsersProvider } from './PlatformUsersContext'
import { OrderRecordsProvider } from './OrderRecordsContext'
import { CustomerSupportProvider } from './CustomerServiceContext'
import { CartAnalyticsProvider } from './CartAnalyicsContext'
import { OperationsChatProvider } from './AdminCommsContext'

// Combines all engines into a single manageable clean layout node
export function AdminWorkspaceProviders({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <CatalogProvider>
                <MarketplaceProvider>
                    <TaxonomyMatricesProvider>
                            <DirectMerchantsProvider>
                                <PlatformUsersProvider>
                                    <OrderRecordsProvider>
                                        <CustomerSupportProvider>
                                            <CartAnalyticsProvider>
                                                <OperationsChatProvider>
                                                    {children}
                                                </OperationsChatProvider>
                                            </CartAnalyticsProvider>
                                        </CustomerSupportProvider>
                                    </OrderRecordsProvider>
                                </PlatformUsersProvider>
                            </DirectMerchantsProvider>
                    </TaxonomyMatricesProvider>
                </MarketplaceProvider>
            </CatalogProvider>
        </AdminAuthProvider>
    )
}