"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarHalf, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Review, ReviewStats } from "@/types/product";

export function Reviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  // Calculate average rating
  const calculateAverageRating = (stats: ReviewStats) => {
    const totalReviews = stats.oneStar + stats.twoStar + stats.threeStar + stats.fourStar + stats.fiveStar;
    if (totalReviews === 0) return 0;

    const weightedSum =
      (1 * stats.oneStar) +
      (2 * stats.twoStar) +
      (3 * stats.threeStar) +
      (4 * stats.fourStar) +
      (5 * stats.fiveStar);

    return weightedSum / totalReviews;
  };

  // Calculate percentage for each rating
  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  // Fetch reviews
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}/reviews?page=${page}&limit=5`);

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();

        if (page === 1) {
          setReviews(data.reviews || []);
          setReviewStats(data.stats || {
            oneStar: 0,
            twoStar: 0,
            threeStar: 0,
            fourStar: 0,
            fiveStar: 0
          });
        } else {
          setReviews(prev => [...prev, ...(data.reviews || [])]);
        }

        setHasMore((data.reviews || []).length === 5);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast({
          title: "Error",
          description: "Failed to load reviews. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [id, page, toast]);

  // Submit a new review
  const handleSubmitReview = async () => {
    if (!id || !newReview.comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment for your review.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Refresh reviews
      setPage(1);
      setNewReview({ rating: 5, comment: "" });

      toast({
        title: "Success",
        description: "Your review has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate total reviews
  const totalReviews = reviewStats ?
    reviewStats.oneStar + reviewStats.twoStar + reviewStats.threeStar + reviewStats.fourStar + reviewStats.fiveStar : 0;

  // Calculate average rating
  const averageRating = reviewStats ? calculateAverageRating(reviewStats) : 0;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex flex-col">
            <div className="flex text-amber-400">
              {[...Array(Math.floor(averageRating))].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              {averageRating % 1 >= 0.5 && <StarHalf className="w-4 h-4 fill-current" />}
            </div>
            <div className="text-sm text-gray-500">{totalReviews} Reviews</div>
          </div>
        </div>

        <div className="flex-1">
          {reviewStats && [
            { rating: 5, count: reviewStats.fiveStar },
            { rating: 4, count: reviewStats.fourStar },
            { rating: 3, count: reviewStats.threeStar },
            { rating: 2, count: reviewStats.twoStar },
            { rating: 1, count: reviewStats.oneStar }
          ].map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-2 mb-1">
              <div className="w-8 text-xs text-right">{rating}.0</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${calculatePercentage(count, totalReviews)}%` }}
                ></div>
              </div>
              <div className="w-16 text-xs">
                {count} reviews
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review section */}
      <div className="mb-8 border rounded-md p-4">
        <h3 className="font-medium mb-3">Write a Review</h3>
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                className="text-amber-400 focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${rating <= newReview.rating ? "fill-current" : ""}`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm">{newReview.rating} out of 5</span>
          </div>
          <Textarea
            placeholder="Share your experience with this product..."
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full h-24"
          />
        </div>
        <Button
          onClick={handleSubmitReview}
          disabled={isSubmitting || !newReview.comment.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Submit Review
        </Button>
      </div>

      {/* Reviews list */}
      <div className="space-y-6">
        {isLoading && page === 1 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-medium">
                  {review.userName?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-medium">{review.userName}</div>
                  <div className="text-sm text-gray-500">{formatDate(review.createdAt)}</div>
                </div>
                <div className="ml-auto flex items-center">
                  <div className="text-lg font-semibold">{review.rating}.0</div>
                  <div className="flex text-amber-400 ml-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        )}

        {isLoading && page > 1 && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        )}

        {hasMore && reviews.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => setPage(prev => prev + 1)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}