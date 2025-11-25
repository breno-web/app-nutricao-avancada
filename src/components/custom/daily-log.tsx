'use client';

import { FoodEntry } from '@/lib/types';
import { Trash2, Coffee, Sun, Moon, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DailyLogProps {
  foods: FoodEntry[];
  onRemove: (index: number) => void;
}

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Apple,
};

const mealLabels = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
};

export function DailyLog({ foods, onRemove }: DailyLogProps) {
  const groupedByMeal = foods.reduce((acc, entry, index) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push({ ...entry, originalIndex: index });
    return acc;
  }, {} as Record<string, (FoodEntry & { originalIndex: number })[]>);

  if (foods.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed">
        <Apple className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Nenhum alimento registrado hoje
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Escaneie um código de barras ou busque alimentos para começar
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByMeal).map(([mealType, entries]) => {
        const Icon = mealIcons[mealType as keyof typeof mealIcons];
        const label = mealLabels[mealType as keyof typeof mealLabels];

        return (
          <div key={mealType}>
            <div className="flex items-center gap-3 mb-3">
              <Icon className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{label}</h3>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="space-y-3">
              {entries.map((entry) => {
                const nutrients = entry.food.nutriments;
                const multiplier = entry.servings;

                return (
                  <Card
                    key={entry.originalIndex}
                    className="p-4 hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-500"
                  >
                    <div className="flex items-start gap-4">
                      {entry.food.image_url && (
                        <img
                          src={entry.food.image_url}
                          alt={entry.food.product_name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                          {entry.food.product_name}
                        </h4>
                        {entry.food.brands && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {entry.food.brands}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {entry.servings} porção{entry.servings > 1 ? 'ões' : ''}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Cal:</span>{' '}
                            <span className="font-bold text-orange-600">
                              {((nutrients.energy_kcal || 0) * multiplier).toFixed(0)} kcal
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Prot:</span>{' '}
                            <span className="font-bold text-red-600">
                              {((nutrients.proteins || 0) * multiplier).toFixed(1)}g
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Carb:</span>{' '}
                            <span className="font-bold text-amber-600">
                              {((nutrients.carbohydrates || 0) * multiplier).toFixed(1)}g
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Gord:</span>{' '}
                            <span className="font-bold text-yellow-600">
                              {((nutrients.fat || 0) * multiplier).toFixed(1)}g
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(entry.originalIndex)}
                        className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
