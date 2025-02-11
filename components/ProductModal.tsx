"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from 'react-toastify';
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        toast("Saving product...", { type: "info" });
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
      
    }
  
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white text-black bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500 p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Add New Product
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
                <ToastContainer />
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select name="category" className="w-full rounded border p-2">
                  <option value="Sofas">Sofas</option>
                  <option value="Chairs">Chairs</option>
                  <option value="Tables">Tables</option>
                  <option value="Beds">Beds</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input
                  type="number"
                  name="rating"
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full rounded border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full rounded border p-2"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                 Save { loading ? <span className="loading loading-spinner loading-xs text-white"></span> : null} 
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
