import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ccmLogo from '../../assets/ccmlogo1.png'



export interface UserCartProps {
  onBackToChat: () => void;
}

type CartTab = "active" | "saved";

interface CartItem {
  id: string;
  vendor: string;
  vendorLocation: string;
  name: string;
  price: number;
  qty: number;
  category: string;
}

interface VendorGroup {
  location: string;
  items: CartItem[];
}

const INITIAL_CART: CartItem[] = [
  {
    id: "item-1",
    vendor: "Mama Mboga Fresh Produce",
    vendorLocation: "Stall 4, Kenyatta Rd Market",
    name: "Fresh Sukuma Wiki (1 Bundle)",
    price: 50,
    qty: 3,
    category: "Vegetables",
  },
  {
    id: "item-2",
    vendor: "Mama Mboga Fresh Produce",
    vendorLocation: "Stall 4, Kenyatta Rd Market",
    name: "Red Tomatoes (1kg)",
    price: 180,
    qty: 2,
    category: "Vegetables",
  },
  {
    id: "item-3",
    vendor: "Kibichu Cereals Store",
    vendorLocation: "Block B, Gate C Plaza",
    name: "Unga wa Dola (2kg)",
    price: 220,
    qty: 1,
    category: "Mill & Grain",
  },
];

const formatCurrency = (value: number) =>
  `KES ${value.toLocaleString("en-KE")}`;







export function UserCart({ onBackToChat }: UserCartProps) {
  const [activeTab, setActiveTab] = useState<CartTab>("active");
  const [isNavMinimized, setIsNavMinimized] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [cartItems, setCartItems] =
    useState<CartItem[]>(INITIAL_CART);

  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  const showNotification = (message: string) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification(null);
    }, 2400);
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;

          const nextQty = item.qty + delta;

          return nextQty > 0
            ? { ...item, qty: nextQty }
            : null;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeItem = (
    id: string,
    fromSaved = false
  ) => {
    if (fromSaved) {
      setSavedItems((current) =>
        current.filter((item) => item.id !== id)
      );

      showNotification("Removed from saved items");
      return;
    }

    setCartItems((current) =>
      current.filter((item) => item.id !== id)
    );

    showNotification("Item removed from cart");
  };

  const moveToSaved = (item: CartItem) => {
    setCartItems((current) =>
      current.filter((entry) => entry.id !== item.id)
    );

    setSavedItems((current) => {
      const exists = current.some(
        (entry) => entry.id === item.id
      );

      return exists ? current : [...current, item];
    });

    showNotification("Item saved for later");
  };

  const moveToCart = (item: CartItem) => {
    setSavedItems((current) =>
      current.filter((entry) => entry.id !== item.id)
    );

    setCartItems((current) => {
      const exists = current.some(
        (entry) => entry.id === item.id
      );

      return exists ? current : [...current, item];
    });

    setActiveTab("active");
    showNotification("Item moved to cart");
  };

  const groupedCartItems = useMemo(() => {
    return cartItems.reduce<Record<string, VendorGroup>>(
      (groups, item) => {
        if (!groups[item.vendor]) {
          groups[item.vendor] = {
            location: item.vendorLocation,
            items: [],
          };
        }

        groups[item.vendor].items.push(item);

        return groups;
      },
      {}
    );
  }, [cartItems]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.qty,
        0
      ),
    [cartItems]
  );

  const totalUnits = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.qty,
        0
      ),
    [cartItems]
  );

  const vendorCount = Object.keys(groupedCartItems).length;

  const deliveryFee =
    subtotal > 0 ? 100 : 0;

  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!cartItems.length || isCheckingOut) return;

    setIsCheckingOut(true);

    window.setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      setCartItems([]);
    }, 1400);
  };

  const tabs = [
    {
      id: "active" as const,
      label: "Active Cart",
      icon: ShoppingCart,
      count: cartItems.length,
    },
    {
      id: "saved" as const,
      label: "Saved for Later",
      icon: Bookmark,
      count: savedItems.length,
    },
  ];


  const handleReload = () => {
   localStorage.removeItem('showWelcomeBanner');
   
    window.location.reload();
  };


  
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#FFFFFF] font-sans ">

      {/* =========================================================
          TOP BAR
      ========================================================= */}
    <header
      className="
        sticky top-0 z-30
        flex h-14 w-full items-center justify-between
        border-b border-slate-200/60
        bg-orange-500 
        px-3
        backdrop-blur-sm
        sm:px-2 
        sm:pl-0
        lg:px-3 
        lg:pl-0 
      "
    >

        <div className="relative flex min-w-0 items-center gap-3">

          <button
            type="button"
            onClick={onBackToChat}
            aria-label="Back to chat"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <ArrowLeft size={17} />
          </button>
    

        <nav className="flex min-w-0 items-center">
          <button
            type="button"
            onClick={handleReload}
            aria-label="Go to Soko AI home"
            className="
              group
              flex min-w-0 items-Left
              bg-[transparent] ,
              rounded-full 
              
            "
          >
         <div className="">
              <img src={ccmLogo} className="text-white"  height={70} width={70} />
            </div>

          </button>
        </nav>
     <p className="text-white/90 text-sm "> Shoping Cart  </p>

        </div>

        

        <div className="relative flex items-center gap-2">

          <AnimatePresence mode="wait">
            {notification && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                  scale: 0.96,
                }}
                className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[11px] font-medium text-white shadow-xl backdrop-blur-xl sm:flex"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check
                    size={10}
                    className="text-emerald-400"
                  />
                </span>

                {notification}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={onBackToChat}
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:flex"
          >
            <Sparkles size={13} />
            Back to Assistant
          </button>
        </div>
      </header>

      {/* =========================================================
          APP SHELL
      ========================================================= */}
      <div className="flex min-h-0 flex-1 bg-[#f6f7f9]">

        {/* =======================================================
            SIDEBAR
        ======================================================= */}
        <aside
          className={[
            "hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 md:flex",
            isNavMinimized
              ? "w-[76px]"
              : "w-[252px]",
          ].join(" ")}
        >
          <div className="flex min-h-0 flex-1 flex-col">

            {/* Sidebar Brand */}
            <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-slate-100 px-4">

              <div className="flex min-w-0 items-center gap-3">

            {!isNavMinimized && (

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600">
                  <ShoppingCart size={18} />
                </div>
            )}
                
              
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsNavMinimized(
                    (current) => !current
                  )
                }
                aria-label={
                  isNavMinimized
                    ? "Expand sidebar"
                    : "Minimize sidebar"
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                {isNavMinimized ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3">
              {!isNavMinimized && (
                <p className="mb-2 px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Basket
                </p>
              )}

              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active =
                    activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(tab.id)
                      }
                      title={
                        isNavMinimized
                          ? tab.label
                          : undefined
                      }
                      className={[
                        "group flex w-full items-center rounded-xl transition-all",
                        isNavMinimized
                          ? "justify-center p-3"
                          : "justify-between px-3 py-2.5",
                        active
                          ? "bg-orange-50 text-orange-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          size={17}
                          className={
                            active
                              ? "text-orange-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          }
                        />

                        {!isNavMinimized && (
                          <span className="text-xs font-semibold">
                            {tab.label}
                          </span>
                        )}
                      </span>

                      {!isNavMinimized &&
                        tab.count > 0 && (
                          <span
                            className={[
                              "min-w-5 rounded-md px-1.5 py-0.5 text-center font-mono text-[9px] font-bold",
                              active
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-500",
                            ].join(" ")}
                          >
                            {tab.count}
                          </span>
                        )}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Routing Info */}
            {!isNavMinimized && (
              <div className="m-3 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm">
                    <Sparkles size={13} />
                  </div>

                  <span className="text-[10px] font-bold text-orange-900">
                    Smart Routing
                  </span>
                </div>

                <p className="text-[10px] leading-relaxed text-orange-900/60">
                  Your basket is automatically grouped
                  by nearby vendors for efficient local
                  delivery.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* =======================================================
            MAIN AREA
        ======================================================= */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Mobile tabs */}
          <div className="shrink-0 border-b border-slate-200 bg-white px-4 md:hidden">
            <div className="flex h-12 items-center gap-5 overflow-x-auto">
              {tabs.map((tab) => {
                const active =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={[
                      "relative flex h-full shrink-0 items-center gap-2 text-[11px] font-semibold",
                      active
                        ? "text-slate-900"
                        : "text-slate-400",
                    ].join(" ")}
                  >
                    <tab.icon size={14} />

                    {tab.label}

                    {tab.count > 0 && (
                      <span className="rounded-md bg-orange-50 px-1.5 py-0.5 font-mono text-[9px] text-orange-600">
                        {tab.count}
                      </span>
                    )}

                    {active && (
                      <motion.div
                        layoutId="mobile-tab"
                        className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-orange-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              CONTENT
          ===================================================== */}
          <div className="min-h-0 flex-1 overflow-y-auto">

            <div className="mx-auto w-full max-w-[1380px] p-4 sm:p-6 lg:p-8">

              {/* Page heading */}
              {!orderPlaced && (
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-orange-600">
                        {activeTab === "active"
                          ? "Current basket"
                          : "Saved items"}
                      </span>
                    </div>

                    <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                      {activeTab === "active"
                        ? "Your Shopping Basket"
                        : "Saved for Later"}
                    </h2>

                    <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500">
                      {activeTab === "active"
                        ? "Review your items, vendors and delivery details before checkout."
                        : "Keep items here until you're ready to add them to your basket."}
                    </p>
                  </div>

                  {activeTab === "active" &&
                    cartItems.length > 0 && (
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                        <PackageCheck
                          size={14}
                          className="text-emerald-500"
                        />

                        <span className="text-[10px] font-semibold text-slate-600">
                          {totalUnits}{" "}
                          {totalUnits === 1
                            ? "unit"
                            : "units"}{" "}
                          · {vendorCount}{" "}
                          {vendorCount === 1
                            ? "vendor"
                            : "vendors"}
                        </span>
                      </div>
                    )}
                </div>
              )}

              {/* =================================================
                  ORDER SUCCESS
              ================================================= */}
              {orderPlaced ? (
                <OrderSuccess
                  onReturn={onBackToChat}
                />
              ) : (
                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

                  {/* =============================================
                      LEFT CONTENT
                  ============================================= */}
                  <section className="min-w-0">

                    <AnimatePresence
                      mode="popLayout"
                    >
                      {activeTab === "active" ? (
                        cartItems.length > 0 ? (
                          <div className="space-y-5">
                            {Object.entries(
                              groupedCartItems
                            ).map(
                              (
                                [vendorName, group],
                                index
                              ) => (
                                <VendorCard
                                  key={vendorName}
                                  vendorName={
                                    vendorName
                                  }
                                  group={group}
                                  index={index}
                                  onUpdateQty={
                                    updateQty
                                  }
                                  onSave={
                                    moveToSaved
                                  }
                                  onRemove={
                                    removeItem
                                  }
                                />
                              )
                            )}
                          </div>
                        ) : (
                          <EmptyCart
                            onExplore={
                              onBackToChat
                            }
                          />
                        )
                      ) : savedItems.length > 0 ? (
                        <div className="space-y-3">
                          {savedItems.map(
                            (item) => (
                              <SavedItem
                                key={item.id}
                                item={item}
                                onMoveToCart={
                                  moveToCart
                                }
                                onRemove={() =>
                                  removeItem(
                                    item.id,
                                    true
                                  )
                                }
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <EmptySaved
                          onSwitch={() =>
                            setActiveTab(
                              "active"
                            )
                          }
                        />
                      )}
                    </AnimatePresence>
                  </section>

                  {/* =============================================
                      ORDER SUMMARY
                  ============================================= */}
                  {activeTab === "active" && (
                    <OrderSummary
                      subtotal={subtotal}
                      deliveryFee={
                        deliveryFee
                      }
                      total={total}
                      totalUnits={
                        totalUnits
                      }
                      vendorCount={
                        vendorCount
                      }
                      disabled={
                        cartItems.length ===
                        0
                      }
                      isCheckingOut={
                        isCheckingOut
                      }
                      onCheckout={
                        handleCheckout
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ===============================================================
   VENDOR CARD
================================================================ */

interface VendorCardProps {
  vendorName: string;
  group: VendorGroup;
  index: number;
  onUpdateQty: (
    id: string,
    delta: number
  ) => void;
  onSave: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

function VendorCard({
  vendorName,
  group,
  index,
  onUpdateQty,
  onSave,
  onRemove,
}: VendorCardProps) {
  const vendorSubtotal = group.items.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.98,
      }}
      transition={{
        duration: 0.25,
        delay: index * 0.04,
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Vendor header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-orange-600 shadow-sm">
            <Store size={17} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-xs font-bold text-slate-900">
              {vendorName}
            </h3>

            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-400">
              <MapPin
                size={11}
                className="shrink-0 text-orange-500"
              />

              <span className="truncate">
                {group.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready in ~15 min
          </div>

          <span className="hidden text-[10px] font-medium text-slate-400 sm:inline">
            {formatCurrency(
              vendorSubtotal
            )}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-slate-100">
        {group.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onUpdateQty={
              onUpdateQty
            }
            onSave={onSave}
            onRemove={onRemove}
          />
        ))}
      </div>
    </motion.article>
  );
}

/* ===============================================================
   CART ITEM ROW
================================================================ */

interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (
    id: string,
    delta: number
  ) => void;
  onSave: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

function CartItemRow({
  item,
  onUpdateQty,
  onSave,
  onRemove,
}: CartItemRowProps) {
  return (
    <motion.div
      layout
      className="group p-4 transition-colors hover:bg-slate-50/60 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Product information */}
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 transition group-hover:border-orange-100 group-hover:bg-orange-50 group-hover:text-orange-500">
            <ShoppingBag size={19} />
          </div>

          <div className="min-w-0">
            <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-400">
              {item.category}
            </span>

            <h4 className="mt-1.5 truncate text-xs font-bold text-slate-900">
              {item.name}
            </h4>

            <p className="mt-1 text-[10px] text-slate-400">
              {formatCurrency(item.price)}{" "}
              <span className="text-slate-300">
                per unit
              </span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">

          <QuantityControl
            qty={item.qty}
            onDecrease={() =>
              onUpdateQty(
                item.id,
                -1
              )
            }
            onIncrease={() =>
              onUpdateQty(
                item.id,
                1
              )
            }
          />

          <div className="w-[92px] text-right">
            <p className="font-mono text-xs font-black text-slate-900">
              {formatCurrency(
                item.price * item.qty
              )}
            </p>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() =>
                onSave(item)
              }
              aria-label="Save item for later"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-orange-50 hover:text-orange-500"
            >
              <Bookmark size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                onRemove(item.id)
              }
              aria-label="Remove item"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ===============================================================
   QUANTITY CONTROL
================================================================ */

interface QuantityControlProps {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

function QuantityControl({
  qty,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <div className="flex h-9 items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        aria-label={
          qty === 1
            ? "Remove item"
            : "Decrease quantity"
        }
        className={[
          "flex h-7 w-7 items-center justify-center rounded-lg transition",
          qty === 1
            ? "text-rose-400 hover:bg-rose-50 hover:text-rose-600"
            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
        ].join(" ")}
      >
        {qty === 1 ? (
          <Trash2 size={13} />
        ) : (
          <Minus size={13} />
        )}
      </button>

      <span className="min-w-[28px] text-center font-mono text-[11px] font-bold text-slate-900">
        {qty}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

/* ===============================================================
   ORDER SUMMARY
================================================================ */

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalUnits: number;
  vendorCount: number;
  disabled: boolean;
  isCheckingOut: boolean;
  onCheckout: () => void;
}

function OrderSummary({
  subtotal,
  deliveryFee,
  total,
  totalUnits,
  vendorCount,
  disabled,
  isCheckingOut,
  onCheckout,
}: OrderSummaryProps) {
  return (
    <aside className="xl:sticky xl:top-6">

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Summary header */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600">
              <Truck size={17} />
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-900">
                Order Summary
              </h3>

              <p className="mt-1 text-[10px] text-slate-400">
                {vendorCount}{" "}
                {vendorCount === 1
                  ? "vendor"
                  : "vendors"}{" "}
                · {totalUnits}{" "}
                {totalUnits === 1
                  ? "unit"
                  : "units"}
              </p>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-4 p-5">

          <div className="space-y-3">
            <SummaryRow
              label="Items subtotal"
              value={formatCurrency(
                subtotal
              )}
            />

            <SummaryRow
              label="Runner delivery"
              value={formatCurrency(
                deliveryFee
              )}
            />
          </div>

          {/* Delivery */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="flex items-start gap-2.5">
              <MapPin
                size={14}
                className="mt-0.5 shrink-0 text-orange-500"
              />

              <div>
                <p className="text-[10px] font-bold text-slate-700">
                  Delivery destination
                </p>

                <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400">
                  Juja · Kenyatta Road /
                  Gate C
                </p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">
                  Total amount
                </p>

                <p className="mt-1 text-[9px] text-slate-300">
                  Includes delivery
                </p>
              </div>

              <span className="font-mono text-xl font-black tracking-tight text-slate-950">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Checkout */}
          <button
            type="button"
            disabled={
              disabled || isCheckingOut
            }
            onClick={onCheckout}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-[11px] font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-amber-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isCheckingOut ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing M-Pesa...
              </>
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 pt-1 text-[9px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Secure M-Pesa checkout
          </div>
        </div>
      </div>

      {/* Micro fulfillment note */}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Sparkles size={14} />
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-700">
              Smart fulfillment
            </p>

            <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
              Soko AI groups products from
              nearby vendors so your runner
              can collect them efficiently.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-slate-500">
        {label}
      </span>

      <span className="font-mono text-[11px] font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

/* ===============================================================
   SAVED ITEM
================================================================ */

function SavedItem({
  item,
  onMoveToCart,
  onRemove,
}: {
  item: CartItem;
  onMoveToCart: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.98,
      }}
      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
          <Bookmark size={17} />
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
            {item.vendor}
          </p>

          <h3 className="truncate text-xs font-bold text-slate-900">
            {item.name}
          </h3>

          <p className="mt-1 font-mono text-[10px] font-semibold text-slate-600">
            {formatCurrency(item.price)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
        <button
          type="button"
          onClick={onMoveToCart}
          className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-[10px] font-bold text-orange-700 transition hover:bg-orange-100"
        >
          Move to Cart
          <ArrowRight size={12} />
        </button>

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove saved item"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.article>
  );
}

/* ===============================================================
   EMPTY CART
================================================================ */

function EmptyCart({
  onExplore,
}: {
  onExplore: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        <ShoppingCart size={25} />
      </div>

      <h3 className="text-sm font-bold text-slate-900">
        Your basket is empty
      </h3>

      <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-slate-400">
        Nothing here yet. Ask Soko AI to find
        products or explore nearby vendors and
        build your basket.
      </p>

      <button
        type="button"
        onClick={onExplore}
        className="mt-6 flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-slate-800"
      >
        <Sparkles size={13} />
        Explore with Soko AI
      </button>
    </motion.div>
  );
}

/* ===============================================================
   EMPTY SAVED
================================================================ */

function EmptySaved({
  onSwitch,
}: {
  onSwitch: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        <Bookmark size={22} />
      </div>

      <h3 className="text-sm font-bold text-slate-900">
        Nothing saved yet
      </h3>

      <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-slate-400">
        Save products from your active basket
        when you want to come back to them later.
      </p>

      <button
        type="button"
        onClick={onSwitch}
        className="mt-5 text-[10px] font-bold text-orange-600 hover:text-orange-700"
      >
        Return to Active Cart →
      </button>
    </motion.div>
  );
}

/* ===============================================================
   SUCCESS
================================================================ */

function OrderSuccess({
  onReturn,
}: {
  onReturn: () => void;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      className="mx-auto flex min-h-[560px] max-w-2xl flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm sm:px-12"
    >
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          delay: 0.1,
          type: "spring",
          stiffness: 180,
        }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50 text-emerald-600"
      >
        <CheckCircle2 size={38} />
      </motion.div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-600">
            Order confirmed
          </span>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          Your basket is on its way.
        </h2>

        <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-slate-400">
          Your order has been routed to nearby
          vendors and runners in Juja. Watch for
          the M-Pesa payment prompt and delivery
          updates on your phone.
        </p>
      </div>

      <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-2">
        <SuccessStep
          icon={<Store size={14} />}
          label="Vendors"
        />

        <SuccessStep
          icon={<Truck size={14} />}
          label="Runner"
        />

        <SuccessStep
          icon={<Check size={14} />}
          label="Delivery"
        />
      </div>

      <button
        type="button"
        onClick={onReturn}
        className="mt-8 flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-[10px] font-bold text-white transition hover:bg-slate-800"
      >
        <Sparkles size={13} />
        Return to Soko AI
      </button>
    </motion.div>
  );
}

function SuccessStep({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
      <span className="text-emerald-500">
        {icon}
      </span>

      <span className="text-[9px] font-semibold text-slate-500">
        {label}
      </span>
    </div>
  );
}
