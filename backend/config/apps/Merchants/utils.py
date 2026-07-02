


# utils.py
from .models import MerchantActivityLog

def log_merchant_activity(merchant, action_event, category, description, request=None, severity='info', order_uuid=None, product_uuid=None):
    """
    Safely captures background operations and HTTP metadata to build the immutable ledger trace.
    """
    ip_address = None
    user_agent = None
    initiated_by = None

    if request:
        initiated_by = request.user if request.user.is_authenticated else None
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        
        # Parse real client IP from behind proxy or direct header
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0].strip()
        else:
            ip_address = request.META.get('REMOTE_ADDR')

    return MerchantActivityLog.objects.create(
        merchant=merchant,
        initiated_by=initiated_by,
        category=category,
        severity=severity,
        action_event=action_event,
        description=description,
        ip_address=ip_address,
        user_agent=user_agent,
        linked_order_uuid=order_uuid,
        linked_product_uuid=product_uuid
    )