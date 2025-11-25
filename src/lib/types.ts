// Types para o app de nutrição

export interface NutrientInfo {
  energy_kcal?: number;
  proteins?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugars?: number;
  sodium?: number;
  salt?: number;
}

export interface Food {
  id: string;
  code: string;
  product_name: string;
  brands?: string;
  image_url?: string;
  nutriments: NutrientInfo;
  serving_size?: string;
  quantity?: string;
  categories?: string;
  scannedAt?: string;
}

export interface DailyLog {
  date: string;
  foods: FoodEntry[];
  totals: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
}

export interface FoodEntry {
  food: Food;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

export interface NutritionGoals {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export interface Exercise {
  name: string;
  duration: number; // minutos
  caloriesBurned: number;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female' | 'other';
  goalWeight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_weight' | 'gain_muscle';
}

export interface Ebook {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  price: number;
  category: string;
  isPurchased: boolean;
  pdfUrl?: string;
}

export interface Subscription {
  plan: 'free' | 'monthly' | 'quarterly';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
}
