// ============================================================
// ProductsPage.tsx — Feature: Products
// Shows a grid of all products.
// Features:
//   • Add new product (opens ProductModal)
//   • Edit existing product
//   • Toggle is_active
//   • Delete product (with ConfirmationModal)
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Tag, Coffee, Package } from 'lucide-react';
import { ProductService }    from '../api_services/product_service';
import { ProductModal }      from '../components/ProductModal';
import { LoadingSpinner }    from '../../../core/components/LoadingSpinner';
import { ConfirmationModal } from '../../../core/components/ConfirmationModal';
import type { Product, Category, CreateProductPayload } from '../../../core/types';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading,  setIsLoading]  = useState(true);

  // Modal states
  const [isModalOpen,      setIsModalOpen]      = useState(false);
  const [editingProduct,   setEditingProduct]   = useState<Product | null>(null);
  const [isSaving,         setIsSaving]         = useState(false);

  // Delete confirmation states
  const [deleteId,         setDeleteId]         = useState<string | null>(null);
  const [isDeleting,       setIsDeleting]       = useState(false);

  // ── 1. Fetch data ──
  const fetchData = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        ProductService.getProducts(),
        ProductService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products/categories:', err);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── 2. Add / Edit ──
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleSave = async (payload: CreateProductPayload) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id, payload);
        toast.success('Product updated');
      } else {
        await ProductService.createProduct(payload);
        toast.success('Product created');
      }
      await fetchData(); // Refresh list
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save failed:', err);
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  // ── 3. Toggle Active ──
  const handleToggleActive = async (product: Product) => {
    try {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
      await ProductService.toggleActive(product.id);
      toast.success(product.is_active ? 'Product deactivated' : 'Product activated');
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: product.is_active } : p));
      console.error('Toggle failed:', err);
      toast.error('Failed to toggle status');
    }
  };

  // ── 4. Delete ──
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await ProductService.deleteProduct(deleteId);
      setProducts(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
      toast.success('Product deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Cannot delete this product (it may be linked to existing orders).');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-[1200px] mx-auto animate-[fadeIn_0.3s_ease]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-text-main mb-1">Menu Products</h1>
          <p className="text-sm text-text-muted">Manage your coffee shop menu</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-hover transition-colors" onClick={handleOpenAdd}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {products.map(product => (
          <div key={product.id} className={`bg-surface rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${!product.is_active ? 'opacity-60 grayscale-[50%]' : ''}`}>
            
            {/* Image section */}
            <div className="w-full aspect-[16/10] relative bg-[#F3F4F6]">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Coffee size={32} color="#9CA3AF" />
                </div>
              )}
              {/* Category Badge overlay */}
              <div className="absolute top-3 left-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                <Tag size={12} />
                <span>{product.categories?.name ?? 'Uncategorized'}</span>
              </div>
            </div>

            {/* Info section */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-base font-semibold text-text-main mb-1">{product.name}</h3>
              <p className="text-[13px] text-text-muted mb-4 flex-1">{product.description || 'No description'}</p>
              
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#F1F5F9]">
                <span className="text-lg font-bold text-text-main">EGP {Number(product.price).toFixed(2)}</span>
                
                {/* Active Toggle */}
                <label className="toggle-switch" title={product.is_active ? 'Active' : 'Inactive'}>
                  <input
                    type="checkbox"
                    checked={product.is_active}
                    onChange={() => handleToggleActive(product)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] text-text-main flex items-center justify-center hover:bg-[#E5E7EB] transition-colors" onClick={() => handleOpenEdit(product)} title="Edit">
                  <Edit2 size={16} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#FEE2E2] text-error flex items-center justify-center hover:bg-[#FECACA] transition-colors" onClick={() => setDeleteId(product.id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-text-muted text-base font-medium gap-4">
          <Package size={48} color="#D1D5DB" />
          <p>No products found.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        categories={categories}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />

    </div>
  );
}
