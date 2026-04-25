// ============================================================
// ProductModal.tsx — Feature: Products
// Add / Edit product modal form.
// Used for both creating a new product and editing an existing
// one. When `product` prop is provided → edit mode (pre-fills
// fields); otherwise → create mode.
//
// Fields: name, description, price, image_url, category_id
// ============================================================

import React, { useState, useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { supabase } from '../../../core/lib/supabase';
import type { Product, Category, CreateProductPayload } from '../../../core/types';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  product?: Product | null;
  categories: Category[];
  onSave: (payload: CreateProductPayload) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const EMPTY_FORM: CreateProductPayload = {
  name: '', description: '', price: 0, image_url: '', category_id: '',
};

export const ProductModal: React.FC<Props> = ({
  isOpen, product, categories, onSave, onClose, isSaving,
}) => {
  const [form, setForm] = useState<CreateProductPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name:        product.name,
        description: product.description ?? '',
        price:       product.price,
        image_url:   product.image_url ?? '',
        category_id: product.category_id,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setImageFile(null);
  }, [product, isOpen]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim())        e.name        = 'Name is required';
    if (form.price <= 0)          e.price       = 'Price must be > 0';
    if (!form.category_id)        e.category_id = 'Please select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setForm(prev => ({ ...prev, image_url: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let payload = { ...form };

    // Upload image if a new file is selected
    if (imageFile) {
      setIsUploading(true);
      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        payload.image_url = publicUrl;
      } catch (err: any) {
        toast.error(`Image upload failed: ${err.message}`);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    await onSave(payload);
  };

  const set = (field: keyof CreateProductPayload, val: string | number) =>
    setForm(prev => ({ ...prev, [field]: val }));

  if (!isOpen) return null;

  const savingState = isSaving || isUploading;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50 backdrop-blur-[2px] p-6 overflow-hidden" onClick={onClose}>
      <div className="bg-surface rounded-[24px] p-8 w-full max-w-[600px] shadow-lg animate-modalScale relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[24px] font-semibold text-text-main">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] text-text-main flex items-center justify-center hover:bg-[#E5E7EB] transition-colors" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main">Product Name *</label>
            <input
              className={`w-full h-[52px] border rounded-xl px-4 font-sans text-[15px] text-text-main bg-[#F8FAFC] transition-colors focus:bg-white outline-none ${errors.name ? 'border-error focus:border-error' : 'border-[#E2E8F0] focus:border-primary'}`}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Iced Caramel Latte"
            />
            {errors.name && <p className="text-xs text-error mt-0.5">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main">Description</label>
            <textarea
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 font-sans text-[15px] text-text-main bg-[#F8FAFC] transition-colors focus:border-primary focus:bg-white outline-none resize-y min-h-[100px]"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Short product description…"
              rows={2}
            />
          </div>

          {/* Price + Category side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-main">Price (EGP) *</label>
              <input
                type="number"
                min={0}
                step={0.5}
                className={`w-full h-[52px] border rounded-xl px-4 font-sans text-[15px] text-text-main bg-[#F8FAFC] transition-colors focus:bg-white outline-none ${errors.price ? 'border-error focus:border-error' : 'border-[#E2E8F0] focus:border-primary'}`}
                value={form.price}
                onChange={e => set('price', parseFloat(e.target.value) || 0)}
              />
              {errors.price && <p className="text-xs text-error mt-0.5">{errors.price}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-main">Category *</label>
              <select
                className={`w-full h-[52px] border rounded-xl px-4 font-sans text-[15px] text-text-main bg-[#F8FAFC] transition-colors focus:bg-white outline-none ${errors.category_id ? 'border-error focus:border-error' : 'border-[#E2E8F0] focus:border-primary'}`}
                value={form.category_id}
                onChange={e => set('category_id', e.target.value)}
              >
                <option value="">Select category…</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="text-xs text-error mt-0.5">{errors.category_id}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full h-[52px] border-2 border-dashed border-[#E2E8F0] rounded-xl bg-[#F8FAFC] cursor-pointer hover:bg-white hover:border-primary transition-colors text-text-muted text-sm gap-2">
                  <UploadCloud size={18} />
                  <span>Choose Image File</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-sm text-text-muted px-2">OR</span>
                <input
                  className="w-full h-[52px] border border-[#E2E8F0] rounded-xl px-4 font-sans text-[15px] text-text-main bg-[#F8FAFC] transition-colors focus:border-primary focus:bg-white outline-none"
                  value={form.image_url}
                  onChange={e => { setImageFile(null); set('image_url', e.target.value); }}
                  placeholder="Paste image URL…"
                />
              </div>
            </div>
            {/* Preview */}
            {form.image_url && (
              <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 pt-6 border-t border-[#F1F5F9] justify-end">
            <button type="button" className="px-6 py-3 border border-[#E5E7EB] text-text-main rounded-xl font-semibold text-sm bg-white hover:bg-[#F3F4F6] transition-colors" onClick={onClose} disabled={savingState}>
              Cancel
            </button>
            <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover disabled:opacity-70 transition-colors" disabled={savingState}>
              {savingState ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
