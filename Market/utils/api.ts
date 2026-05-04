
/**
 * Centralized API client for all HTTP requests
 * Handles base URL, error handling, and request/response formatting
 */


const  BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const APIRoutes = {
    BASE_URL: BASE_URL,
    ROOT: `${BASE_URL}/accounts/`,
    LOGIN: `${BASE_URL}/accounts/auth/user-login/`,
    SIGNUP: `${BASE_URL}/accounts/auth/user-signup/`,
};


console.log("DEBUG: Current Base URL is:", BASE_URL); // Is this undefined?


interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}



interface ApiError {
  message: string;
  statusCode: number;
  originalError?: any;
}




class ApiClient {

  /*Generic request method with error handling */
  private async request<T>(endpoint: string, options: RequestInit = {}):Promise<T> {

    try {
      
      const response = await fetch(`${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.error || data.message || 'Request failed',
          statusCode: response.status,
          originalError: data,
        } as ApiError;
      }

      return data as T;
    } catch (error: any) {
      
      // Re-throw known errors
      if (error.statusCode) {
        throw error as ApiError;
      }

      // Handle network errors
      throw {
        message: error.message || 'Network error. Please check your connection.',
        statusCode: 0,
        originalError: error,
      } as ApiError;
    }
  }





  /* POST request wrapper */
  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }




  /* GET request wrapper */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }



  /*  PUT request wrapper */
  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }



  /* DELETE request wrapper */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }



  /* PATCH request wrapper */
  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }


}







// Export singleton instance
export const apiClient = new ApiClient();
export type { ApiError, ApiResponse };

