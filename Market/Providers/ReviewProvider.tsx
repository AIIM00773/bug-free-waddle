/**
 * Review Provider
 * Handles product reviews, ratings, and user feedback
 */

import { ApiError } from '@/utils/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  images?: string[];
  verified: boolean; // Purchased by user
  helpful: number; // Number of helpful votes
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  response?: ReviewResponse;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  merchantId: string;
  merchantName: string;
  response: string;
  createdAt: string;
}

export interface ReviewSummary {
  productId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number }; // 1-5 star counts
  verifiedReviews: number;
  recommendedPercentage: number; // Percentage who would recommend
  topTags: string[]; // Common keywords from reviews
}

export interface ReviewFilter {
  rating?: number;
  verified?: boolean;
  hasImages?: boolean;
  sortBy?: 'newest' | 'oldest' | 'helpful' | 'rating_high' | 'rating_low';
  status?: ReviewStatus;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  orderId?: string;
}

export interface ReviewAnalytics {
  productId: string;
  totalViews: number;
  totalHelpfulVotes: number;
  averageHelpfulness: number;
  responseRate: number; // Percentage of reviews with merchant responses
  ratingTrend: 'increasing' | 'decreasing' | 'stable';
  commonComplaints: string[];
  commonPraise: string[];
}

interface ReviewContextType {
  // State
  reviews: { [productId: string]: ProductReview[] };
  reviewSummaries: { [productId: string]: ReviewSummary };
  userReviews: ProductReview[];
  loading: boolean;
  error: string | null;

  // Review management
  createReview: (reviewData: CreateReviewData) => Promise<ProductReview>;
  updateReview: (reviewId: string, updates: Partial<ProductReview>) => Promise<ProductReview>;
  deleteReview: (reviewId: string) => Promise<boolean>;

  // Review retrieval
  getProductReviews: (productId: string, filter?: ReviewFilter, page?: number, limit?: number) => Promise<ProductReview[]>;
  getReviewSummary: (productId: string) => Promise<ReviewSummary>;
  getUserReviews: (userId?: string) => Promise<ProductReview[]>;
  getReviewById: (reviewId: string) => Promise<ProductReview | null>;

  // Review interactions
  markReviewHelpful: (reviewId: string) => Promise<boolean>;
  reportReview: (reviewId: string, reason: string) => Promise<boolean>;

  // Merchant responses
  respondToReview: (reviewId: string, response: string) => Promise<ReviewResponse>;
  updateReviewResponse: (responseId: string, response: string) => Promise<ReviewResponse>;
  deleteReviewResponse: (responseId: string) => Promise<boolean>;

  // Analytics
  getReviewAnalytics: (productId: string) => Promise<ReviewAnalytics>;

  // Moderation (admin/merchant)
  approveReview: (reviewId: string) => Promise<boolean>;
  rejectReview: (reviewId: string, reason?: string) => Promise<boolean>;
  hideReview: (reviewId: string) => Promise<boolean>;

  // Utilities
  calculateAverageRating: (reviews: ProductReview[]) => number;
  getRatingDistribution: (reviews: ProductReview[]) => { [key: number]: number };
  validateReviewData: (data: CreateReviewData) => { valid: boolean; errors: string[] };
  formatReviewDate: (date: string) => string;
  canUserReviewProduct: (productId: string, userId: string) => Promise<boolean>;

  // Reset
  resetReviews: () => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<{ [productId: string]: ProductReview[] }>({});
  const [reviewSummaries, setReviewSummaries] = useState<{ [productId: string]: ReviewSummary }>({});
  const [userReviews, setUserReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with dummy data
  useEffect(() => {
    const dummyReviews: { [productId: string]: ProductReview[] } = {
      'prod_1': [
        {
          id: 'review_1',
          productId: 'prod_1',
          userId: 'user_1',
          userName: 'Sarah Johnson',
          userAvatar: 'https://api.drop.com/avatars/sarah.jpg',
          rating: 5,
          title: 'Absolutely love this dress!',
          comment: 'The quality is amazing and it fits perfectly. The color is exactly as shown in the photos. Highly recommend!',
          images: ['https://api.drop.com/reviews/review_1_1.jpg'],
          verified: true,
          helpful: 12,
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          orderId: 'order_123',
          response: {
            id: 'response_1',
            reviewId: 'review_1',
            merchantId: 'merchant_1',
            merchantName: 'FashionStore',
            response: 'Thank you so much for the wonderful review! We\'re thrilled you love your dress.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString()
          }
        },
        {
          id: 'review_2',
          productId: 'prod_1',
          userId: 'user_2',
          userName: 'Mike Chen',
          userAvatar: 'https://api.drop.com/avatars/mike.jpg',
          rating: 4,
          title: 'Great quality, fast shipping',
          comment: 'Very satisfied with the purchase. The material is high quality and shipping was faster than expected.',
          verified: true,
          helpful: 8,
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
          orderId: 'order_456'
        },
        {
          id: 'review_3',
          productId: 'prod_1',
          userId: 'user_3',
          userName: 'Emma Davis',
          rating: 3,
          title: 'Good but sizing runs small',
          comment: 'The dress is beautiful but runs smaller than expected. I had to return it for a larger size.',
          verified: true,
          helpful: 15,
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
          orderId: 'order_789'
        }
      ],
      'prod_2': [
        {
          id: 'review_4',
          productId: 'prod_2',
          userId: 'user_4',
          userName: 'Alex Rodriguez',
          rating: 5,
          title: 'Perfect fit and amazing quality',
          comment: 'This jacket exceeded my expectations. The fit is perfect and the quality is outstanding.',
          verified: true,
          helpful: 6,
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          orderId: 'order_101'
        }
      ]
    };

    const dummySummaries: { [productId: string]: ReviewSummary } = {
      'prod_1': {
        productId: 'prod_1',
        totalReviews: 3,
        averageRating: 4.0,
        ratingDistribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 1 },
        verifiedReviews: 3,
        recommendedPercentage: 67,
        topTags: ['quality', 'fit', 'shipping', 'color']
      },
      'prod_2': {
        productId: 'prod_2',
        totalReviews: 1,
        averageRating: 5.0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
        verifiedReviews: 1,
        recommendedPercentage: 100,
        topTags: ['quality', 'fit']
      }
    };

    setReviews(dummyReviews);
    setReviewSummaries(dummySummaries);
    setUserReviews(dummyReviews['prod_1'] || []);
  }, []);

  const createReview = async (reviewData: CreateReviewData): Promise<ProductReview> => {
    setLoading(true);
    setError(null);

    try {
      // Validate review data
      const validation = validateReviewData(reviewData);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Check if user can review this product
      const canReview = await canUserReviewProduct(reviewData.productId, 'user_1'); // In real app, get from auth
      if (!canReview) {
        throw new Error('You must purchase this product to leave a review');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReview: ProductReview = {
        id: `review_${Date.now()}`,
        productId: reviewData.productId,
        userId: 'user_1', // In real app, get from auth context
        userName: 'John Buyer', // In real app, get from auth context
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        images: reviewData.images,
        verified: true, // Assume verified for demo
        helpful: 0,
        status: 'approved', // Auto-approve for demo
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        orderId: reviewData.orderId
      };

      // Add to local state
      setReviews(prev => ({
        ...prev,
        [reviewData.productId]: [newReview, ...(prev[reviewData.productId] || [])]
      }));

      setUserReviews(prev => [newReview, ...prev]);

      // Update summary
      await updateReviewSummary(reviewData.productId);

      // In a real app:
      // const response = await apiClient.post('/reviews', reviewData);

      return newReview;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to create review';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<ProductReview>): Promise<ProductReview> => {
    try {
      setLoading(true);

      // Find the review
      let updatedReview: ProductReview | null = null;
      let productId = '';

      setReviews(prev => {
        const newReviews = { ...prev };
        for (const [prodId, prodReviews] of Object.entries(newReviews)) {
          const reviewIndex = prodReviews.findIndex(r => r.id === reviewId);
          if (reviewIndex !== -1) {
            updatedReview = { ...prodReviews[reviewIndex], ...updates, updatedAt: new Date().toISOString() };
            newReviews[prodId][reviewIndex] = updatedReview;
            productId = prodId;
            break;
          }
        }
        return newReviews;
      });

      if (!updatedReview) {
        throw new Error('Review not found');
      }

      // Update user reviews if needed
      setUserReviews(prev =>
        prev.map(review =>
          review.id === reviewId ? updatedReview! : review
        )
      );

      // Update summary
      await updateReviewSummary(productId);

      // In a real app:
      // const response = await apiClient.put(`/reviews/${reviewId}`, updates);

      return updatedReview;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to update review';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    try {
      setLoading(true);

      let productId = '';

      setReviews(prev => {
        const newReviews = { ...prev };
        for (const [prodId, prodReviews] of Object.entries(newReviews)) {
          const filtered = prodReviews.filter(r => r.id !== reviewId);
          if (filtered.length !== prodReviews.length) {
            newReviews[prodId] = filtered;
            productId = prodId;
            break;
          }
        }
        return newReviews;
      });

      setUserReviews(prev => prev.filter(r => r.id !== reviewId));

      // Update summary
      if (productId) {
        await updateReviewSummary(productId);
      }

      // In a real app:
      // await apiClient.delete(`/reviews/${reviewId}`);

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete review');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getProductReviews = async (
    productId: string,
    filter?: ReviewFilter,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductReview[]> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      let productReviews = reviews[productId] || [];

      // Apply filters
      if (filter) {
        if (filter.rating) {
          productReviews = productReviews.filter(r => r.rating === filter.rating);
        }
        if (filter.verified !== undefined) {
          productReviews = productReviews.filter(r => r.verified === filter.verified);
        }
        if (filter.hasImages) {
          productReviews = productReviews.filter(r => r.images && r.images.length > 0);
        }
        if (filter.status) {
          productReviews = productReviews.filter(r => r.status === filter.status);
        }

        // Apply sorting
        if (filter.sortBy) {
          productReviews.sort((a, b) => {
            switch (filter.sortBy) {
              case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              case 'helpful':
                return b.helpful - a.helpful;
              case 'rating_high':
                return b.rating - a.rating;
              case 'rating_low':
                return a.rating - b.rating;
              default:
                return 0;
            }
          });
        }
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // In a real app:
      // const response = await apiClient.get(`/products/${productId}/reviews`, {
      //   params: { ...filter, page, limit }
      // });

      return productReviews.slice(startIndex, endIndex);

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to get product reviews');
      return [];
    }
  };

  const getReviewSummary = async (productId: string): Promise<ReviewSummary> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      const summary = reviewSummaries[productId];
      if (!summary) {
        // Generate summary from reviews
        const productReviews = reviews[productId] || [];
        const generatedSummary = {
          productId,
          totalReviews: productReviews.length,
          averageRating: calculateAverageRating(productReviews),
          ratingDistribution: getRatingDistribution(productReviews),
          verifiedReviews: productReviews.filter(r => r.verified).length,
          recommendedPercentage: Math.round((productReviews.filter(r => r.rating >= 4).length / productReviews.length) * 100),
          topTags: ['quality', 'fit', 'value'] // Mock tags
        };

        setReviewSummaries(prev => ({ ...prev, [productId]: generatedSummary }));
        return generatedSummary;
      }

      // In a real app:
      // const response = await apiClient.get(`/products/${productId}/reviews/summary`);

      return summary;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to get review summary');
      throw new Error(apiError.message || 'Failed to get review summary');
    }
  };

  const getUserReviews = async (userId?: string): Promise<ProductReview[]> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const targetUserId = userId || 'user_1'; // In real app, get from auth

      const allReviews = Object.values(reviews).flat();
      const userReviews = allReviews.filter(r => r.userId === targetUserId);

      // In a real app:
      // const response = await apiClient.get('/reviews/user', {
      //   params: { userId }
      // });

      return userReviews;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to get user reviews');
      return [];
    }
  };

  const getReviewById = async (reviewId: string): Promise<ProductReview | null> => {
    try {
      const allReviews = Object.values(reviews).flat();
      return allReviews.find(r => r.id === reviewId) || null;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to get review');
      return null;
    }
  };

  const markReviewHelpful = async (reviewId: string): Promise<boolean> => {
    try {
      // Update local state
      setReviews(prev => {
        const newReviews = { ...prev };
        for (const prodReviews of Object.values(newReviews)) {
          const review = prodReviews.find(r => r.id === reviewId);
          if (review) {
            review.helpful += 1;
            break;
          }
        }
        return newReviews;
      });

      // In a real app:
      // await apiClient.post(`/reviews/${reviewId}/helpful`);

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to mark review as helpful');
      return false;
    }
  };

  const reportReview = async (reviewId: string, reason: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // In a real app:
      // await apiClient.post(`/reviews/${reviewId}/report`, { reason });

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to report review');
      return false;
    }
  };

  const respondToReview = async (reviewId: string, response: string): Promise<ReviewResponse> => {
    try {
      setLoading(true);

      const newResponse: ReviewResponse = {
        id: `response_${Date.now()}`,
        reviewId,
        merchantId: 'merchant_1', // In real app, get from auth
        merchantName: 'FashionStore',
        response,
        createdAt: new Date().toISOString()
      };

      // Update review with response
      setReviews(prev => {
        const newReviews = { ...prev };
        for (const prodReviews of Object.values(newReviews)) {
          const review = prodReviews.find(r => r.id === reviewId);
          if (review) {
            review.response = newResponse;
            break;
          }
        }
        return newReviews;
      });

      // In a real app:
      // const response = await apiClient.post(`/reviews/${reviewId}/response`, {
      //   response
      // });

      return newResponse;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to respond to review');
      throw new Error(apiError.message || 'Failed to respond to review');
    } finally {
      setLoading(false);
    }
  };

  const updateReviewResponse = async (responseId: string, response: string): Promise<ReviewResponse> => {
    try {
      // Update response in local state
      setReviews(prev => {
        const newReviews = { ...prev };
        for (const prodReviews of Object.values(newReviews)) {
          const review = prodReviews.find(r => r.id === responseId);
          if (review && review.response) {
            review.response.response = response;
            return newReviews;
          }
        }
        return newReviews;
      });

      // In a real app:
      // const response = await apiClient.put(`/reviews/responses/${responseId}`, {
      //   response
      // });

      throw new Error('Response not found');

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to update response');
      throw new Error(apiError.message || 'Failed to update response');
    }
  };

  const deleteReviewResponse = async (responseId: string): Promise<boolean> => {
    try {
      // Remove response from review
      setReviews(prev => {
        const newReviews = { ...prev };
        for (const prodReviews of Object.values(newReviews)) {
          const review = prodReviews.find(r => r.id === responseId);
          if (review) {
            delete review.response;
            break;
          }
        }
        return newReviews;
      });

      // In a real app:
      // await apiClient.delete(`/reviews/responses/${responseId}`);

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete response');
      return false;
    }
  };

  const getReviewAnalytics = async (productId: string): Promise<ReviewAnalytics> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const productReviews = reviews[productId] || [];

      const analytics: ReviewAnalytics = {
        productId,
        totalViews: 1250, // Mock data
        totalHelpfulVotes: productReviews.reduce((sum, r) => sum + r.helpful, 0),
        averageHelpfulness: productReviews.length > 0
          ? productReviews.reduce((sum, r) => sum + r.helpful, 0) / productReviews.length
          : 0,
        responseRate: productReviews.length > 0
          ? (productReviews.filter(r => r.response).length / productReviews.length) * 100
          : 0,
        ratingTrend: 'stable', // Mock trend
        commonComplaints: ['sizing issues', 'color difference'],
        commonPraise: ['quality', 'fast shipping', 'good fit']
      };

      return analytics;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to get review analytics');
      throw new Error(apiError.message || 'Failed to get review analytics');
    }
  };

  const approveReview = async (reviewId: string): Promise<boolean> => {
    return updateReview(reviewId, { status: 'approved' }).then(() => true).catch(() => false);
  };

  const rejectReview = async (reviewId: string, reason?: string): Promise<boolean> => {
    return updateReview(reviewId, { status: 'rejected' }).then(() => true).catch(() => false);
  };

  const hideReview = async (reviewId: string): Promise<boolean> => {
    return updateReview(reviewId, { status: 'hidden' }).then(() => true).catch(() => false);
  };

  const calculateAverageRating = (reviews: ProductReview[]): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  const getRatingDistribution = (reviews: ProductReview[]): { [key: number]: number } => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const validateReviewData = (data: CreateReviewData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.productId) {
      errors.push('Product ID is required');
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (!data.title || data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!data.comment || data.comment.trim().length < 10) {
      errors.push('Comment must be at least 10 characters long');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const formatReviewDate = (date: string): string => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInMs = now.getTime() - reviewDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

    return reviewDate.toLocaleDateString();
  };

  const canUserReviewProduct = async (productId: string, userId: string): Promise<boolean> => {
    // In a real app, check if user has purchased the product
    // For demo, allow all reviews
    return true;
  };

  const updateReviewSummary = async (productId: string) => {
    const productReviews = reviews[productId] || [];
    const summary: ReviewSummary = {
      productId,
      totalReviews: productReviews.length,
      averageRating: calculateAverageRating(productReviews),
      ratingDistribution: getRatingDistribution(productReviews),
      verifiedReviews: productReviews.filter(r => r.verified).length,
      recommendedPercentage: productReviews.length > 0
        ? Math.round((productReviews.filter(r => r.rating >= 4).length / productReviews.length) * 100)
        : 0,
      topTags: ['quality', 'fit', 'value'] // Mock tags
    };

    setReviewSummaries(prev => ({ ...prev, [productId]: summary }));
  };

  const resetReviews = () => {
    setReviews({});
    setReviewSummaries({});
    setUserReviews([]);
    setError(null);
  };

  const value: ReviewContextType = {
    reviews,
    reviewSummaries,
    userReviews,
    loading,
    error,
    createReview,
    updateReview,
    deleteReview,
    getProductReviews,
    getReviewSummary,
    getUserReviews,
    getReviewById,
    markReviewHelpful,
    reportReview,
    respondToReview,
    updateReviewResponse,
    deleteReviewResponse,
    getReviewAnalytics,
    approveReview,
    rejectReview,
    hideReview,
    calculateAverageRating,
    getRatingDistribution,
    validateReviewData,
    formatReviewDate,
    canUserReviewProduct,
    resetReviews
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within ReviewProvider');
  }
  return context;
};