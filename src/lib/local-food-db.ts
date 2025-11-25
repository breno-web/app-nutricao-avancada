// Banco de dados integrado com Supabase
import { Food } from './types';
import { supabase, Alimento } from './supabase';

// Cache local para performance
let cachedFoods: Food[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Função para converter alimento do Supabase para formato Food
function convertSupabaseToFood(alimento: Alimento): Food {
  return {
    id: `supabase-${alimento.id}`,
    code: alimento.codigo_barras || `supabase-${alimento.id}`,
    product_name: alimento.nome,
    categories: alimento.categoria || 'Outros',
    nutriments: {
      energy_kcal: alimento.calorias,
      proteins: alimento.proteinas,
      carbohydrates: alimento.carboidratos,
      fat: alimento.gorduras,
      fiber: 0, // Adicione campo fiber na tabela se necessário
    },
    serving_size: `${alimento.porcao}${alimento.unidade || 'g'}`,
  };
}

// Buscar alimentos do Supabase
async function fetchFoodsFromSupabase(): Promise<Food[]> {
  try {
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar alimentos do Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('Nenhum alimento encontrado no Supabase');
      return [];
    }

    return data.map(convertSupabaseToFood);
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    return [];
  }
}

// Função principal para obter alimentos (com cache)
async function getFoods(): Promise<Food[]> {
  const now = Date.now();
  
  // Retornar cache se ainda válido
  if (cachedFoods.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return cachedFoods;
  }

  // Buscar do Supabase
  const foods = await fetchFoodsFromSupabase();
  
  if (foods.length > 0) {
    cachedFoods = foods;
    lastFetchTime = now;
  }

  return cachedFoods;
}

// Função para buscar alimentos (com suporte a busca assíncrona)
export async function searchLocalFoods(query: string): Promise<Food[]> {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return [];

  const foods = await getFoods();

  return foods.filter((food) =>
    food.product_name.toLowerCase().includes(normalizedQuery) ||
    food.categories?.toLowerCase().includes(normalizedQuery)
  ).slice(0, 50);
}

// Função para buscar por categoria
export async function searchByCategory(category: string): Promise<Food[]> {
  const foods = await getFoods();
  
  return foods.filter((food) =>
    food.categories?.toLowerCase() === category.toLowerCase()
  );
}

// Função para obter alimento por ID
export async function getFoodById(id: string): Promise<Food | undefined> {
  const foods = await getFoods();
  return foods.find((food) => food.id === id);
}

// Estatísticas do banco de dados
export async function getDatabaseStats() {
  const foods = await getFoods();
  const categories = new Set(foods.map((f) => f.categories));
  
  return {
    totalFoods: foods.length,
    categories: Array.from(categories),
    categoriesCount: categories.size,
  };
}

// Obter todas as categorias disponíveis
export async function getAllCategories(): Promise<string[]> {
  const foods = await getFoods();
  const categories = new Set(foods.map((f) => f.categories).filter(Boolean));
  return Array.from(categories).sort();
}

// Buscar alimentos aleatórios (para sugestões)
export async function getRandomFoods(count: number = 10): Promise<Food[]> {
  const foods = await getFoods();
  const shuffled = [...foods].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Forçar atualização do cache
export async function refreshFoodCache(): Promise<void> {
  cachedFoods = [];
  lastFetchTime = 0;
  await getFoods();
}

// Exportar para compatibilidade (versão síncrona com fallback)
export const LOCAL_FOOD_DATABASE: Food[] = [];
