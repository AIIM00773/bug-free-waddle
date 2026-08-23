import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Package,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronDown,
  Calendar,
  MapPin,
  Phone,
  RotateCcw,
  User,
  Store,
  Copy,
  Search,
  ArrowLeft,
  Clock3,
  Receipt,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { OrdersHeader } from "../subComponents/order/header";
import { OrdersSidebar } from "../subComponents/order/sider";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export type OrderStatus = "In Transit" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  vendor: string;
  deliveryAddress: string;
  items: OrderItem[];
  runner: string;
  runnerPhone?: string;
}

export interface UserOrdersProps {
  onBackToChat: () => void;
  onReorder?: (order: Order) => void;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ElementType;
    dot: string;
    badge: string;
    iconWrapper: string;
  }
> = {
  "In Transit": {
    label: "In Transit",
    icon: Truck,
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    iconWrapper: "bg-amber-50 text-amber-600 border-amber-100",
  },

  Delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconWrapper: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },

  Cancelled: {
    label: "Cancelled",
    icon: XCircle,
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    iconWrapper: "bg-rose-50 text-rose-600 border-rose-100",
  },
};

/* -------------------------------------------------------------------------- */
/* Mock Data                                                                  */
/* -------------------------------------------------------------------------- */

const INITIAL_ORDERS: Order[] = [
  {
    id: "SOKO-8492",
    date: "2026-07-28 14:32",
    status: "In Transit",
    total: 1450,
    vendor: "Mama Mboga Fresh Produce",
    deliveryAddress: "Kilimani, Greenfields Apt 4B",
    items: [
      {
        name: "Fresh Sukuma Wiki (1 Bundle)",
        qty: 3,
        price: 50,
      },
      {
        name: "Red Tomatoes (1kg)",
        qty: 2,
        price: 180,
      },
      {
        name: "Grade A Eggs (Crate)",
        qty: 1,
        price: 480,
      },
      {
        name: "Fresh Avocado",
        qty: 4,
        price: 50,
      },
    ],
    runner: "Juma K. (Runner #4)",
    runnerPhone: "+254 712 345 678",
  },

  {
    id: "SOKO-8410",
    date: "2026-07-25 09:15",
    status: "Delivered",
    total: 820,
    vendor: "Kibichu Cereals Store",
    deliveryAddress: "Kilimani, Greenfields Apt 4B",
    items: [
      {
        name: "Unga wa Dola (2kg)",
        qty: 1,
        price: 220,
      },
      {
        name: "Kabras Sugar (2kg)",
        qty: 1,
        price: 300,
      },
      {
        name: "Blue Band Margarine (500g)",
        qty: 1,
        price: 300,
      },
    ],
    runner: "Brian M. (Runner #2)",
    runnerPhone: "+254 722 987 654",
  },

  {
    id: "SOKO-8395",
    date: "2026-07-20 18:40",
    status: "Cancelled",
    total: 350,
    vendor: "Amina Spice Kiosk",
    deliveryAddress: "Kilimani, Greenfields Apt 4B",
    items: [
      {
        name: "Ndengu (1kg)",
        qty: 1,
        price: 250,
      },
      {
        name: "Dhania Bunch",
        qty: 2,
        price: 50,
      },
    ],
    runner: "Unassigned",
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatCurrency(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

function getStatusConfig(status: OrderStatus) {
  return STATUS_CONFIG[status];
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({
  status,
  large = false,
}: {
  status: OrderStatus;
  large?: boolean;
}) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-full border",
        large ? "px-3 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]",
        "font-semibold",
        "whitespace-nowrap",
        config.badge,
      ].join(" ")}
    >
      {status === "In Transit" ? (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${config.dot}`}
          />

          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`}
          />
        </span>
      ) : (
        <Icon
          size={large ? 13 : 12}
          strokeWidth={2.4}
        />
      )}

      {config.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Order Card                                                                 */
/* -------------------------------------------------------------------------- */

interface OrderCardProps {
  order: Order;
  onOpen: (order: Order) => void;
  onCopy: (id: string) => void;
}

function OrderCard({
  order,
  onOpen,
  onCopy,
}: OrderCardProps) {
  const statusConfig = getStatusConfig(order.status);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={[
        "group relative overflow-hidden rounded-2xl",
        "border border-gray-200/80 bg-white",
        "shadow-sm transition-all duration-200",
        "hover:border-gray-300 hover:shadow-md",
      ].join(" ")}
    >
      {/* Status accent */}
      <div
        className={`absolute inset-y-0 left-0 w-1 ${statusConfig.dot}`}
        aria-hidden="true"
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Vendor icon */}
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center",
              "rounded-xl border",
              statusConfig.iconWrapper,
            ].join(" ")}
          >
            <Store size={19} strokeWidth={2} />
          </div>

          {/* Main information */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-tight text-gray-900">
                {order.id}
              </span>

              <button
                type="button"
                aria-label={`Copy order ${order.id}`}
                onClick={() => onCopy(order.id)}
                className={[
                  "rounded-md p-1 text-gray-400",
                  "transition-colors",
                  "hover:bg-gray-100 hover:text-gray-700",
                  "focus:outline-none focus:ring-2 focus:ring-orange-500/20",
                ].join(" ")}
              >
                <Copy size={12} />
              </button>

              <StatusBadge status={order.status} />
            </div>

            <h3 className="mt-2 truncate text-sm font-bold text-gray-900 sm:text-[15px]">
              {order.vendor}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-gray-500">
                <Calendar
                  size={13}
                  className="shrink-0 text-gray-400"
                />

                {order.date}
              </span>

              <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-gray-500">
                <MapPin
                  size={13}
                  className="shrink-0 text-gray-400"
                />

                <span className="max-w-[220px] truncate">
                  {order.deliveryAddress}
                </span>
              </span>
            </div>
          </div>

          {/* Desktop total */}
          <div className="hidden shrink-0 items-center gap-4 sm:flex">
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
                Total
              </p>

              <p className="mt-0.5 font-mono text-sm font-bold text-gray-900">
                {formatCurrency(order.total)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpen(order)}
              aria-label={`View ${order.id}`}
              className={[
                "flex h-9 w-9 items-center justify-center",
                "rounded-xl border border-gray-200",
                "bg-gray-50 text-gray-400",
                "transition-all",
                "hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600",
                "active:scale-95",
              ].join(" ")}
            >
              <ChevronDown
                size={16}
                className="-rotate-90"
              />
            </button>
          </div>
        </div>

        {/* Mobile bottom row */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 sm:hidden">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">
              Order total
            </p>

            <p className="mt-0.5 font-mono text-sm font-bold text-gray-900">
              {formatCurrency(order.total)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpen(order)}
            className={[
              "inline-flex items-center gap-1.5",
              "rounded-xl border border-gray-200",
              "bg-gray-50 px-3 py-2",
              "text-[11px] font-semibold text-gray-700",
              "transition-all",
              "hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600",
              "active:scale-95",
            ].join(" ")}
          >
            View Order
            <ChevronDown
              size={14}
              className="-rotate-90"
            />
          </button>
        </div>

        {/* Desktop view action */}
        <button
          type="button"
          onClick={() => onOpen(order)}
          className="mt-4 hidden w-full rounded-xl border border-gray-100 bg-gray-50/70 py-2.5 text-[11px] font-semibold text-gray-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-orange-50 hover:text-orange-600 sm:block"
        >
          View order details
        </button>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Order Details Modal                                                        */
/* -------------------------------------------------------------------------- */

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onCopy: (id: string) => void;
  onReorder?: (order: Order) => void;
}

function OrderDetailsModal({
  order,
  onClose,
  onCopy,
  onReorder,
}: OrderDetailsModalProps) {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  /* ---------------------------------------------------------------------- */
  /* Escape key + body scroll lock                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* ------------------------------------------------------------------ */}
      {/* Backdrop                                                            */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        key="order-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-gray-950/35 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Modal wrapper                                                       */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        key="order-modal"
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 16,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 16,
        }}
        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}
        className={[
          "fixed z-[101]",
          "left-0 right-0 bottom-0",
          "mx-auto",
          "w-full",
          "max-h-[94vh]",
          "overflow-hidden",
          "rounded-t-3xl",
          "border border-gray-200",
          "bg-white",
          "shadow-2xl",

          "sm:left-1/2 sm:right-auto sm:top-1/2",
          "sm:bottom-auto",
          "sm:w-[calc(100%-2rem)]",
          "sm:max-w-2xl",
          "sm:-translate-x-1/2",
          "sm:-translate-y-1/2",
          "sm:rounded-3xl",
        ].join(" ")}
      >
        {/* Mobile drag indicator */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Modal Header                                                       */}
        {/* ---------------------------------------------------------------- */}

        <header className="border-b border-gray-100 bg-white px-4 pb-4 pt-3 sm:px-6 sm:pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center",
                  "rounded-xl border",
                  statusConfig.iconWrapper,
                ].join(" ")}
              >
                <Store size={19} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-900">
                    {order.id}
                  </span>

                  <button
                    type="button"
                    onClick={() => onCopy(order.id)}
                    aria-label={`Copy order ${order.id}`}
                    className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <Copy size={12} />
                  </button>

                  <StatusBadge
                    status={order.status}
                    large
                  />
                </div>

                <h2 className="mt-1 truncate text-base font-bold text-gray-950 sm:text-lg">
                  {order.vendor}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center",
                "rounded-xl border border-gray-200",
                "bg-gray-50 text-gray-500",
                "transition-all",
                "hover:bg-gray-100 hover:text-gray-800",
                "active:scale-95",
              ].join(" ")}
            >
              <X size={17} />
            </button>
          </div>

          {/* Header meta */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
              <Calendar size={13} className="text-gray-400" />
              {order.date}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
              <MapPin size={13} className="text-gray-400" />
              <span className="max-w-[240px] truncate">
                {order.deliveryAddress}
              </span>
            </span>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Scrollable Body                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="max-h-[calc(94vh-155px)] overflow-y-auto bg-[#F8F8FA] p-4 sm:p-6">
          <div className="space-y-5">
            {/* ------------------------------------------------------------ */}
            {/* Status                                                         */}
            {/* ------------------------------------------------------------ */}

            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center",
                    "rounded-xl border",
                    statusConfig.iconWrapper,
                  ].join(" ")}
                >
                  <StatusIcon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-gray-400">
                    Current status
                  </p>

                  <p className="mt-1 text-xs font-semibold text-gray-900">
                    {order.status === "In Transit"
                      ? "Your order is currently on its way."
                      : order.status === "Delivered"
                      ? "Your order has been delivered successfully."
                      : "This order has been cancelled."}
                  </p>
                </div>

                <StatusBadge status={order.status} />
              </div>

              {/* Active order progress */}
              {order.status === "In Transit" && (
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-amber-700">
                      Out for delivery
                    </span>

                    <span className="text-amber-600">
                      On the way
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "72%" }}
                      transition={{
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full bg-amber-500"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Delivery                                                        */}
            {/* ------------------------------------------------------------ */}

            <section>
              <div className="mb-2 flex items-center gap-2 px-1">
                <Truck size={13} className="text-gray-400" />

                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  Delivery
                </h3>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                {/* Address */}
                <div className="flex gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <MapPin size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Delivery address
                    </p>

                    <p className="mt-1 text-xs font-medium leading-5 text-gray-800">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Runner */}
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                      <User size={15} />
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Assigned runner
                      </p>

                      <p className="mt-1 text-xs font-semibold text-gray-800">
                        {order.runner || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  {order.runnerPhone &&
                    order.status === "In Transit" && (
                      <a
                        href={`tel:${order.runnerPhone}`}
                        className={[
                          "inline-flex items-center justify-center gap-2",
                          "rounded-xl bg-gray-900 px-4 py-2.5",
                          "text-[11px] font-semibold text-white",
                          "transition-all",
                          "hover:bg-gray-800",
                          "active:scale-[0.98]",
                        ].join(" ")}
                      >
                        <Phone size={13} />
                        Call Runner
                      </a>
                    )}
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Items                                                          */}
            {/* ------------------------------------------------------------ */}

            <section>
              <div className="mb-2 flex items-center gap-2 px-1">
                <Receipt size={13} className="text-gray-400" />

                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  Order items
                </h3>

                <span className="ml-auto text-[10px] text-gray-400">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${item.name}-${index}`}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 px-1.5 font-mono text-[10px] font-bold text-gray-600">
                          {item.qty}×
                        </span>

                        <span className="truncate text-xs font-medium text-gray-800">
                          {item.name}
                        </span>
                      </div>

                      <span className="shrink-0 font-mono text-xs font-semibold text-gray-900">
                        {formatCurrency(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Payment summary */}
                <div className="border-t border-gray-200 bg-gray-50/80 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500"
                      />

                      <span className="text-xs font-semibold text-gray-700">
                        Paid via M-Pesa
                      </span>
                    </div>

                    <span className="font-mono text-base font-bold text-gray-950">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Actions                                                         */}
            {/* ------------------------------------------------------------ */}

            <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:justify-end">
              {onReorder && (
                <button
                  type="button"
                  onClick={() => {
                    onReorder(order);
                    onClose();
                  }}
                  className={[
                    "inline-flex items-center justify-center gap-2",
                    "rounded-xl border border-gray-200",
                    "bg-white px-4 py-3",
                    "text-xs font-semibold text-gray-800",
                    "shadow-sm transition-all",
                    "hover:border-gray-300 hover:bg-gray-50",
                    "active:scale-[0.98]",
                  ].join(" ")}
                >
                  <RotateCcw size={14} />
                  Reorder
                </button>
              )}

              {order.status === "In Transit" && (
                <button
                  type="button"
                  onClick={() => {
                    // Connect your actual tracking/timeline flow here.
                  }}
                  className={[
                    "inline-flex items-center justify-center gap-2",
                    "rounded-xl bg-orange-500 px-4 py-3",
                    "text-xs font-semibold text-white",
                    "shadow-sm transition-all",
                    "hover:bg-orange-600",
                    "active:scale-[0.98]",
                  ].join(" ")}
                >
                  <Clock3 size={14} />
                  Track Order
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export function UserOrders({
  onBackToChat,
  onReorder,
}: UserOrdersProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  /*
   * The active order is now a full modal state rather than an
   * expanded card state.
   */
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    return (
      INITIAL_ORDERS.find(
        (order) => order.status === "In Transit"
      ) ?? null
    );
  });

  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [notification, setNotification] = useState<string | null>(
    null
  );

  const [orders] = useState<Order[]>(INITIAL_ORDERS);

  /* ---------------------------------------------------------------------- */
  /* Toast                                                                   */
  /* ---------------------------------------------------------------------- */

  const showToast = useCallback((message: string) => {
    setNotification(message);
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timeout = window.setTimeout(() => {
      setNotification(null);
    }, 2400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [notification]);

  /* ---------------------------------------------------------------------- */
  /* Tabs                                                                    */
  /* ---------------------------------------------------------------------- */

  const tabs = useMemo(
    () => [
      {
        id: "all",
        label: "All orders",
        mobileLabel: "All",
        icon: Package,
        count: orders.length,
      },
      {
        id: "transit",
        label: "In transit",
        mobileLabel: "Transit",
        icon: Truck,
        count: orders.filter(
          (order) => order.status === "In Transit"
        ).length,
      },
      {
        id: "delivered",
        label: "Delivered",
        mobileLabel: "History",
        icon: CheckCircle2,
        count: orders.filter(
          (order) => order.status === "Delivered"
        ).length,
      },
      {
        id: "cancelled",
        label: "Cancelled",
        mobileLabel: "Cancelled",
        icon: XCircle,
        count: orders.filter(
          (order) => order.status === "Cancelled"
        ).length,
      },
    ],
    [orders]
  );

  /* ---------------------------------------------------------------------- */
  /* Filtering                                                               */
  /* ---------------------------------------------------------------------- */

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "transit" &&
          order.status === "In Transit") ||
        (activeTab === "delivered" &&
          order.status === "Delivered") ||
        (activeTab === "cancelled" &&
          order.status === "Cancelled");

      if (!matchesTab) return false;

      if (!query) return true;

      return (
        order.id.toLowerCase().includes(query) ||
        order.vendor.toLowerCase().includes(query) ||
        order.deliveryAddress.toLowerCase().includes(query) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, activeTab, searchQuery]);

  /* ---------------------------------------------------------------------- */
  /* Clipboard                                                               */
  /* ---------------------------------------------------------------------- */

  const copyOrderId = useCallback(
    async (id: string) => {
      try {
        await navigator.clipboard.writeText(id);

        showToast(`Order ID ${id} copied`);
      } catch {
        showToast("Unable to copy order ID");
      }
    },
    [showToast]
  );

  /* ---------------------------------------------------------------------- */
  /* Refresh                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleReload = useCallback(() => {
    showToast("Orders refreshed");
  }, [showToast]);

  /* ---------------------------------------------------------------------- */
  /* Reset filters                                                           */
  /* ---------------------------------------------------------------------- */

  const resetFilters = useCallback(() => {
    setActiveTab("all");
    setSearchQuery("");
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Open Order                                                              */
  /* ---------------------------------------------------------------------- */

  const openOrder = useCallback((order: Order) => {
    setActiveOrder(order);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Close Order                                                             */
  /* ---------------------------------------------------------------------- */

  const closeOrder = useCallback(() => {
    setActiveOrder(null);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-0 font-sans backdrop-blur-sm">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#F8F8FA] text-gray-900 shadow-2xl">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <OrdersHeader
          onBackToChat={onBackToChat}
          handleReload={handleReload}
          notification={notification}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* ---------------------------------------------------------------- */}
        {/* Main                                                               */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Sidebar */}
          <OrdersSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isNavMinimized={isNavMinimized}
            setIsNavMinimized={setIsNavMinimized}
            tabs={tabs}
          />

          {/* ---------------------------------------------------------------- */}
          {/* Content                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex min-h-0 flex-1 flex-col">
            {/* Mobile top bar */}
            <div className="border-b border-gray-200/80 bg-white md:hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    My Orders
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    {filteredOrders.length}{" "}
                    {filteredOrders.length === 1
                      ? "order"
                      : "orders"}
                  </p>
                </div>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[11px] font-semibold text-orange-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Mobile search */}
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search orders..."
                    className={[
                      "h-10 w-full rounded-xl",
                      "border border-gray-200 bg-gray-50",
                      "pl-9 pr-3",
                      "text-xs text-gray-900",
                      "outline-none transition",
                      "placeholder:text-gray-400",
                      "focus:border-orange-300 focus:bg-white",
                      "focus:ring-4 focus:ring-orange-500/10",
                    ].join(" ")}
                  />
                </div>
              </div>

              {/* Mobile tabs */}
              <div className="scrollbar-none flex overflow-x-auto border-t border-gray-100 px-4">
                {tabs.map((tab) => {
                  const active = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        "relative shrink-0 px-4 py-3",
                        "text-[11px] font-semibold",
                        "transition-colors",
                        active
                          ? "text-orange-600"
                          : "text-gray-500 hover:text-gray-800",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-1.5">
                        {tab.mobileLabel}

                        <span
                          className={[
                            "rounded-md px-1.5 py-0.5",
                            "font-mono text-[9px]",
                            active
                              ? "bg-orange-50 text-orange-600"
                              : "bg-gray-100 text-gray-500",
                          ].join(" ")}
                        >
                          {tab.count}
                        </span>
                      </span>

                      {active && (
                        <motion.div
                          layoutId="mobile-order-tab"
                          className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-orange-500"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Scroll Area                                                       */}
            {/* ---------------------------------------------------------------- */}

            <main className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                {/* Desktop heading */}
                <div className="mb-5 hidden items-end justify-between md:flex">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onBackToChat}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white hover:text-gray-700"
                        aria-label="Back to chat"
                      >
                        <ArrowLeft size={15} />
                      </button>

                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                        SokoAI
                      </span>
                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-gray-950">
                      My Orders
                    </h1>

                    <p className="mt-1 text-xs text-gray-500">
                      Track, review and reorder your purchases.
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2.5 shadow-sm">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Total orders
                    </p>

                    <p className="mt-0.5 font-mono text-sm font-bold text-gray-900">
                      {orders.length}
                    </p>
                  </div>
                </div>

                {/* Desktop search */}
                <div className="mb-5 hidden md:block">
                  <div className="relative max-w-xl">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      placeholder="Search by order ID, store, address or item..."
                      className={[
                        "h-11 w-full rounded-xl",
                        "border border-gray-200 bg-white",
                        "pl-10 pr-4",
                        "text-xs text-gray-900",
                        "shadow-sm outline-none transition",
                        "placeholder:text-gray-400",
                        "focus:border-orange-300",
                        "focus:ring-4 focus:ring-orange-500/10",
                      ].join(" ")}
                    />
                  </div>
                </div>

                {/* Order list */}
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length > 0 ? (
                    <div className="space-y-3 grid grid-cols-1 md:grid-cols-3 gap-3 ">
                      {filteredOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onOpen={openOrder}
                          onCopy={copyOrderId}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white px-6 py-12 text-center shadow-sm"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-500">
                        <Package size={25} />
                      </div>

                      <h2 className="mt-4 text-sm font-bold text-gray-900">
                        No orders found
                      </h2>

                      <p className="mt-1.5 max-w-sm text-xs leading-5 text-gray-500">
                        There are no orders matching your current
                        search or status filter.
                      </p>

                      <button
                        type="button"
                        onClick={resetFilters}
                        className={[
                          "mt-5 inline-flex items-center gap-2",
                          "rounded-xl bg-gray-900 px-4 py-2.5",
                          "text-xs font-semibold text-white",
                          "transition-colors hover:bg-gray-800",
                          "active:scale-[0.98]",
                        ].join(" ")}
                      >
                        <RotateCcw size={13} />
                        Reset filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ACTIVE ORDER MODAL                                                  */}
        {/* ------------------------------------------------------------------ */}

        {activeOrder && (
          <OrderDetailsModal
            order={activeOrder}
            onClose={closeOrder}
            onCopy={copyOrderId}
            onReorder={onReorder}
          />
        )}
      </div>
    </div>
  );
}