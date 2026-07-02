import React, { useState, useEffect } from "react";
import { useProduct } from "../../Providers/ProductsProvider";
import type { ProductType } from "../../Providers/ProductsProvider";
import { ChevronLeft } from "lucide-react";

interface OnboardProductFormProps {
    onClose: () => void;
}

export default function OnboardProductForm({ onClose }: OnboardProductFormProps) {
    const { onboardProduct, isLoading } = useProduct();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        brand: "",
        color: "",
        size: "",
        shape: "",
        originalPrice: "",
        dealPrice: "",
        stockQuantity: "",
        minimumStockThreshold: "5",
        isNew: true,
        isRefurbished: false,
        isPhysical: true,
    });

    const [primaryFile, setPrimaryFile] = useState<File | null>(null);
    const [secondaryFiles, setSecondaryFiles] = useState<File[]>([]);
    const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
    const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);

    // Safely generate and revoke Object URLs to prevent memory leaks
    useEffect(() => {
        if (!primaryFile) {
            setPrimaryPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(primaryFile);
        setPrimaryPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [primaryFile]);

    useEffect(() => {
        const urls = secondaryFiles.map(file => URL.createObjectURL(file));
        setSecondaryPreviews(urls);
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [secondaryFiles]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSecondaryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // HTML file inputs don't support `max="3"`, so we enforce it in JS
            const filesArray = Array.from(e.target.files).slice(0, 3);
            setSecondaryFiles(filesArray);
        }
    };

    const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const generateSku = (title: string, category: string) => {
        const prefix = (category || "GEN").substring(0, 3).toUpperCase();
        const titlePart = title.substring(0, 3).toUpperCase() || "PRD";
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${titlePart}-${random}`;
    };

    const generateTags = (title: string, description: string) => {
        const combined = `${title} ${description}`.toLowerCase();
        return Array.from(new Set(combined.match(/\b\w{4,}\b/g) || [])).slice(0, 10);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);

        const completeProductPayload: ProductType = {
            unique_id: crypto.randomUUID(),
            merchant: null, // Ready to be populated when merchants authenticate
            title: formData.title,
            description: formData.description,
            category: formData.category || null,
            brand: formData.brand || null,
            categoryPersist: formData.category || "Uncategorized",
            color: formData.color || null,
            size: formData.size || null,
            shape: formData.shape || null,
            isNew: formData.isNew,
            isRefurbished: formData.isRefurbished,
            slug: generateSlug(formData.title),
            sku: generateSku(formData.title, formData.category),
            searchTags: generateTags(formData.title, formData.description),
            userAddedSearchTags: [],
            originalPrice: Number(formData.originalPrice) || 0,
            dealPrice: Number(formData.dealPrice) || 0,
            priceChangeRecord: [],
            priceCompetitionRecord: [],
            weightKg: formData.isPhysical ? 1.0 : 0,
            isPhysical: formData.isPhysical,
            isTaxExempt: false,
            primaryImageUrl: primaryPreview, // Usually, you'd upload the File to a bucket (S3/Cloudinary) and pass the real URL here
            secondaryImages: secondaryPreviews,
            isAvailable: true,
            clickCount: 0,
            minimumStockThreshold: Number(formData.minimumStockThreshold) || 5,
            stockQuantity: Number(formData.stockQuantity) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await onboardProduct(completeProductPayload);
        setSuccessMessage(`Exquisite! Product onboarded successfully. SKU: ${completeProductPayload.sku}`);

        // Optional: Clear form or redirect after success
    };

    return (
        <div className="min-h-screen bg-green-500/40 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-violet-200 selection:text-violet-900">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="mb-12 text-center md:text-left">
                    <div className="flex flex-row items-center gap-5 mb-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex flex-row items-center bg-black py-2 px-3 cursor-pointer hover:bg-red-500 pl-1 rounded-2xl transition-colors"
                        >
                            <ChevronLeft size={20} color="White" />
                            <span className="text-white font-bold ml-1">Close</span>
                        </button>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Curate: Add New Product
                        </h1>
                    </div>
                    <p className="text-base text-gray-800 font-medium max-w-xl">
                        Add a new piece to the marketplace catalog. Precision in details yields perfection in presentation.
                    </p>
                </div>

                {successMessage && (
                    <div className="mb-8 p-5 rounded-2xl bg-violet-50 border border-violet-100 flex items-center shadow-sm animate-fade-in-down">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <p className="text-violet-900 text-sm font-medium tracking-wide">{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Core Information Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_40px_rgb(0,0,0,0.03)] border border-gray-100/50 transition-all duration-300 hover:shadow-[0_4px_40px_rgb(0,0,0,0.06)]">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-100">
                            Core Identity
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                            <div className="col-span-1 md:col-span-2 group">
                                <label htmlFor="title" className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2 transition-colors group-focus-within:text-violet-600">Product Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50/50 border border-orange-400 px-4 py-3 text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all outline-none rounded-xl font-medium placeholder-gray-300"
                                    placeholder="e.g. The Midnight Chronograph"
                                />
                            </div>

                            <div className="group">
                                <label htmlFor="category" className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2 transition-colors group-focus-within:text-violet-600">Category *</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50/50 border border-orange-400 px-4 py-3 text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all outline-none rounded-xl font-medium placeholder-gray-300"
                                    placeholder="e.g. Accessories"
                                />
                            </div>

                            <div className="group">
                                <label htmlFor="brand" className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2 transition-colors group-focus-within:text-violet-600">Brand *</label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50/50 border border-orange-400 px-4 py-3 text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all outline-none rounded-xl font-medium placeholder-gray-300"
                                    placeholder="e.g. Maison"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-4 group">
                                <label htmlFor="description" className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2 transition-colors group-focus-within:text-violet-600">Description & Details *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    className="w-full bg-gray-50/50 border border-orange-400 px-4 py-3 text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all outline-none rounded-xl font-medium placeholder-gray-300 resize-none"
                                    placeholder="Craft a compelling narrative for this item..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Upload Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_40px_rgb(0,0,0,0.03)] border border-gray-100/50 transition-all duration-300 hover:shadow-[0_4px_40px_rgb(0,0,0,0.06)]">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-100">
                            Visual Assets
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                            {/* Primary Image */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-4">Hero Image</label>
                                <div className="relative group aspect-[4/5] bg-gray-50 rounded-2xl border-2 border-dashed border-orange-400 flex flex-col items-center justify-center overflow-hidden hover:border-violet-400 hover:bg-violet-50/30 transition-all duration-300 cursor-pointer">
                                    {primaryPreview ? (
                                        <img src={primaryPreview} alt="Hero Preview" className="  max-w-[100%] max-h-auto   object-cover  transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="text-center p-6">
                                            <div className="w-12 h-12 mb-4 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-violet-500 group-hover:scale-110 transition-all">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-violet-600 transition-colors">Upload Base Image</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPrimaryFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                    />
                                </div>
                            </div>


                            {/* Secondary Images */}
                            <div className="col-span-1 md:col-span-3">
                                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-4">Gallery Grid (Max 3)</label>
                                <div className="relative group h-full min-h-[200px] bg-gray-50 rounded-2xl border-2 border-dashed border-orange-400 flex flex-col items-center justify-center hover:border-violet-400 hover:bg-violet-50/30 transition-all duration-300 p-6">
                                    {secondaryPreviews.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-3 w-full">
                                            {secondaryPreviews.map((src, idx) => (
                                                <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-sm relative group/img">
                                                    <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors"></div>
                                                </div>
                                            ))}
                                            {secondaryPreviews.length < 3 && (
                                                <div className="aspect-square rounded-xl border border-dashed border-orange-400 flex items-center justify-center text-gray-400 bg-white">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-12 h-12 mb-4 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 group-hover:text-violet-500 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-violet-600 transition-colors">Add Supporting Images</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleSecondaryFiles}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Economics & Logistics Card */}
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_40px_rgb(0,0,0,0.03)] border border-gray-100/50 transition-all duration-300 hover:shadow-[0_4px_40px_rgb(0,0,0,0.06)]">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 pb-4 border-b border-gray-100">
                            Economics & Attributes
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                            <div className="group">
                                <label htmlFor="originalPrice" className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2 transition-colors group-focus-within:text-violet-600">Retail Price (KSH) *</label>
                                <input
                                    type="number"
                                    id="originalPrice"
                                    name="originalPrice"
                                    min={1}
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    required
                                    step="1"
                                    className="w-full bg-gray-50/50 border border-orange-400 pl-8 pr-4 py-3 text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all outline-none rounded-xl text-lg font-medium placeholder-gray-300"
                                    placeholder="0"
                                />
                            </div>

                            <div className="group">
                                <label htmlFor="dealPrice" className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2 transition-colors group-focus-within:text-violet-600">Deal Price (KSH)</label>
                                <input
                                    type="number"
                                    id="dealPrice"
                                    name="dealPrice"
                                    value={formData.dealPrice}
                                    min={1}
                                    onChange={handleChange}
                                    step="1"
                                    className="w-full bg-gray-50/50 border border-orange-400 pl-8 pr-4 py-3 text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all outline-none rounded-xl text-lg font-medium placeholder-gray-300"
                                    placeholder="0"
                                />
                            </div>

                            <div className="group">
                                <label htmlFor="stockQuantity" className="block text-[11px] uppercase tracking-wider font-semibold text-gray-500 mb-2 transition-colors group-focus-within:text-violet-600">Initial Stock *</label>
                                <input
                                    type="number"
                                    id="stockQuantity"
                                    name="stockQuantity"
                                    min={1}
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-gray-50/50 border border-orange-400 pl-8 pr-4 py-3 text-gray-900 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all outline-none rounded-xl text-lg font-medium placeholder-gray-300"
                                    placeholder="0"
                                />
                            </div>
                        </div>




                        {/* Luxury Custom Toggles */}
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-4">
                            <label className="flex items-center space-x-4 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleCheckboxChange} className="peer sr-only" />
                                    <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all duration-200"></div>
                                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span className="text-sm font-medium tracking-wide text-gray-700 group-hover:text-gray-900 transition-colors">Pristine (Brand New)</span>
                            </label>

                            <label className="flex items-center space-x-4 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" name="isRefurbished" checked={formData.isRefurbished} onChange={handleCheckboxChange} className="peer sr-only" />
                                    <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all duration-200"></div>
                                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span className="text-sm font-medium tracking-wide text-gray-700 group-hover:text-gray-900 transition-colors">Refurbished</span>
                            </label>

                            <label className="flex items-center space-x-4 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" name="isPhysical" checked={formData.isPhysical} onChange={handleCheckboxChange} className="peer sr-only" />
                                    <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all duration-200"></div>
                                    <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <span className="text-sm font-medium tracking-wide text-gray-700 group-hover:text-gray-900 transition-colors">Physical Item</span>
                            </label>

                        </div>


                    </div>


                    {/* Action Footer */}
                    <div className="pt-6 flex justify-end">
                        <button type="submit" disabled={isLoading} className="relative overflow-hidden group w-full md:w-auto px-12 py-4 bg-gray-900 text-white font-semibold tracking-widest uppercase text-sm rounded-full shadow-[0_10px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Curating...
                                    </>
                                ) : "Publish to Catalog"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}