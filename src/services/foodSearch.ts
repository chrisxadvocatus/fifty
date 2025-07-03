export function searchFoods(query: string, allFoods: string[]): string[] {
  if (!query) return [];
  return allFoods.filter(food =>
    food.toLowerCase().includes(query.toLowerCase())
  );
} 

