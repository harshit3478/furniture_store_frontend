"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/authContext";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onReviewSubmitted?: () => void;
  products?: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
}

export const ReviewForm = ({ productId, productName, onReviewSubmitted, products }: ReviewFormProps) => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(
    productId && productName ? { id: productId, name: productName } : null
  );

  const handleSubmitReview = async () => {
    if (!review.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    if (!selectedProduct) {
      toast.error("Please select a product to review");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting review for product:", selectedProduct.id);

      // Make sure productId is not empty to avoid double slashes in the URL
      const safeProductId = selectedProduct.id || 'unknown';
      // Use the correct API endpoint format
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${safeProductId}/reviews`;
      console.log("API URL:", apiUrl);

      // For debugging - log the environment variable
      console.log("NEXT_PUBLIC_BACKEND_URL:", process.env.NEXT_PUBLIC_BACKEND_URL);

      // Add a timestamp to prevent caching issues
      const urlWithTimestamp = `${apiUrl}?t=${Date.now()}`;
      const response = await fetch(urlWithTimestamp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rating: review.rating,
          comment: review.comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit review");
      }

      const data = await response.json().catch(() => ({}));
      toast.success(data.success ? "Your review has been submitted successfully" : "Review submitted");
      setReview({ rating: 5, comment: "" });
      setIsOpen(false);

      // Call the callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to submit your review: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize selectedProduct from products array if available
  useEffect(() => {
    if (products && products.length > 0 && !selectedProduct) {
      setSelectedProduct({
        id: products[0].id,
        name: products[0].name
      });
    }
  }, [products, selectedProduct]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          Write Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            {products && products.length > 1
              ? "Select a product to review"
              : `Share your experience with ${selectedProduct?.name || productName}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Product selector - only show if multiple products */}
          {products && products.length > 1 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Product</label>
              <Select
                value={selectedProduct?.id}
                onValueChange={(value) => {
                  const product = products.find(p => p.id === value);
                  if (product) {
                    setSelectedProduct({
                      id: product.id,
                      name: product.name
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center gap-2">
                        {product.image && (
                          <div className="relative w-8 h-8 overflow-hidden rounded">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span>{product.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setReview(prev => ({ ...prev, rating }))}
                  className="text-amber-400 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${rating <= review.rating ? "fill-current" : ""}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm">{review.rating} out of 5</span>
            </div>
            <Textarea
              placeholder="Share your experience with this product..."
              value={review.comment}
              onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
              className="w-full h-24"
            />
          </div>
          <Button
            onClick={handleSubmitReview}
            disabled={isSubmitting || !review.comment.trim() || !selectedProduct}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
