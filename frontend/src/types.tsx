// src/pages/types.tsx

export interface BlogIndexProps {
    initialArticles: Article[];
    initialSeoData: SEOData;
    initialCategories: Category[];
  }
  
  export interface GameLinkedItem {
    id: number;
    title: string;
    slug: string;
  }
    
  export interface ArticleLinkedItem {
    id: number;
    slug: string;
    title: string;
  }
  
  export interface ReviewLinkedItem {
    id: number;
    slug: string;
    title: string;
  }
  
  export interface PinnedContentProps {
    linkedGame?: GameLinkedItem | null;  // Allow null
    linkedBlogPosts?: ArticleLinkedItem[];
  }
  
  export interface ActiveUsersProps {
    contentType: string;
    contentId: number; // Changed to number
  }
  
  export interface ArticleBodyProps {
    body: string;
    isDarkMode: boolean;
    options?: any; // You may replace 'any' with a more specific type depending on what html-react-parser expects
  }
  
  export interface Category {
    id: string;
    name: string;
  }
  
  export interface User {
    username: string;
  }
  
  export interface Article {
    id: number;
    title: string;
    seo_title?: string;
    slug: string;
    intro: string;
    owner: {
      username: string;
    };
    main_image?: {
      url: string;
    };
    first_published_at: string;
    last_published_at: string;
    read_count: number;
    search_description: string;
    keywords?: string;
    categories: Category[];
    body?: string; // Ensure body is included if used
    url_path?: string; // Ensure url_path is included if used
    linked_game?: number; // Assuming linked_game is an ID of type number
    like_count?: number; // Add this line
    dislike_count?: number; // Add this line  
  }
  
  export interface ArticleHeaderProps {
    article: Article;
    readCount: number;
    isDarkMode: boolean;
  }
  
  export interface ArticleSchemaProps {
    article: Article;
    cleanedUrlPath: string;
  }
  
  export interface DarkModeToggleProps {
    isDarkMode: boolean;
    toggleDarkMode: (mode: boolean) => void;
  }
  
  export interface FiltersProps<T> {
    filters: T;
    handleFilterChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSliderChange: (values: number[]) => void; // Adjusted to number[]
    dateRange: [number, number];
    formatDate: (date: number) => string;
    minDate?: Date;
    maxDate?: Date;
  }
  

  export interface BaseFilters {
    title: string;
    dateRange: [number, number];
    sortBy: string;
  }
  
  export interface ArticleFilters extends BaseFilters {
    category: string; // Ensure this is a string
  }
  
  export interface GameFilters extends BaseFilters {
    developer: string;
    publisher: string;
    genres: string[];
    platforms: string[];
  }
  
  export interface ReviewFilters {
    title: string;
    reviewType: string;
    category: string;
    sortBy: string;
    dateRange: [number, number];
  }
  
    
    

  export interface FiltersProps<T> {
    filters: T;
    handleFilterChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSliderChange: (values: number[]) => void; // Adjusted to number[]
    dateRange: [number, number];
    formatDate: (date: number) => string;
    minDate?: Date;
    maxDate?: Date;
  }
    
  export interface ArticleFiltersProps {
    categories: Category[];
    filters: ArticleFilters;
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSliderChange: (values: number[]) => void; // Updated to number[]
    dateRange: [number, number];
    formatDate: (timestamp: number) => string;
    minDate: Date | null;
    maxDate: Date | null;
  }
  
  export interface GameFiltersProps extends FiltersProps<GameFilters> {
    developers: string[];
    publishers: string[];
    genres: string[];
    platforms: string[];
  }
  
  export interface ReviewFiltersProps extends FiltersProps<ReviewFilters> {
    categories: Category[];
  }
  
    
  export interface ArticleCardProps {
    article: Article;
    info?: boolean;
  }
  
  export interface ListItem {
    "@type": string;
    position: number;
    name: string;
    item: string;
  }
  
  export interface BreadcrumbList {
    "@context": string;
    "@type": string;
    itemListElement: {
      "@type": string;
      position: number;
      name: string;
      item: string;
    }[];
  }
  
  export interface BreadcrumbsProps {
    breadcrumbList: BreadcrumbList;
  }
  
  export interface LoadMoreButtonProps {
    onClick: () => void;
    isVisible: boolean;
  }
  
  export interface SEOData {
    seo_title?: string;
    search_description?: string;
    keywords?: string;
    main_image?: {
      url: string;
    };
  }
  
  export interface SEOProps {
    seoData: SEOData;
    breadcrumbList: BreadcrumbList;
  }
  
  export interface GameHeaderProps {
    game: Game;
  }
  
  export interface GameContentProps {
    game: Game;
    isDarkMode: boolean;
  }
  
  export interface Platform {
    name: string;
  }
  
  export interface Game {
    id: number;
    slug: string;
    description: string;
    title: string;
    seo_title?: string;
    search_description?: string;
    keywords?: string;
    main_image: {
      url: string;
    };
    developer?: {
      name: string;
    };
    url_path: string;
    publisher?: {
      name: string;
    };
    release_date: string;
    genres: {
      id: number;
      name: string;
    }[];
    platforms?: Platform[];
    linked_blog_posts?: ArticleLinkedItem[];
    linked_reviews?: ReviewLinkedItem[];
    trailer_url?: string; // Added this line
  }
  
  export interface GameDetailProps {
    game: Game;
    relatedArticles: Article[]; // Assuming this is the correct type
    relatedReviews: Review[]; // Assuming this is the correct type
  }
  
  export interface GameDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
  }
  
  export interface CommentShareLikeProps {
    pageId: number; // If the page ID is a number
    shareUrl: string;
    title: string;
    contentType: 'article' | 'review' | 'game'; // Supported content types
  }
  
  export interface Comment {
    id: number;
    author: string;
    text: string;
    page: string | number;
    is_approved: boolean;
    created_at: string;
  }
  
  export interface ReviewAttribute {
    name: string;
    score: number;
    text: string;
  }
  
  export type ReviewType = 'Game' | 'Keyboard' | 'Mouse' | 'Monitor' | 'Computer' | 'Headphones' | 'Console' | 'Mobile' | 'Notebook' | 'Microphone';
  
  export interface ProCon {
    name: string;
    text: string;
  }
  
  export interface Review {
    id: number;
    title: string;
    seo_title?: string;
    slug: string;
    main_image?: {
      url: string;
    };
    intro: string;
    owner: {
      username: string;
    };
    first_published_at: string;
    last_published_at: string;
    read_count: number;
    search_description: string;
    keywords?: string;
    categories: Category[];
    like_count: number;
    dislike_count: number;
    attributes?: ReviewAttribute[];
    review_type: ReviewType;
    rating?: number;
    pros?: ProCon[]; // Ensure this matches the expected type
    cons?: ProCon[]; // Ensure this matches the expected type
    url_path?: string;
    linked_game?: number; // or adjust to the correct type if `linked_game` should be present
  }
  
  export interface ReviewSeoData {
    seo_title?: string;
    search_description?: string;
    keywords?: string;
    main_image?: {
      url?: string;
    };
  }
  
  export interface BreadcrumbListItem {
    "@context": string;
    "@type": string;
    itemListElement: {
      "@type": string;
      position: number;
      item: {
        "@id": string;
        name: string;
      };
    }[];
  }
  
  export interface ReviewSEOProps {
    seoData?: ReviewSeoData;
    breadcrumbList?: BreadcrumbListItem;
  }
  
  export interface SvgSpiderProps {
    scores: number[]; // Assuming scores is an array of numbers
    aspects: string[]; // Assuming aspects is an array of strings
    isDarkMode: boolean; // Assuming isDarkMode is a boolean
  }
  