'use client';

import { useState, useEffect } from 'react';
import { 
  Camera, Search, TrendingUp, Settings, Plus, Home, BookOpen, 
  Dumbbell, User, Droplets, Weight, Target, Award, Calendar,
  ChevronRight, Flame, Activity, Sun, Moon, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarcodeScanner } from '@/components/custom/barcode-scanner';
import { FoodCard } from '@/components/custom/food-card';
import { NutritionChart } from '@/components/custom/nutrition-chart';
import { DailyLog } from '@/components/custom/daily-log';
import { buscarAlimentos, buscarPorCategoria, obterCategorias, Alimento } from '@/lib/alimentos-db';
import { getTodayLog, addFoodToToday, removeFoodFromToday, getGoals, addWaterIntake, getWaterIntake, addExercise, getExercises, getUserProfile, saveUserProfile } from '@/lib/storage';
import { Food, FoodEntry, Exercise, UserProfile } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function MaxNutraEase() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Alimento[]>([]);
  const [filteredResults, setFilteredResults] = useState<Alimento[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dailyLog, setDailyLog] = useState(getTodayLog());
  const [goals] = useState(getGoals());
  const [selectedFood, setSelectedFood] = useState<Alimento | null>(null);
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [waterIntake, setWaterIntake] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Novos estados para filtros e exercícios
  const [foodTypeFilter, setFoodTypeFilter] = useState<string>('all');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState(30);
  const [exerciseType, setExerciseType] = useState('running');
  
  // Estados para edição de perfil
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState(0);
  const [editHeight, setEditHeight] = useState(0);
  const [editAge, setEditAge] = useState(0);
  const [editGoalWeight, setEditGoalWeight] = useState(0);

  // Carregar dados do cliente apenas após montagem
  useEffect(() => {
    setMounted(true);
    setDailyLog(getTodayLog());
    setWaterIntake(getWaterIntake());
    setExercises(getExercises());
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Atualizar estados de edição quando o perfil mudar
  useEffect(() => {
    if (mounted) {
      setEditName(userProfile.name);
      setEditWeight(userProfile.weight);
      setEditHeight(userProfile.height);
      setEditAge(userProfile.age);
      setEditGoalWeight(userProfile.goalWeight);
    }
  }, [userProfile, mounted]);

  // Filtrar resultados por tipo de alimento
  useEffect(() => {
    if (foodTypeFilter === 'all') {
      setFilteredResults(searchResults);
    } else {
      const filtered = searchResults.filter(alimento => 
        alimento.categoria.toLowerCase() === foodTypeFilter.toLowerCase()
      );
      setFilteredResults(filtered);
    }
  }, [searchResults, foodTypeFilter]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handlePhotoScan = async (imageData: string) => {
    setShowScanner(false);
    // Por enquanto, apenas mostra mensagem - futuramente pode integrar com IA para reconhecer alimento
    alert('Foto capturada! Em breve, usaremos IA para identificar o alimento automaticamente. Por enquanto, busque manualmente na lista.');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const results = buscarAlimentos(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAddFood = (alimento: Alimento) => {
    setSelectedFood(alimento);
  };

  const confirmAddFood = () => {
    if (!selectedFood) return;

    // Converter Alimento para Food
    const food: Food = {
      id: selectedFood.id,
      product_name: selectedFood.nome,
      brands: selectedFood.categoria,
      nutriments: {
        'energy-kcal_100g': selectedFood.calorias,
        proteins_100g: selectedFood.proteinas,
        carbohydrates_100g: selectedFood.carboidratos,
        fat_100g: selectedFood.gorduras,
      },
      categories: selectedFood.categoria,
    };

    const entry: FoodEntry = {
      food,
      servings,
      mealType,
      timestamp: new Date().toISOString(),
    };

    addFoodToToday(entry);
    setDailyLog(getTodayLog());
    setSelectedFood(null);
    setServings(1);
    setSearchResults([]);
    setFilteredResults([]);
    setSearchQuery('');
    setFoodTypeFilter('all');
  };

  const handleRemoveFood = (index: number) => {
    removeFoodFromToday(index);
    setDailyLog(getTodayLog());
  };

  const handleAddWater = () => {
    const newIntake = addWaterIntake(250);
    setWaterIntake(newIntake);
  };

  const handleAddExercise = () => {
    if (!exerciseName.trim()) {
      alert('Por favor, digite o nome do exercício');
      return;
    }

    const exerciseCalories: { [key: string]: number } = {
      running: 10,
      walking: 4,
      cycling: 8,
      swimming: 11,
      gym: 6,
      yoga: 3,
      dancing: 5,
      sports: 7,
    };

    const caloriesPerMinute = exerciseCalories[exerciseType] || 5;
    const totalCalories = caloriesPerMinute * exerciseDuration;

    const newExercise: Exercise = {
      name: exerciseName,
      duration: exerciseDuration,
      caloriesBurned: totalCalories,
      timestamp: new Date().toISOString(),
    };

    addExercise(newExercise);
    setExercises(getExercises());
    setShowAddExercise(false);
    setExerciseName('');
    setExerciseDuration(30);
    setExerciseType('running');
  };

  const handleSaveProfile = () => {
    const updatedProfile: UserProfile = {
      name: editName,
      email: userProfile.email,
      weight: editWeight,
      height: editHeight,
      age: editAge,
      goalWeight: editGoalWeight,
    };

    saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);
    setShowProfile(false);
  };

  // Prevenir hidratação incorreta - calcular apenas no cliente
  const totalCaloriesBurned = mounted ? exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0) : 0;
  const netCalories = mounted ? dailyLog.totals.calories - totalCaloriesBurned : 0;
  const remainingCalories = mounted ? goals.calories - netCalories : goals.calories;

  const caloriesProgress = mounted ? (netCalories / goals.calories) * 100 : 0;
  const waterProgress = mounted ? (waterIntake / 2000) * 100 : 0;

  // Não renderizar até montar no cliente (previne hidratação)
  if (!mounted) {
    return null;
  }

  const categorias = obterCategorias();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-white to-orange-50'}`}>
      {/* Header */}
      <header className={`shadow-2xl sticky top-0 z-50 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-[#FFA84C] to-orange-500'} text-white`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <Flame className={`w-7 h-7 ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">MaxNutraEase</h1>
                <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-orange-100'}`}>
                  Seu parceiro nutricional completo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-white/20'}`}
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-white hover:bg-white/20'}`}
                onClick={() => setShowProfile(true)}
              >
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 border-t shadow-2xl z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-5 gap-1">
            {[
              { id: 'dashboard', icon: Home, label: 'Início' },
              { id: 'diary', icon: Calendar, label: 'Diário' },
              { id: 'exercises', icon: Dumbbell, label: 'Exercícios' },
              { id: 'ebooks', icon: BookOpen, label: 'E-books' },
              { id: 'profile', icon: User, label: 'Perfil' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-3 transition-all duration-300 ${
                  activeTab === tab.id
                    ? isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'
                    : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`border-0 shadow-xl ${isDarkMode ? 'bg-gradient-to-br from-orange-600 to-orange-700' : 'bg-gradient-to-br from-[#FFA84C] to-orange-500'} text-white`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Calorias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round(netCalories)}</div>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-orange-200' : 'text-orange-100'}`}>
                    de {goals.calories} kcal
                  </p>
                  <Progress value={caloriesProgress} className={`mt-3 h-2 ${isDarkMode ? 'bg-orange-800/50' : 'bg-white/30'}`} />
                </CardContent>
              </Card>

              <Card className={`shadow-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-2 border-orange-200'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-medium flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <Activity className={`w-4 h-4 ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`} />
                    Queimadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(totalCaloriesBurned)}</div>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal em exercícios</p>
                </CardContent>
              </Card>

              <Card className={`shadow-xl ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-2 border-orange-200'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-sm font-medium flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    <Target className={`w-4 h-4 ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`} />
                    Restantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{Math.round(remainingCalories)}</div>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal para meta</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={() => setActiveTab('diary')}
                  className={`h-24 flex-col gap-2 shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 'bg-gradient-to-br from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C]'} text-white`}
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Refeição</span>
                </Button>

                <Button
                  onClick={() => setShowAddExercise(true)}
                  className="h-24 flex-col gap-2 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white shadow-lg"
                >
                  <Dumbbell className="w-6 h-6" />
                  <span className="text-sm">Exercício</span>
                </Button>

                <Button
                  onClick={handleAddWater}
                  className="h-24 flex-col gap-2 bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg"
                >
                  <Droplets className="w-6 h-6" />
                  <span className="text-sm">Água (250ml)</span>
                </Button>

                <Button
                  onClick={() => setShowProfile(true)}
                  className="h-24 flex-col gap-2 bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg"
                >
                  <Weight className="w-6 h-6" />
                  <span className="text-sm">Peso</span>
                </Button>
              </CardContent>
            </Card>

            {/* Water Intake */}
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Hidratação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{waterIntake}ml</span>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Meta: 2000ml</span>
                </div>
                <Progress value={waterProgress} className="h-3" />
              </CardContent>
            </Card>

            {/* Nutrition Chart */}
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Progresso Nutricional</CardTitle>
              </CardHeader>
              <CardContent>
                <NutritionChart totals={dailyLog.totals} goals={goals} />
              </CardContent>
            </Card>

            {/* Premium Banner */}
            <Card className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-6 h-6" />
                      <h3 className="text-xl font-bold">Torne-se Premium</h3>
                    </div>
                    <p className="text-orange-100 text-sm mb-3">
                      Acesso ilimitado a receitas, planos e muito mais
                    </p>
                    <Badge className="bg-white text-orange-600 font-bold">
                      15% OFF no plano trimestral
                    </Badge>
                  </div>
                  <ChevronRight className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Diary Tab */}
        {activeTab === 'diary' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Search */}
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardContent className="p-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Buscar alimento... (ex: banana, frango, arroz)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className={`h-12 text-base ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : 'border-2 border-orange-200 focus:border-[#FFA84C]'}`}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className={`h-12 px-6 text-white ${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 'bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C]'}`}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>

                {/* Filtro de Tipo de Alimento */}
                {searchResults.length > 0 && (
                  <div className="mb-4">
                    <Label className={`mb-2 flex items-center gap-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <Filter className="w-4 h-4" />
                      Filtrar por categoria
                    </Label>
                    <Select value={foodTypeFilter} onValueChange={setFoodTypeFilter}>
                      <SelectTrigger className={`h-12 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-2 border-orange-200'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categorias.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  onClick={() => setShowScanner(true)}
                  className="w-full h-14 text-base font-bold bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white shadow-lg"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Fotografar Alimento
                </Button>
              </CardContent>
            </Card>

            {/* Search Results */}
            {filteredResults.length > 0 && (
              <div className="space-y-3">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Resultados ({filteredResults.length})
                </h2>
                {filteredResults.map((alimento) => (
                  <Card 
                    key={alimento.id} 
                    className={`shadow-lg cursor-pointer transition-all hover:shadow-xl ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'hover:border-orange-300'}`}
                    onClick={() => handleAddFood(alimento)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{alimento.nome}</h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{alimento.categoria}</p>
                          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{alimento.porcaoPadrao}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`}>
                            {alimento.calorias}
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal</div>
                        </div>
                      </div>
                      <div className={`grid grid-cols-3 gap-2 mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="text-center">
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Proteínas</div>
                          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{alimento.proteinas}g</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Carboidratos</div>
                          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{alimento.carboidratos}g</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gorduras</div>
                          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{alimento.gorduras}g</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Daily Log */}
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Diário de Hoje</CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                  {dailyLog.foods.length} alimentos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DailyLog foods={dailyLog.foods} onRemove={handleRemoveFood} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-xl flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Dumbbell className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`} />
                  Exercícios de Hoje
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                  Total queimado: {Math.round(totalCaloriesBurned)} kcal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercises.length === 0 ? (
                  <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Dumbbell className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p>Nenhum exercício registrado hoje</p>
                  </div>
                ) : (
                  exercises.map((exercise, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                      <div>
                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{exercise.name}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{exercise.duration} minutos</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`}>
                          {Math.round(exercise.caloriesBurned)}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal</div>
                      </div>
                    </div>
                  ))
                )}

                <Button
                  onClick={() => setShowAddExercise(true)}
                  className={`w-full h-14 text-base font-bold text-white shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 'bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C]'}`}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Exercício
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* E-books Tab */}
        {activeTab === 'ebooks' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-xl flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`} />
                  E-books & Receitas
                </CardTitle>
                <CardDescription className={isDarkMode ? 'text-gray-400' : ''}>
                  Conteúdo exclusivo adicionado pelo administrador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`text-center py-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <BookOpen className={`w-20 h-20 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nenhum e-book disponível no momento
                  </h3>
                  <p className="text-sm max-w-md mx-auto">
                    Os e-books são adicionados exclusivamente pelo administrador. 
                    Fique atento para novos conteúdos!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Card className={`shadow-xl border-0 ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <CardHeader>
                <CardTitle className={`text-xl flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <User className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`} />
                  Meu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold ${isDarkMode ? 'bg-gradient-to-br from-orange-600 to-orange-700' : 'bg-gradient-to-br from-[#FFA84C] to-orange-500'}`}>
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.name}</h3>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{userProfile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Peso Atual</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.weight} kg</div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Altura</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.height} cm</div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Idade</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.age} anos</div>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Meta</div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.goalWeight} kg</div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowProfile(true)}
                  className={`w-full h-12 text-white ${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 'bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C]'}`}
                >
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handlePhotoScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Add Food Dialog */}
      <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
        <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Adicionar Alimento</DialogTitle>
          </DialogHeader>

          {selectedFood && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{selectedFood.nome}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedFood.categoria}
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {selectedFood.porcaoPadrao}
                  </p>
                </div>
              </div>

              <div className={`grid grid-cols-4 gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                <div className="text-center">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Calorias</div>
                  <div className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`}>{selectedFood.calorias}</div>
                </div>
                <div className="text-center">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Proteínas</div>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFood.proteinas}g</div>
                </div>
                <div className="text-center">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carbs</div>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFood.carboidratos}g</div>
                </div>
                <div className="text-center">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gorduras</div>
                  <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedFood.gorduras}g</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Número de Porções</Label>
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={servings}
                    onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                    className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                </div>

                <div>
                  <Label>Refeição</Label>
                  <Select value={mealType} onValueChange={(v: any) => setMealType(v)}>
                    <SelectTrigger className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                      <SelectItem value="breakfast">Café da Manhã</SelectItem>
                      <SelectItem value="lunch">Almoço</SelectItem>
                      <SelectItem value="dinner">Jantar</SelectItem>
                      <SelectItem value="snack">Lanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={confirmAddFood}
                className={`w-full h-12 text-lg font-bold ${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 'bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C]'}`}
              >
                Adicionar ao Diário
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Exercise Dialog */}
      <Dialog open={showAddExercise} onOpenChange={setShowAddExercise}>
        <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Adicionar Exercício</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome do Exercício</Label>
              <Input 
                placeholder="Ex: Corrida no parque"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' : ''}`}
              />
            </div>
            <div>
              <Label>Tipo de Exercício</Label>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? 'bg-gray-700 border-gray-600' : ''}>
                  <SelectItem value="running">Corrida (10 kcal/min)</SelectItem>
                  <SelectItem value="walking">Caminhada (4 kcal/min)</SelectItem>
                  <SelectItem value="cycling">Ciclismo (8 kcal/min)</SelectItem>
                  <SelectItem value="swimming">Natação (11 kcal/min)</SelectItem>
                  <SelectItem value="gym">Musculação (6 kcal/min)</SelectItem>
                  <SelectItem value="yoga">Yoga (3 kcal/min)</SelectItem>
                  <SelectItem value="dancing">Dança (5 kcal/min)</SelectItem>
                  <SelectItem value="sports">Esportes (7 kcal/min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duração (minutos)</Label>
              <Input 
                type="number" 
                min="1" 
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(parseInt(e.target.value) || 30)}
                className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
              />
            </div>
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Calorias estimadas</div>
              <div className={`text-3xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#FFA84C]'}`}>
                {Math.round((exerciseType === 'running' ? 10 : 
                             exerciseType === 'walking' ? 4 : 
                             exerciseType === 'cycling' ? 8 : 
                             exerciseType === 'swimming' ? 11 : 
                             exerciseType === 'gym' ? 6 : 
                             exerciseType === 'yoga' ? 3 : 
                             exerciseType === 'dancing' ? 5 : 7) * exerciseDuration)} kcal
              </div>
            </div>
            <Button 
              onClick={handleAddExercise}
              className={`w-full h-12 text-white ${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 'bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C]'}`}
            >
              Adicionar Exercício
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Peso (kg)</Label>
                <Input 
                  type="number" 
                  value={editWeight} 
                  onChange={(e) => setEditWeight(parseFloat(e.target.value) || 0)}
                  className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
                />
              </div>
              <div>
                <Label>Altura (cm)</Label>
                <Input 
                  type="number" 
                  value={editHeight} 
                  onChange={(e) => setEditHeight(parseFloat(e.target.value) || 0)}
                  className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Idade</Label>
                <Input 
                  type="number" 
                  value={editAge} 
                  onChange={(e) => setEditAge(parseInt(e.target.value) || 0)}
                  className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
                />
              </div>
              <div>
                <Label>Meta (kg)</Label>
                <Input 
                  type="number" 
                  value={editGoalWeight} 
                  onChange={(e) => setEditGoalWeight(parseFloat(e.target.value) || 0)}
                  className={`mt-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} 
                />
              </div>
            </div>
            <Button 
              onClick={handleSaveProfile}
              className={`w-full h-12 text-white ${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' : 'bg-gradient-to-r from-[#FFA84C] to-orange-500 hover:from-orange-500 hover:to-[#FFA84C]'}`}
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
