'use client';

import { NutritionGoals } from '@/lib/types';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface NutritionChartProps {
  totals: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  goals: NutritionGoals;
}

export function NutritionChart({ totals, goals }: NutritionChartProps) {
  const nutrients = [
    {
      name: 'Calorias',
      current: totals.calories,
      goal: goals.calories,
      unit: 'kcal',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      textColor: 'text-orange-600',
    },
    {
      name: 'Proteínas',
      current: totals.proteins,
      goal: goals.proteins,
      unit: 'g',
      icon: Beef,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      textColor: 'text-red-600',
    },
    {
      name: 'Carboidratos',
      current: totals.carbs,
      goal: goals.carbs,
      unit: 'g',
      icon: Wheat,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      textColor: 'text-amber-600',
    },
    {
      name: 'Gorduras',
      current: totals.fats,
      goal: goals.fats,
      unit: 'g',
      icon: Droplet,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      textColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {nutrients.map((nutrient) => {
        const Icon = nutrient.icon;
        const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);
        const remaining = Math.max(nutrient.goal - nutrient.current, 0);

        return (
          <div
            key={nutrient.name}
            className={`${nutrient.bgColor} p-6 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${nutrient.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {nutrient.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Meta: {nutrient.goal} {nutrient.unit}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Progress value={percentage} className="h-3" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-2xl font-bold ${nutrient.textColor}`}>
                    {nutrient.current.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">consumido</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {remaining.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">restante</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {percentage.toFixed(0)}% da meta diária
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
