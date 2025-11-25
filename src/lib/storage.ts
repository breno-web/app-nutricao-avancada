// Local storage para tracking diário

import { DailyLog, FoodEntry, NutritionGoals, Exercise, UserProfile } from './types';

const STORAGE_KEYS = {
  DAILY_LOGS: 'nutrition_daily_logs',
  GOALS: 'nutrition_goals',
  RECENT_FOODS: 'nutrition_recent_foods',
  WATER_INTAKE: 'nutrition_water_intake',
  EXERCISES: 'nutrition_exercises',
  USER_PROFILE: 'nutrition_user_profile',
};

export function getTodayLog(): DailyLog {
  const today = new Date().toISOString().split('T')[0];
  const logs = getAllLogs();
  
  const existingLog = logs.find(log => log.date === today);
  if (existingLog) return existingLog;

  return {
    date: today,
    foods: [],
    totals: {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
    },
  };
}

export function getAllLogs(): DailyLog[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return stored ? JSON.parse(stored) : [];
}

export function saveDailyLog(log: DailyLog): void {
  if (typeof window === 'undefined') return;
  
  const logs = getAllLogs();
  const index = logs.findIndex(l => l.date === log.date);
  
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.push(log);
  }
  
  // Manter apenas últimos 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const filtered = logs.filter(l => new Date(l.date) >= thirtyDaysAgo);
  
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(filtered));
}

export function addFoodToToday(entry: FoodEntry): void {
  const log = getTodayLog();
  log.foods.push(entry);
  
  // Recalcular totais
  log.totals = calculateTotals(log.foods);
  
  saveDailyLog(log);
}

export function removeFoodFromToday(index: number): void {
  const log = getTodayLog();
  log.foods.splice(index, 1);
  log.totals = calculateTotals(log.foods);
  saveDailyLog(log);
}

export function calculateTotals(foods: FoodEntry[]) {
  return foods.reduce(
    (acc, entry) => {
      const multiplier = entry.servings;
      return {
        calories: acc.calories + (entry.food.nutriments.energy_kcal || 0) * multiplier,
        proteins: acc.proteins + (entry.food.nutriments.proteins || 0) * multiplier,
        carbs: acc.carbs + (entry.food.nutriments.carbohydrates || 0) * multiplier,
        fats: acc.fats + (entry.food.nutriments.fat || 0) * multiplier,
      };
    },
    { calories: 0, proteins: 0, carbs: 0, fats: 0 }
  );
}

export function getGoals(): NutritionGoals {
  if (typeof window === 'undefined') {
    return { calories: 2000, proteins: 150, carbs: 250, fats: 65 };
  }
  
  const stored = localStorage.getItem(STORAGE_KEYS.GOALS);
  return stored ? JSON.parse(stored) : { calories: 2000, proteins: 150, carbs: 250, fats: 65 };
}

export function saveGoals(goals: NutritionGoals): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

// Water intake functions
export function getWaterIntake(): number {
  if (typeof window === 'undefined') return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(STORAGE_KEYS.WATER_INTAKE);
  
  if (!stored) return 0;
  
  const data = JSON.parse(stored);
  return data.date === today ? data.amount : 0;
}

export function addWaterIntake(amount: number): number {
  if (typeof window === 'undefined') return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const current = getWaterIntake();
  const newAmount = current + amount;
  
  localStorage.setItem(
    STORAGE_KEYS.WATER_INTAKE,
    JSON.stringify({ date: today, amount: newAmount })
  );
  
  return newAmount;
}

// Exercise functions
export function getExercises(): Exercise[] {
  if (typeof window === 'undefined') return [];
  
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(STORAGE_KEYS.EXERCISES);
  
  if (!stored) return [];
  
  const data = JSON.parse(stored);
  return data.date === today ? data.exercises : [];
}

export function addExercise(exercise: Exercise): void {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toISOString().split('T')[0];
  const exercises = getExercises();
  exercises.push(exercise);
  
  localStorage.setItem(
    STORAGE_KEYS.EXERCISES,
    JSON.stringify({ date: today, exercises })
  );
}

// User profile functions
export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return {
      name: 'Usuário',
      email: 'usuario@exemplo.com',
      age: 30,
      weight: 70,
      height: 170,
      gender: 'other',
      goalWeight: 65,
      activityLevel: 'moderate',
      goal: 'maintain',
    };
  }
  
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return stored
    ? JSON.parse(stored)
    : {
        name: 'Usuário',
        email: 'usuario@exemplo.com',
        age: 30,
        weight: 70,
        height: 170,
        gender: 'other',
        goalWeight: 65,
        activityLevel: 'moderate',
        goal: 'maintain',
      };
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}
