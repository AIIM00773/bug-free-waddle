
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Award,
  Check,
  Clock3,
  DollarSign,
  MapPin,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Tag,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

/* ============================================================
   TYPES
============================================================ */

type FilterValue = string | number | boolean;

export interface SearchFilters {
  category: string;
  sortBy: string;
  maxPrice: number;
  maxDistanceKm: number;
  verifiedFreshToday: boolean;
  instantRunnerReady: boolean;
  directMerchantPricing: boolean;
}

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters?: Partial<SearchFilters>;
  onApply: (filters: SearchFilters) => void;
}

/* ============================================================
   DEFAULTS
============================================================ */

const DEFAULT_FILTERS: SearchFilters = {
  category: "all",
  sortBy: "shortest_distance",
  maxPrice: 2000,
  maxDistanceKm: 3,
  verifiedFreshToday: true,
  instantRunnerReady: false,
  directMerchantPricing: true,
};

/* ============================================================
   OPTIONS
============================================================ */

const SORT_OPTIONS = [
  {
    label: "Nearest",
    description: "Closest merchants first",
    value: "shortest_distance",
  },
  {
    label: "Lowest price",
    description: "Best available price",
    value: "lowest_price",
  },
  {
    label: "Highest rated",
    description: "Top-rated merchants",
    value: "highest_rated",
  },
  {
    label: "Fresh restock",
    description: "Recently restocked",
    value: "newest_restock",
  },
];

const CATEGORY_OPTIONS = [
  {
    label: "All items",
    value: "all",
  },
  {
    label: "Fresh produce",
    value: "produce",
  },
  {
    label: "Butcher & meats",
    value: "butchery",
  },
  {
    label: "Groceries",
    value: "groceries",
  },
  {
    label: "Household",
    value: "household",
  },
];

const DISTANCE_OPTIONS = [
  {
    label: "1 km",
    value: 1,
  },
  {
    label: "3 km",
    value: 3,
  },
  {
    label: "5 km",
    value: 5,
  },
  {
    label: "Any",
    value: 10,
  },
];

const PRICE_PRESETS = [
  {
    label: "KES 200",
    value: 200,
  },
  {
    label: "KES 500",
    value: 500,
  },
  {
    label: "KES 1,000",
    value: 1000,
  },
  {
    label: "KES 3,000",
    value: 3000,
  },
];

/* ============================================================
   HELPERS
============================================================ */

const mergeFilters = (
  initial?: Partial<SearchFilters>
): SearchFilters => ({
  ...DEFAULT_FILTERS,
  ...initial,
});

const formatKES = (value: number) =>
  `KES ${value.toLocaleString("en-KE")}`;

/* ============================================================
   SECTION
============================================================ */

interface FilterSectionProps {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function FilterSection({
  title,
  description,
  icon: Icon,
  children,
}: FilterSectionProps) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon size={13} />
        </div>

        <div className="min-w-0">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-800">
            {title}
          </h3>

          {description && (
            <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400">
              {description}
            </p>
          )}
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}

/* ============================================================
   OPTION PILLS
============================================================ */

interface PillOption<T extends string | number> {
  label: string;
  value: T;
}

interface PillSelectProps<T extends string | number> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function PillSelect<T extends string | number>({
  options,
  value,
  onChange,
}: PillSelectProps<T>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        const selected =
          option.value === value;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() =>
              onChange(option.value)
            }
            aria-pressed={selected}
            className={[
              "relative min-h-[42px] rounded-xl border px-3 py-2 text-left transition-all duration-200",
              selected
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            ].join(" ")}
          >
            <span className="block text-[10px] font-semibold leading-tight">
              {option.label}
            </span>

            {selected && (
              <span className="absolute right-2.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-white/15">
                <Check size={10} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   TOGGLE
============================================================ */

interface FilterToggleProps {
  label: string;
  description: string;
  icon: React.ElementType;
  active: boolean;
  onChange: () => void;
}

function FilterToggle({
  label,
  description,
  icon: Icon,
  active,
  onChange,
}: FilterToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={active}
      className={[
        "group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200",
        active
          ? "border-slate-900/10 bg-slate-900 text-white shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-white/10 text-white"
            : "bg-slate-100 text-slate-500 group-hover:text-slate-800",
        ].join(" ")}
      >
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={[
            "block text-[11px] font-bold",
            active
              ? "text-white"
              : "text-slate-800",
          ].join(" ")}
        >
          {label}
        </span>

        <span
          className={[
            "mt-0.5 block text-[9px] leading-relaxed",
            active
              ? "text-white/55"
              : "text-slate-400",
          ].join(" ")}
        >
          {description}
        </span>
      </div>

      {/* Switch */}
      <span
        className={[
          "relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
          active
            ? "bg-orange-500"
            : "bg-slate-200",
        ].join(" ")}
      >
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="h-4 w-4 rounded-full bg-white shadow-sm"
        />
      </span>
    </button>
  );
}

/* ============================================================
   PRICE RANGE
============================================================ */

interface PriceRangeProps {
  value: number;
  onChange: (value: number) => void;
}

function PriceRange({
  value,
  onChange,
}: PriceRangeProps) {
  const percentage =
    ((value - 100) / (5000 - 100)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
            Maximum budget
          </p>

          <p className="mt-1 font-mono text-base font-black text-slate-900">
            {formatKES(value)}
          </p>
        </div>

        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-400">
          Ceiling
        </span>
      </div>

      <div className="relative">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />

        {/* Filled track */}
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-900"
          style={{
            width: `${percentage}%`,
          }}
        />

        <input
          type="range"
          min={100}
          max={5000}
          step={100}
          value={value}
          onChange={(event) =>
            onChange(
              Number(event.target.value)
            )
          }
          aria-label="Maximum budget"
          className="relative z-10 h-5 w-full cursor-pointer appearance-none bg-transparent accent-slate-900"
        />
      </div>

      <div className="flex justify-between text-[9px] font-medium text-slate-400">
        <span>KES 100</span>
        <span>KES 5,000+</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRICE_PRESETS.map((preset) => {
          const selected =
            value === preset.value;

          return (
            <button
              key={preset.value}
              type="button"
              onClick={() =>
                onChange(preset.value)
              }
              className={[
                "rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition",
                selected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800",
              ].join(" ")}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   ACTIVE FILTER COUNT
============================================================ */

function getActiveFilterCount(
  filters: SearchFilters
) {
  let count = 0;

  if (filters.category !== "all")
    count++;

  if (
    filters.sortBy !==
    DEFAULT_FILTERS.sortBy
  )
    count++;

  if (
    filters.maxPrice !==
    DEFAULT_FILTERS.maxPrice
  )
    count++;

  if (
    filters.maxDistanceKm !==
    DEFAULT_FILTERS.maxDistanceKm
  )
    count++;

  if (
    filters.verifiedFreshToday !==
    DEFAULT_FILTERS.verifiedFreshToday
  )
    count++;

  if (
    filters.instantRunnerReady !==
    DEFAULT_FILTERS.instantRunnerReady
  )
    count++;

  if (
    filters.directMerchantPricing !==
    DEFAULT_FILTERS.directMerchantPricing
  )
    count++;

  return count;
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export function FilterSidebar({
  isOpen,
  onClose,
  initialFilters,
  onApply,
}: FilterSidebarProps) {
  const [filters, setFilters] =
    useState<SearchFilters>(() =>
      mergeFilters(initialFilters)
    );

  /* ----------------------------------------------------------
     Sync filters when panel opens
  ---------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    setFilters(
      mergeFilters(initialFilters)
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen, initialFilters]);

  /* ----------------------------------------------------------
     Update helper
  ---------------------------------------------------------- */

  const update = <
    K extends keyof SearchFilters
  >(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* ----------------------------------------------------------
     Derived values
  ---------------------------------------------------------- */

  const activeFilterCount = useMemo(
    () => getActiveFilterCount(filters),
    [filters]
  );

  /* ----------------------------------------------------------
     Reset
  ---------------------------------------------------------- */

  const resetFilters = () => {
    setFilters(
      mergeFilters(initialFilters)
    );
  };

  /* ----------------------------------------------------------
     Apply
  ---------------------------------------------------------- */

  const applyFilters = () => {
    onApply(filters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] font-sans">

          {/* ==================================================
              BACKDROP
          ================================================== */}

          <motion.button
            type="button"
            aria-label="Close filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-slate-950/35 backdrop-blur-[2px]"
          />

          {/* ==================================================
              DRAWER
          ================================================== */}

          <motion.aside
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
              mass: 0.8,
            }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl"
          >

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="shrink-0 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">

              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                    <SlidersHorizontal size={17} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-sm font-black tracking-tight text-slate-950">
                        Search Filters
                      </h2>

                      {activeFilterCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 font-mono text-[9px] font-bold text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-[9px] font-medium text-slate-400">
                      Refine nearby merchant results
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Header actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Soko AI ranking enabled
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[9px] font-bold text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
              </div>
            </header>

            {/* =================================================
                SCROLL CONTENT
            ================================================= */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

              <div className="space-y-7 px-5 py-6 sm:px-6">

                {/* =================================================
                    SORT
                ================================================= */}

                <FilterSection
                  title="Sort results"
                  description="Choose how Soko AI should rank matching products."
                  icon={Tag}
                >
                  <div className="space-y-2">
                    {SORT_OPTIONS.map(
                      (option) => {
                        const selected =
                          filters.sortBy ===
                          option.value;

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              update(
                                "sortBy",
                                option.value
                              )
                            }
                            className={[
                              "flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all",
                              selected
                                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                            ].join(" ")}
                          >
                            <div className="min-w-0">
                              <span
                                className={[
                                  "block text-[10px] font-bold",
                                  selected
                                    ? "text-white"
                                    : "text-slate-800",
                                ].join(" ")}
                              >
                                {
                                  option.label
                                }
                              </span>

                              <span
                                className={[
                                  "mt-0.5 block text-[9px]",
                                  selected
                                    ? "text-white/50"
                                    : "text-slate-400",
                                ].join(" ")}
                              >
                                {
                                  option.description
                                }
                              </span>
                            </div>

                            <span
                              className={[
                                "ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                                selected
                                  ? "border-white/20 bg-white/10"
                                  : "border-slate-200",
                              ].join(" ")}
                            >
                              {selected && (
                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                              )}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </FilterSection>

                {/* =================================================
                    CATEGORY
                ================================================= */}

                <FilterSection
                  title="Merchant category"
                  description="Limit results to a specific neighborhood category."
                  icon={Store}
                >
                  <PillSelect
                    options={
                      CATEGORY_OPTIONS
                    }
                    value={
                      filters.category
                    }
                    onChange={(value) =>
                      update(
                        "category",
                        value
                      )
                    }
                  />
                </FilterSection>

                {/* =================================================
                    DISTANCE
                ================================================= */}

                <FilterSection
                  title="Delivery radius"
                  description="How far should Soko AI search from your location?"
                  icon={MapPin}
                >
                  <div className="grid grid-cols-4 gap-1.5">
                    {DISTANCE_OPTIONS.map(
                      (option) => {
                        const selected =
                          filters.maxDistanceKm ===
                          option.value;

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              update(
                                "maxDistanceKm",
                                option.value
                              )
                            }
                            className={[
                              "rounded-xl border py-2.5 text-center text-[9px] font-bold transition",
                              selected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800",
                            ].join(" ")}
                          >
                            {option.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </FilterSection>

                {/* =================================================
                    BUDGET
                ================================================= */}

                <FilterSection
                  title="Maximum budget"
                  description="Only show products within your selected spending ceiling."
                  icon={DollarSign}
                >
                  <PriceRange
                    value={
                      filters.maxPrice
                    }
                    onChange={(value) =>
                      update(
                        "maxPrice",
                        value
                      )
                    }
                  />
                </FilterSection>

                {/* =================================================
                    QUALITY + FULFILLMENT
                ================================================= */}

                <FilterSection
                  title="Quality & fulfillment"
                  description="Tell Soko AI what matters most for this search."
                  icon={ShieldCheck}
                >
                  <div className="space-y-2">
                    <FilterToggle
                      label="Fresh today"
                      description="Prioritize stock recently restocked by local merchants."
                      icon={Sparkles}
                      active={
                        filters.verifiedFreshToday
                      }
                      onChange={() =>
                        update(
                          "verifiedFreshToday",
                          !filters.verifiedFreshToday
                        )
                      }
                    />

                    <FilterToggle
                      label="Runner ready"
                      description="Prioritize products that can be dispatched quickly."
                      icon={Clock3}
                      active={
                        filters.instantRunnerReady
                      }
                      onChange={() =>
                        update(
                          "instantRunnerReady",
                          !filters.instantRunnerReady
                        )
                      }
                    />

                    <FilterToggle
                      label="Direct merchant price"
                      description="Prefer prices supplied directly by the local seller."
                      icon={Award}
                      active={
                        filters.directMerchantPricing
                      }
                      onChange={() =>
                        update(
                          "directMerchantPricing",
                          !filters.directMerchantPricing
                        )
                      }
                    />
                  </div>
                </FilterSection>

                {/* =================================================
                    SEARCH INTELLIGENCE NOTE
                ================================================= */}

                <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50/40 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm">
                      <Sparkles
                        size={14}
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-orange-900">
                        Soko AI search intelligence
                      </p>

                      <p className="mt-1 text-[9px] leading-relaxed text-orange-900/60">
                        These preferences influence
                        ranking and merchant matching.
                        They do not permanently change
                        your search profile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="shrink-0 border-t border-slate-100 bg-white/95 p-4 backdrop-blur-md sm:p-5">

              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[9px] font-medium text-slate-400">
                  {activeFilterCount ===
                  0
                    ? "Default search"
                    : `${activeFilterCount} custom ${
                        activeFilterCount ===
                        1
                          ? "filter"
                          : "filters"
                      }`}
                </span>

                <span className="font-mono text-[9px] font-semibold text-slate-500">
                  {formatKES(
                    filters.maxPrice
                  )}{" "}
                  max
                </span>
              </div>

              <button
                type="button"
                onClick={applyFilters}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 text-[11px] font-bold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 active:scale-[0.99]"
              >
                <Check
                  size={14}
                  strokeWidth={2.5}
                />

                Apply filters

                <motion.span
                  initial={{
                    opacity: 0,
                    x: -3,
                  }}
                  whileHover={{
                    opacity: 1,
                    x: 0,
                  }}
                >
                  →
                </motion.span>
              </button>
            </footer>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}


