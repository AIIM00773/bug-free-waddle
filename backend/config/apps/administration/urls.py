from django.urls import path
from . import views

# Auth Services
from .Services.Admin import AdminLoginService, ValidateAdminAuthService

# Marketplace Services
from .Services.Marketplace import GetMarketsService, UpdateDeleteMarketService

# Merchant Management Services
from .Services.Merchants import (
    DeactivateMerchantView,
    ActivateMerchantView,
    MerchantsFetchView,
    MerchantDetailFetchView,
    DeleteMerchantView
    )



# Product Catalog Services
from .Services.ProductCtalog import (
    BaseMerchantProductCatalogView,
    MerchantProductCatalogDetailView
    
    )



# Taxonomy System Services
from .Services.Taxonomy import (
    SiteTaxonomiesListView,
    TaxonomyCreateViewService,
    TaxonomyDeleteViewService,
    TaxonomyUpdateViewService,
)

# User Directory Services
from .Services.User import UsersDirectoryService


urlpatterns = [
    # 1. AUTHENTICATION & IDENTITY ENGINES
    path("", ValidateAdminAuthService.as_view(), name="auth-validate-root"),
    path("auth/access/", AdminLoginService.as_view(), name="auth-access"),
    path("auth/login/", AdminLoginService.as_view(), name="auth-login"),
    path("auth/me/", ValidateAdminAuthService.as_view(), name="auth-current-session"),



    # 2. CORE USERS METRIC HOOKS
    path("users/", UsersDirectoryService.as_view(), name="users-list"),
    path("users/<uuid:pk>/", UsersDirectoryService.as_view(), name="users-detail"),



    # 3. REGIONAL MARKETPLACE CHANNELS
    path("markets/", GetMarketsService.as_view(), name="markets-list"),
    path("markets/update/delete/", UpdateDeleteMarketService.as_view(), name="markets-mutation"), 



    #MERCHANT  MANAGEMENT
    # Parent:::: adm/root/api/v1/8be4df6193ca11d2aa0d00e098032b8c/
    path("merchants/", MerchantsFetchView.as_view(), name="merchants-list"),
    path("merchants/update/delete/", DeleteMerchantView.as_view(), name="merchants-mutation"),
    path("merchants/details/", MerchantDetailFetchView.as_view(), name="merchants-detail-fetch"), 
    path("merchants/activate/", ActivateMerchantView.as_view(), name="merchants-activate"),
    path("merchants/deactivate/", DeactivateMerchantView.as_view(), name="merchants-deactivate"),




    # CUSTOMER MERCHANT ORDERS  MANAGEMENT
    # path("customer-merchant-orders/", RootAdminMerchantManagementViewGetCreate.as_view(), name="merchants-list-create"),
    # path("customer-merchant-order/update/delete/", RootAdminMerchantManagementViewUpdateDlete.as_view(), name="merchants-mutation"),
    # path("customer-merchant-order/details/", MerchantDetailFetchView.as_view(), name="merchants-detail-fetch"), 
    # path("merchants/unregistered-users/", GetNoneMerchantUsersForRegistration.as_view(), name="merchants-eligible-users"),
    
    
  
  
  
    # 5. MERCHANT PRODUCT CATALOG MATRIX (Soko Core)
    path("catalogs/products/", BaseMerchantProductCatalogView.as_view(), name="products-list-create"),    
    path("catalogs/products/details/", MerchantProductCatalogDetailView.as_view(), name="products-detail-mutate"),    

    # 6. SYSTEM TAXONOMIES & GRAPH MATRICES
    path("taxonomies/", SiteTaxonomiesListView.as_view(), name="taxonomies-list"),
    path("taxonomies/<str:matrix_type>/", TaxonomyCreateViewService.as_view(), name="taxonomies-create"),
    path("taxonomies/<str:matrix_type>/update/<str:unique_id>/", TaxonomyUpdateViewService.as_view(), name="taxonomies-update"),
    path("taxonomies/<str:matrix_type>/purge/<uuid:unique_id>/", TaxonomyDeleteViewService.as_view(), name="taxonomies-purge"),
]