import { Post, FeeItem, Settings, ContactFormData, User, PostCategory, PostStatus, Audience } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ipr-zenith-hub.onrender.com/api';

// Auth token helper
const getAuthHeader = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) {
        return { 'Authorization': `Bearer ${state.token}` };
      }
    }
  } catch {
    // Invalid storage format
  }
  return {};
};

/** Shape of the error body returned by the API's validation middleware. */
interface ApiErrorBody {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

// Base fetch wrapper with error handling
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiErrorBody = await response
      .json()
      .catch(() => ({ message: 'Request failed' }));

    // Surface field-level validation failures rather than a bare status code.
    if (error.errors && Array.isArray(error.errors)) {
      const details = error.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`Validation error: ${details}`);
    }

    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // 204 No Content has an empty body, so json() would throw. The delete
  // endpoints return 204, and their declared return type is void.
  if (response.status === 204) return undefined as T;

  return response.json();
}

// ============================================
// AUTH API
// ============================================
export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (email: string, password: string): Promise<LoginResponse> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// ============================================
// POSTS API
// ============================================
export interface PostsQuery {
  status?: PostStatus;
  category?: PostCategory;
  search?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: PostCategory;
  tags: string[];
  status: PostStatus;
}

export interface UpdatePostData extends Partial<CreatePostData> { }

export const postsApi = {
  getAll: (query?: PostsQuery): Promise<Post[]> => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.category) params.append('category', query.category);
    if (query?.search) params.append('search', query.search);
    const queryString = params.toString();
    return request(`/posts${queryString ? `?${queryString}` : ''}`);
  },

  getBySlug: (slug: string): Promise<Post> =>
    request(`/posts/${slug}`),

  create: (data: CreatePostData): Promise<Post> =>
    request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdatePostData): Promise<Post> =>
    request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    request(`/posts/${id}`, { method: 'DELETE' }),
};

// ============================================
// FEES API
// ============================================
export interface FeesQuery {
  audience?: Audience;
}

export interface CreateFeeData {
  name: string;
  audience: Audience;
  type: 'fixed' | 'variable';
  priceMin: number;
  priceMax?: number;
  category: string;
  notes?: string;
}

export interface UpdateFeeData extends Partial<CreateFeeData> { }

export const feesApi = {
  getAll: (query?: FeesQuery): Promise<FeeItem[]> => {
    const params = new URLSearchParams();
    if (query?.audience) params.append('audience', query.audience);
    const queryString = params.toString();
    return request(`/fees${queryString ? `?${queryString}` : ''}`);
  },

  create: (data: CreateFeeData): Promise<FeeItem> =>
    request('/fees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateFeeData): Promise<FeeItem> =>
    request(`/fees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    request(`/fees/${id}`, { method: 'DELETE' }),
};

// ============================================
// SETTINGS API
// ============================================
export interface UpdateSettingsData {
  firmName?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: {
    line: string;
    city: string;
    state: string;
    postalCode: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  heroImage?: string;
}

export const settingsApi = {
  get: (): Promise<Settings> =>
    request('/settings'),

  update: (data: UpdateSettingsData): Promise<Settings> =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ============================================
// CONTACT API
// ============================================
export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactApi = {
  submit: (data: ContactFormData): Promise<ContactResponse> =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
