import uuid
from django.conf import settings
from django.db import models
from decimal import Decimal

# ======================== CART SYSTEM ========================

class Cart(models.Model):
    """
    Represents a user's shopping cart.
    Can contain multiple CartGroups (grouped by merchant).
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carts',
        help_text="The user who owns this cart"
    )
    cart_uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    is_active = models.BooleanField(default=True)

    # --- Security ---
    is_protected = models.BooleanField(default=False)
    passcode = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return f"Cart {self.cart_uuid} - {self.user.username}"

    # ================== PRICING ==================

    @property
    def base_cart_total_cost(self):
        """
        Returns the subtotal of all merchant groups in this cart,
        excluding processing and shipping fees.
        """
        return sum((group.group_total for group in self.groups.all()), Decimal('0.00'))


    @property
    def final_cart_total_cost(self):
        """Final total including subtotal, processing fees, and shipping."""
        return self.base_cart_total_cost + self.processing_fees + self.shipping_cost

    @property
    def processing_fees(self):
        return Decimal('0.00')

    @property
    def shipping_cost(self):
        return Decimal('0.00')


class CartGroup(models.Model):
    """
    Represents a group of items in a cart that belong to the same merchant.
    Useful for calculating per-merchant totals and shipping.
    """

    cart = models.ForeignKey(
        'Cart',
        on_delete=models.CASCADE,
        related_name='groups',
        help_text="The cart this group belongs to"
    )


    group_uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    def __str__(self):
        return f"{self.merchant.title} items in {self.cart.user.username}'s cart"

    # ================== PROPERTIES ==================

    @property
    def group_total(self):
        """
        Returns the total price of all items in this merchant group.
        """
        return sum((item.total_price for item in self.items.all()), Decimal('0.00'))

    @property
    def group_items_count(self):
        """Returns the total number of items in this group."""
        return self.items.count()

    @property
    def total_group_shipping_weight(self):
        """
        Returns the total shipping weight (in kg) for all items in this group.
        """
        return sum((item.item_shipping_weight for item in self.items.all()), Decimal('0.00'))




class CartItem(models.Model):
    """
    Represents an item in a shopping cart.
    Tracks quantity, price at addition, and calculates totals and shipping attributes.
    """

    cart_group = models.ForeignKey(
        'CartGroup',
        on_delete=models.CASCADE,
        related_name='items',
        help_text="The cart this item belongs to"
    )
    
    quantity = models.PositiveIntegerField(default=1)
    price_at_addition = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Price of the item at the time it was added to the cart'
    )

    def __str__(self):
        return f'{self.quantity} x {self.item.name}'
    


    # ================== QUANTITY MANAGEMENT ==================
    def increment_quantity(self, amount=1):
        """Increase quantity of this cart item."""
        self.quantity += amount
        self.save()
        return self.quantity


    def decrement_quantity(self, amount=1):
        """
        Decrease quantity of this cart item.
        Deletes the item if quantity falls below 1.
        """
        if self.quantity > amount:
            self.quantity -= amount
            self.save()
            return self.quantity
        self.delete()
        return None


    # ================== PRICING ==================
    @property
    def total_price(self):
        """Total price for this cart item (quantity * price at addition)."""
        return self.price_at_addition * self.quantity


    @property
    def total_cost(self):
        """Alias for total_price (for semantic clarity in checkout)."""
        return self.total_price


    # ================== SHIPPING ==================
    @property
    def item_shipping_weight(self):
        """
        Total shipping weight for this cart item in kilograms.
        Uses item's shipping weight (grams) multiplied by quantity.
        """
        return (self.item.shipping_weight / Decimal('1000')) * self.quantity


    @property
    def item_heavy(self):
        """Returns True if the item is heavy according to the inventory definition."""
        return self.item.is_heavy


    @property
    def is_bulky(self):
        """Returns True if the item is bulky according to the inventory definition."""
        return self.item.is_bulky






