// Array of 30 high-quality agriculture/farming related images from Unsplash
export const questImages = [
  "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2570&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530507629858-e3759c1ee04f?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=2674&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500595046743-cd271d694e30?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2590&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464226066583-0dea68c052f6?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570586437263-ab629fccc818?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537721664796-76f77222a5d0?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601424778493-821c0388311e?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559884743-74a57598c6c7?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1628449620501-ec55ffc1244f?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531209039631-9cb975a648f3?q=80&w=2574&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1489657780376-e0d8630c4bd3?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2532&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537721664796-76f77222a5d0?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572731612232-28c15183d010?q=80&w=2700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532467411038-57680e3dc0f1?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1627626775846-122b778965ae?q=80&w=2670&auto=format&fit=crop"
];

/**
 * Get a random quest image from the collection
 * @param seed Optional seed to always get the same image for a specific quest ID
 * @returns URL of a random quest image
 */
export const getRandomQuestImage = (seed?: string): string => {
  if (seed) {
    // If a seed is provided (like a quest ID), use it to deterministically select an image
    // This ensures the same quest always shows the same image
    const seedNum = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return questImages[seedNum % questImages.length];
  }
  
  // Otherwise, just get a random image
  const randomIndex = Math.floor(Math.random() * questImages.length);
  return questImages[randomIndex];
};

/**
 * Default fallback image if all else fails
 */
export const defaultQuestImage = questImages[0]; 