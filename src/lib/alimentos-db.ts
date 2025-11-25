// Banco de dados local de alimentos brasileiros
export interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  porcaoPadrao: string;
  imagem?: string;
}

export const alimentosDB: Alimento[] = [
  // Frutas
  { id: '1', nome: 'Maçã', categoria: 'Frutas', calorias: 52, proteinas: 0.3, carboidratos: 14, gorduras: 0.2, porcaoPadrao: '100g (1 unidade média)' },
  { id: '2', nome: 'Banana', categoria: 'Frutas', calorias: 89, proteinas: 1.1, carboidratos: 23, gorduras: 0.3, porcaoPadrao: '100g (1 unidade média)' },
  { id: '3', nome: 'Laranja', categoria: 'Frutas', calorias: 47, proteinas: 0.9, carboidratos: 12, gorduras: 0.1, porcaoPadrao: '100g (1 unidade média)' },
  { id: '4', nome: 'Morango', categoria: 'Frutas', calorias: 32, proteinas: 0.7, carboidratos: 8, gorduras: 0.3, porcaoPadrao: '100g (7-8 unidades)' },
  { id: '5', nome: 'Uva', categoria: 'Frutas', calorias: 69, proteinas: 0.7, carboidratos: 18, gorduras: 0.2, porcaoPadrao: '100g (1 cacho pequeno)' },
  { id: '6', nome: 'Melancia', categoria: 'Frutas', calorias: 30, proteinas: 0.6, carboidratos: 8, gorduras: 0.2, porcaoPadrao: '100g (1 fatia média)' },
  { id: '7', nome: 'Abacaxi', categoria: 'Frutas', calorias: 50, proteinas: 0.5, carboidratos: 13, gorduras: 0.1, porcaoPadrao: '100g (2 rodelas)' },
  { id: '8', nome: 'Manga', categoria: 'Frutas', calorias: 60, proteinas: 0.8, carboidratos: 15, gorduras: 0.4, porcaoPadrao: '100g (1/2 unidade)' },
  { id: '9', nome: 'Pera', categoria: 'Frutas', calorias: 57, proteinas: 0.4, carboidratos: 15, gorduras: 0.1, porcaoPadrao: '100g (1 unidade média)' },
  { id: '10', nome: 'Mamão', categoria: 'Frutas', calorias: 43, proteinas: 0.5, carboidratos: 11, gorduras: 0.3, porcaoPadrao: '100g (1 fatia)' },
  { id: '11', nome: 'Abacate', categoria: 'Frutas', calorias: 160, proteinas: 2, carboidratos: 9, gorduras: 15, porcaoPadrao: '100g (1/2 unidade)' },
  { id: '12', nome: 'Kiwi', categoria: 'Frutas', calorias: 61, proteinas: 1.1, carboidratos: 15, gorduras: 0.5, porcaoPadrao: '100g (1 unidade)' },
  { id: '13', nome: 'Melão', categoria: 'Frutas', calorias: 34, proteinas: 0.8, carboidratos: 8, gorduras: 0.2, porcaoPadrao: '100g (1 fatia)' },
  { id: '14', nome: 'Limão', categoria: 'Frutas', calorias: 29, proteinas: 1.1, carboidratos: 9, gorduras: 0.3, porcaoPadrao: '100g (2 unidades)' },
  { id: '15', nome: 'Goiaba', categoria: 'Frutas', calorias: 68, proteinas: 2.6, carboidratos: 14, gorduras: 1, porcaoPadrao: '100g (1 unidade)' },

  // Verduras e Legumes
  { id: '16', nome: 'Alface', categoria: 'Verduras', calorias: 15, proteinas: 1.4, carboidratos: 2.9, gorduras: 0.2, porcaoPadrao: '100g (3 folhas grandes)' },
  { id: '17', nome: 'Tomate', categoria: 'Verduras', calorias: 18, proteinas: 0.9, carboidratos: 3.9, gorduras: 0.2, porcaoPadrao: '100g (1 unidade média)' },
  { id: '18', nome: 'Cenoura', categoria: 'Verduras', calorias: 41, proteinas: 0.9, carboidratos: 10, gorduras: 0.2, porcaoPadrao: '100g (1 unidade média)' },
  { id: '19', nome: 'Brócolis', categoria: 'Verduras', calorias: 34, proteinas: 2.8, carboidratos: 7, gorduras: 0.4, porcaoPadrao: '100g (1 xícara)' },
  { id: '20', nome: 'Couve', categoria: 'Verduras', calorias: 49, proteinas: 4.3, carboidratos: 9, gorduras: 0.9, porcaoPadrao: '100g (2 folhas)' },
  { id: '21', nome: 'Espinafre', categoria: 'Verduras', calorias: 23, proteinas: 2.9, carboidratos: 3.6, gorduras: 0.4, porcaoPadrao: '100g (1 xícara)' },
  { id: '22', nome: 'Pepino', categoria: 'Verduras', calorias: 15, proteinas: 0.7, carboidratos: 3.6, gorduras: 0.1, porcaoPadrao: '100g (1/2 unidade)' },
  { id: '23', nome: 'Abobrinha', categoria: 'Verduras', calorias: 17, proteinas: 1.2, carboidratos: 3.1, gorduras: 0.3, porcaoPadrao: '100g (1/2 unidade)' },
  { id: '24', nome: 'Berinjela', categoria: 'Verduras', calorias: 25, proteinas: 1, carboidratos: 6, gorduras: 0.2, porcaoPadrao: '100g (1/2 unidade)' },
  { id: '25', nome: 'Cebola', categoria: 'Verduras', calorias: 40, proteinas: 1.1, carboidratos: 9, gorduras: 0.1, porcaoPadrao: '100g (1 unidade média)' },
  { id: '26', nome: 'Pimentão', categoria: 'Verduras', calorias: 31, proteinas: 1, carboidratos: 6, gorduras: 0.3, porcaoPadrao: '100g (1 unidade)' },
  { id: '27', nome: 'Beterraba', categoria: 'Verduras', calorias: 43, proteinas: 1.6, carboidratos: 10, gorduras: 0.2, porcaoPadrao: '100g (1 unidade pequena)' },
  { id: '28', nome: 'Rúcula', categoria: 'Verduras', calorias: 25, proteinas: 2.6, carboidratos: 3.7, gorduras: 0.7, porcaoPadrao: '100g (2 xícaras)' },
  { id: '29', nome: 'Agrião', categoria: 'Verduras', calorias: 11, proteinas: 2.3, carboidratos: 1.3, gorduras: 0.1, porcaoPadrao: '100g (1 maço)' },
  { id: '30', nome: 'Repolho', categoria: 'Verduras', calorias: 25, proteinas: 1.3, carboidratos: 6, gorduras: 0.1, porcaoPadrao: '100g (2 folhas)' },

  // Carnes e Proteínas
  { id: '31', nome: 'Frango (peito grelhado)', categoria: 'Carnes', calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6, porcaoPadrao: '100g (1 filé pequeno)' },
  { id: '32', nome: 'Carne Bovina (patinho)', categoria: 'Carnes', calorias: 143, proteinas: 21, carboidratos: 0, gorduras: 6, porcaoPadrao: '100g (1 bife pequeno)' },
  { id: '33', nome: 'Peixe (tilápia)', categoria: 'Carnes', calorias: 96, proteinas: 20, carboidratos: 0, gorduras: 1.7, porcaoPadrao: '100g (1 filé)' },
  { id: '34', nome: 'Ovo (cozido)', categoria: 'Carnes', calorias: 155, proteinas: 13, carboidratos: 1.1, gorduras: 11, porcaoPadrao: '100g (2 unidades)' },
  { id: '35', nome: 'Carne Suína (lombo)', categoria: 'Carnes', calorias: 143, proteinas: 21, carboidratos: 0, gorduras: 6, porcaoPadrao: '100g (1 bife)' },
  { id: '36', nome: 'Salmão', categoria: 'Carnes', calorias: 208, proteinas: 20, carboidratos: 0, gorduras: 13, porcaoPadrao: '100g (1 filé)' },
  { id: '37', nome: 'Atum (conserva)', categoria: 'Carnes', calorias: 116, proteinas: 26, carboidratos: 0, gorduras: 0.8, porcaoPadrao: '100g (1 lata)' },
  { id: '38', nome: 'Camarão', categoria: 'Carnes', calorias: 99, proteinas: 24, carboidratos: 0.2, gorduras: 0.3, porcaoPadrao: '100g (10 unidades)' },
  { id: '39', nome: 'Peito de Peru', categoria: 'Carnes', calorias: 104, proteinas: 24, carboidratos: 0, gorduras: 1, porcaoPadrao: '100g (4 fatias)' },
  { id: '40', nome: 'Carne Moída', categoria: 'Carnes', calorias: 250, proteinas: 26, carboidratos: 0, gorduras: 17, porcaoPadrao: '100g (1/2 xícara)' },

  // Laticínios
  { id: '41', nome: 'Leite Integral', categoria: 'Laticínios', calorias: 61, proteinas: 3.2, carboidratos: 4.8, gorduras: 3.3, porcaoPadrao: '100ml (1/2 copo)' },
  { id: '42', nome: 'Iogurte Natural', categoria: 'Laticínios', calorias: 61, proteinas: 3.5, carboidratos: 4.7, gorduras: 3.3, porcaoPadrao: '100g (1 pote pequeno)' },
  { id: '43', nome: 'Queijo Minas', categoria: 'Laticínios', calorias: 264, proteinas: 17.4, carboidratos: 3.1, gorduras: 20.8, porcaoPadrao: '100g (3 fatias)' },
  { id: '44', nome: 'Requeijão', categoria: 'Laticínios', calorias: 270, proteinas: 9, carboidratos: 3, gorduras: 25, porcaoPadrao: '100g (4 colheres)' },
  { id: '45', nome: 'Leite Desnatado', categoria: 'Laticínios', calorias: 34, proteinas: 3.4, carboidratos: 5, gorduras: 0.1, porcaoPadrao: '100ml (1/2 copo)' },
  { id: '46', nome: 'Iogurte Grego', categoria: 'Laticínios', calorias: 97, proteinas: 9, carboidratos: 3.6, gorduras: 5, porcaoPadrao: '100g (1 pote)' },
  { id: '47', nome: 'Queijo Cottage', categoria: 'Laticínios', calorias: 98, proteinas: 11, carboidratos: 3.4, gorduras: 4.3, porcaoPadrao: '100g (1/2 xícara)' },
  { id: '48', nome: 'Mussarela', categoria: 'Laticínios', calorias: 280, proteinas: 18, carboidratos: 3, gorduras: 22, porcaoPadrao: '100g (3 fatias)' },

  // Cereais e Grãos
  { id: '49', nome: 'Arroz Branco (cozido)', categoria: 'Cereais', calorias: 130, proteinas: 2.7, carboidratos: 28, gorduras: 0.3, porcaoPadrao: '100g (4 colheres)' },
  { id: '50', nome: 'Arroz Integral (cozido)', categoria: 'Cereais', calorias: 123, proteinas: 2.6, carboidratos: 26, gorduras: 1, porcaoPadrao: '100g (4 colheres)' },
  { id: '51', nome: 'Feijão Preto (cozido)', categoria: 'Cereais', calorias: 77, proteinas: 4.5, carboidratos: 14, gorduras: 0.5, porcaoPadrao: '100g (1 concha)' },
  { id: '52', nome: 'Macarrão (cozido)', categoria: 'Cereais', calorias: 131, proteinas: 5, carboidratos: 25, gorduras: 1.1, porcaoPadrao: '100g (1 pegador)' },
  { id: '53', nome: 'Pão Francês', categoria: 'Cereais', calorias: 300, proteinas: 8, carboidratos: 58, gorduras: 3.5, porcaoPadrao: '100g (2 unidades)' },
  { id: '54', nome: 'Aveia', categoria: 'Cereais', calorias: 389, proteinas: 17, carboidratos: 66, gorduras: 7, porcaoPadrao: '100g (10 colheres)' },
  { id: '55', nome: 'Batata (cozida)', categoria: 'Cereais', calorias: 77, proteinas: 2, carboidratos: 17, gorduras: 0.1, porcaoPadrao: '100g (1 unidade pequena)' },
  { id: '56', nome: 'Batata Doce (cozida)', categoria: 'Cereais', calorias: 86, proteinas: 1.6, carboidratos: 20, gorduras: 0.1, porcaoPadrao: '100g (1 unidade pequena)' },
  { id: '57', nome: 'Pão Integral', categoria: 'Cereais', calorias: 247, proteinas: 13, carboidratos: 41, gorduras: 3.4, porcaoPadrao: '100g (3 fatias)' },
  { id: '58', nome: 'Quinoa (cozida)', categoria: 'Cereais', calorias: 120, proteinas: 4.4, carboidratos: 21, gorduras: 1.9, porcaoPadrao: '100g (1/2 xícara)' },
  { id: '59', nome: 'Granola', categoria: 'Cereais', calorias: 471, proteinas: 13, carboidratos: 64, gorduras: 20, porcaoPadrao: '100g (1 xícara)' },
  { id: '60', nome: 'Tapioca', categoria: 'Cereais', calorias: 358, proteinas: 0.2, carboidratos: 88, gorduras: 0.03, porcaoPadrao: '100g (2 unidades)' },

  // Oleaginosas e Sementes
  { id: '61', nome: 'Amendoim', categoria: 'Oleaginosas', calorias: 567, proteinas: 26, carboidratos: 16, gorduras: 49, porcaoPadrao: '100g (1 xícara)' },
  { id: '62', nome: 'Castanha de Caju', categoria: 'Oleaginosas', calorias: 553, proteinas: 18, carboidratos: 30, gorduras: 44, porcaoPadrao: '100g (3/4 xícara)' },
  { id: '63', nome: 'Amêndoas', categoria: 'Oleaginosas', calorias: 579, proteinas: 21, carboidratos: 22, gorduras: 50, porcaoPadrao: '100g (3/4 xícara)' },
  { id: '64', nome: 'Nozes', categoria: 'Oleaginosas', calorias: 654, proteinas: 15, carboidratos: 14, gorduras: 65, porcaoPadrao: '100g (1 xícara)' },
  { id: '65', nome: 'Castanha do Pará', categoria: 'Oleaginosas', calorias: 656, proteinas: 14, carboidratos: 12, gorduras: 66, porcaoPadrao: '100g (15 unidades)' },

  // Bebidas
  { id: '66', nome: 'Suco de Laranja Natural', categoria: 'Bebidas', calorias: 45, proteinas: 0.7, carboidratos: 10, gorduras: 0.2, porcaoPadrao: '100ml (1/2 copo)' },
  { id: '67', nome: 'Café (sem açúcar)', categoria: 'Bebidas', calorias: 2, proteinas: 0.3, carboidratos: 0, gorduras: 0, porcaoPadrao: '100ml (1 xícara)' },
  { id: '68', nome: 'Chá Verde', categoria: 'Bebidas', calorias: 1, proteinas: 0, carboidratos: 0, gorduras: 0, porcaoPadrao: '100ml (1 xícara)' },
  { id: '69', nome: 'Água de Coco', categoria: 'Bebidas', calorias: 19, proteinas: 0.7, carboidratos: 3.7, gorduras: 0.2, porcaoPadrao: '100ml (1/2 copo)' },
  { id: '70', nome: 'Refrigerante', categoria: 'Bebidas', calorias: 42, proteinas: 0, carboidratos: 11, gorduras: 0, porcaoPadrao: '100ml (1/2 copo)' },
];

// Função para buscar alimentos por nome
export function buscarAlimentos(query: string): Alimento[] {
  const queryLower = query.toLowerCase().trim();
  
  if (!queryLower) return [];
  
  return alimentosDB.filter(alimento => 
    alimento.nome.toLowerCase().includes(queryLower) ||
    alimento.categoria.toLowerCase().includes(queryLower)
  );
}

// Função para buscar alimentos por categoria
export function buscarPorCategoria(categoria: string): Alimento[] {
  if (categoria === 'all') return alimentosDB;
  
  return alimentosDB.filter(alimento => 
    alimento.categoria.toLowerCase() === categoria.toLowerCase()
  );
}

// Função para obter todas as categorias
export function obterCategorias(): string[] {
  const categorias = new Set(alimentosDB.map(a => a.categoria));
  return Array.from(categorias);
}
