'use client';

import { Food } from '@/lib/types';
import { Plus, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FoodCardProps {
  food: Food;
  onAdd: (food: Food) => void;
}

export function FoodCard({ food, onAdd }: FoodCardProps) {
  const nutrients = food.nutriments;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-500">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="flex-shrink-0">
          {food.image_url ? (
            <img
              src={food.image_url}
              alt={food.product_name}
              className="w-24 h-24 object-cover rounded-xl"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
              <Beef className="w-12 h-12 text-emerald-600" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
            {food.product_name}
          </h3>
          {food.brands && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{food.brands}</p>
          )}
          {food.serving_size && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Porção: {food.serving_size}
            </p>
          )}

          {/* Nutrients Grid */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg">
              <Flame className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Calorias</p>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {nutrients.energy_kcal?.toFixed(0) || '0'} kcal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
              <Beef className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Proteínas</p>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {nutrients.proteins?.toFixed(1) || '0'}g
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
              <Wheat className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Carboidratos</p>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {nutrients.carbohydrates?.toFixed(1) || '0'}g
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/30 p-2 rounded-lg">
              <Droplet className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Gorduras</p>
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {nutrients.fat?.toFixed(1) || '0'}g
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex-shrink-0 flex items-center">
          <Button
            onClick={() => onAdd(food)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-full px-4"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
