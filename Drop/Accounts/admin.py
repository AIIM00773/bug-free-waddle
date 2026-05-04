
from django.contrib import admin

from .models import UserProfile, UserPersona,UserNotification,Conversation,ConversationHistory

from Merchants.models import (
    Merchant
)



from Clients.models import (
    Cart,
    CartGroup,
    CartItem,
)







All_Models = (
    Cart,
    CartGroup,
    CartItem,
 

    Merchant,
    UserProfile,
    UserPersona,
    UserNotification,
    Conversation,ConversationHistory
)




for m in All_Models:
    admin.site.register(m)



