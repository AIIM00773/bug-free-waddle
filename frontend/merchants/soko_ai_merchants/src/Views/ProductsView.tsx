import { useState } from 'react';
import OnboardProductForm from './onboarding/ProductOnboarding';
import { PlusSquare, Search, Filter, MoreVertical,  Package, AlertCircle, CheckCircle2, XCircle, Edit, Trash2, ArrowUpDown} from 'lucide-react';




// Mock data reflecting a structured Django product model
const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Samsung 55" 4K Smart TV',
    sku: 'SM-TV-55-4K',
    category: 'Electronics',
    price: 65000.00,
    stock: 24,
    status: 'active',
    imageUrl: 'https://placehold.co/100x100/e2e8f0/64748b?text=TV'
  },
  {
    id: 'prod-002',
    name: 'Nike Air Zoom Pegasus 39',
    sku: 'NK-AZP-39-BLK',
    category: 'Fashion',
    price: 12500.00,
    stock: 4, // Low stock example
    status: 'active',
    imageUrl: 'https://placehold.co/100x100/e2e8f0/64748b?text=Shoe'
  },
  {
    id: 'prod-003',
    name: 'NutriBullet Pro 900W Blender',
    sku: 'NB-PRO-900',
    category: 'Home & Kitchen',
    price: 9999.00,
    stock: 0, // Out of stock example
    status: 'inactive',
    imageUrl: 'https://placehold.co/100x100/e2e8f0/64748b?text=Blender'
  },
  {
    id: 'prod-004',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    sku: 'SNY-WH-XM5',
    category: 'Electronics',
    price: 34500.00,
    stock: 15,
    status: 'active',
    imageUrl: 'https://placehold.co/100x100/e2e8f0/64748b?text=Audio'
  }
];



export function ProductsView() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnboarding, setIsOnboarding] = useState(false); 
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };



  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };



  const toggleStockSort = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };



  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const processedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortDirection) return 0;
    return sortDirection === 'asc' ? a.stock - b.stock : b.stock - a.stock;
  });



  if (isOnboarding) {return <OnboardProductForm onClose={() => setIsOnboarding(false)} />}

  return (
    <div className="flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your inventory, pricing, and product visibility.
          </p>
        </div>
        <button
          onClick={() => setIsOnboarding(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <PlusSquare size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <Package size={20} className="text-emerald-600" />
            <h3 className="text-sm font-medium">Total Products</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalProducts}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <CheckCircle2 size={20} className="text-blue-600" />
            <h3 className="text-sm font-medium">Active Listings</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{activeProducts}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500">
            <AlertCircle size={20} className="text-rose-500" />
            <h3 className="text-sm font-medium">Low Stock Alert</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{lowStockProducts}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">

        {/* Toolbar (Search & Filter) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Filter size={16} className="text-slate-400" />
            <span>Filter</span>
          </button>
        </div>

        {/* Data Table */}
        {processedProducts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-400">
              <Package size={24} />
            </div>
            <p className="text-sm font-medium text-slate-900">No products found.</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your search or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Product</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Category</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Price</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">
                    <button
                      onClick={toggleStockSort}
                      className="flex items-center gap-1 cursor-pointer hover:text-emerald-600 font-semibold focus:outline-none"
                    >
                      Stock <ArrowUpDown size={14} className={sortDirection ? 'text-emerald-600' : 'text-slate-400'} />
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold text-slate-900 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {processedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Product Name & Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      {formatCurrency(product.price)}
                    </td>

                    {/* Stock Level */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {product.stock === 0 ? (
                          <span className="flex h-2 w-2 rounded-full bg-rose-500"></span>
                        ) : product.stock <= 5 ? (
                          <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                        ) : (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        )}
                        <span className="text-slate-700 font-medium">
                          {product.stock} <span className="text-slate-400 font-normal">units</span>
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions Menu */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}