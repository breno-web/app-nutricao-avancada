import { Food } from './types';
import { searchLocalFoods } from './local-food-db';

// Buscar alimento por código de barras
export async function searchFoodByBarcode(barcode: string): Promise<Food | null> {
  try {
    // Primeiro tenta buscar localmente no Supabase
    const localResults = await searchLocalFoods(barcode);
    if (localResults.length > 0) {
      return localResults[0];
    }

    // Se não encontrar localmente, busca na API OpenFoodFacts
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status === 0) {
      return null;
    }

    const product = data.product;

    return {
      id: product.code || barcode,
      code: product.code || barcode,
      product_name: product.product_name || 'Produto sem nome',
      brands: product.brands || '',
      categories: product.categories || '',
      image_url: product.image_url || product.image_front_url || '',
      nutriments: {
        energy_kcal: product.nutriments?.['energy-kcal_100g'] || 0,
        proteins: product.nutriments?.proteins_100g || 0,
        carbohydrates: product.nutriments?.carbohydrates_100g || 0,
        fat: product.nutriments?.fat_100g || 0,
        fiber: product.nutriments?.fiber_100g || 0,
      },
      serving_size: product.serving_size || '100g',
    };
  } catch (error) {
    console.error('Erro ao buscar alimento:', error);
    return null;
  }
}

// Buscar alimentos por nome
export async function searchFoodByName(query: string): Promise<Food[]> {
  try {
    // Primeiro busca localmente no Supabase (prioridade)
    const localResults = await searchLocalFoods(query);
    
    // Se encontrou resultados locais suficientes, retorna apenas eles
    if (localResults.length >= 20) {
      return localResults;
    }

    // Se não encontrou muitos resultados locais, complementa com OpenFoodFacts
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&page_size=20&json=true`
    );

    if (!response.ok) {
      return localResults; // Retorna apenas os resultados locais se a API falhar
    }

    const data = await response.json();

    const onlineResults = (data.products || []).map((product: any) => ({
      id: product.code || product._id,
      code: product.code || product._id,
      product_name: product.product_name || 'Produto sem nome',
      brands: product.brands || '',
      categories: product.categories || '',
      image_url: product.image_url || product.image_front_url || '',
      nutriments: {
        energy_kcal: product.nutriments?.['energy-kcal_100g'] || 0,
        proteins: product.nutriments?.proteins_100g || 0,
        carbohydrates: product.nutriments?.carbohydrates_100g || 0,
        fat: product.nutriments?.fat_100g || 0,
        fiber: product.nutriments?.fiber_100g || 0,
      },
      serving_size: product.serving_size || '100g',
    }));

    // Combina resultados locais (prioridade) com resultados online
    // Remove duplicatas baseado no nome
    const combined = [...localResults];
    const existingNames = new Set(localResults.map(f => f.product_name.toLowerCase()));
    
    for (const food of onlineResults) {
      if (!existingNames.has(food.product_name.toLowerCase())) {
        combined.push(food);
        existingNames.add(food.product_name.toLowerCase());
      }
    }

    return combined.slice(0, 50); // Limita a 50 resultados
  } catch (error) {
    console.error('Erro ao buscar alimentos:', error);
    // Em caso de erro, retorna apenas os resultados locais
    return localResults;
  }
}
