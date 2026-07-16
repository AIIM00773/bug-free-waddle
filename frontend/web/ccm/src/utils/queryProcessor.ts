


import { LOCAL_CATALOG } from "../Constants/fakedb";

export const processQuery = (queryText) => {
  const text = queryText.toLowerCase();

  // Basic localized categorization heuristics
  if (text.includes('sukuma') || text.includes('mboga') || text.includes('nyanya') || text.includes('onions') || text.includes('jioni')) {
    return LOCAL_CATALOG.filter(p => p.category === 'Groceries');
  } 
  
  if (text.includes('unga') || text.includes('ugali') || text.includes('mafuta') || text.includes('kupika') || text.includes('gas') || text.includes('mtungi')) {
    return LOCAL_CATALOG.filter(p => p.category === 'Essentials');
  } 
  
  if (text.includes('charger') || text.includes('usb') || text.includes('powerbank') || text.includes('cable') || text.includes('simu')) {
    return LOCAL_CATALOG.filter(p => p.category === 'Electronics');
  }

  // Fallback fuzzy search matching across catalog names, category text, or vendor title
  return LOCAL_CATALOG.filter(p => 
    p.name.toLowerCase().includes(text) || 
    p.category.toLowerCase().includes(text) ||
    p.shop.toLowerCase().includes(text)
  );
};
