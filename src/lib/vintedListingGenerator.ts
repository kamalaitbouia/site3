import { Product } from '../types';

export type VintedLang = 'fr' | 'en' | 'ar';

export interface GeneratedVintedListing {
  title: string;
  description: string;
  hashtags: string[];
  fullText: string;
}

const CONDITION_TRANSLATIONS: Record<string, { fr: string; en: string; ar: string }> = {
  new_with_tag: {
    fr: 'Neuf avec étiquette 🏷️ Jamais porté',
    en: 'Brand new with tags 🏷️ Never worn',
    ar: 'جديد تماماً مع التيكيت الأصلي 🏷️ لم يُلبس أبداً',
  },
  new_no_tag: {
    fr: 'Neuf sans étiquette ✨ Impeccable',
    en: 'Brand new without tags ✨ Flawless condition',
    ar: 'جديد بدون تيكيت ✨ بحالة ممتازة جداً',
  },
  very_good: {
    fr: 'Très bon état 👌 Aucun défaut majeur, tissu propre',
    en: 'Very good condition 👌 Clean fabric, no flaws',
    ar: 'حالة ممتازة جداً 👌 نظيف وبدون أي عيوب',
  },
  good: {
    fr: 'Bon état 👍 Quelques légères traces d\'usage normales',
    en: 'Good condition 👍 Normal signs of gentle wear',
    ar: 'حالة جيدة 👍 علامات استخدام بسيطة وطبيعية',
  },
  satisfactory: {
    fr: 'État satisfaisant (voir photos pour détails)',
    en: 'Fair condition (please see photos for details)',
    ar: 'حالة مقبولة (انظر الصور لكافة التفاصيل)',
  },
};

const CATEGORY_TRANSLATIONS: Record<string, { fr: string; en: string; ar: string }> = {
  clothing: { fr: 'Vêtement', en: 'Clothing', ar: 'ملابس' },
  shoes: { fr: 'Chaussures / Sneakers', en: 'Shoes / Sneakers', ar: 'أحذية / سنيكرز' },
  bags: { fr: 'Sac / Maroquinerie', en: 'Bag / Backpack', ar: 'حقيبة' },
  accessories: { fr: 'Accessoire', en: 'Accessory', ar: 'إكسسوار' },
  electronics: { fr: 'Électronique', en: 'Electronics', ar: 'إلكترونيات' },
  beauty: { fr: 'Beauté / Soin', en: 'Beauty / Care', ar: 'عناية وجمال' },
  home: { fr: 'Maison / Décoration', en: 'Home / Deco', ar: 'ديكور ومنزل' },
  other: { fr: 'Autre', en: 'Other', ar: 'أخرى' },
};

export function generateVintedListing(product: Product, lang: VintedLang = 'fr'): GeneratedVintedListing {
  const brand = product.brand?.trim() || '';
  const size = product.size?.trim() || '';
  const color = product.color?.trim() || '';
  const conditionObj = CONDITION_TRANSLATIONS[product.condition] || CONDITION_TRANSLATIONS.very_good;
  const categoryObj = CATEGORY_TRANSLATIONS[product.category] || CATEGORY_TRANSLATIONS.clothing;
  const rawTitle = product.title?.trim() || '';

  // Generate hashtags based on attributes
  const tagsSet = new Set<string>();
  if (brand) tagsSet.add(`#${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
  tagsSet.add('#vinted');
  tagsSet.add('#vintedfrance');
  tagsSet.add('#vintage');
  tagsSet.add('#secondemain');
  tagsSet.add('#thrift');
  tagsSet.add('#ootd');

  if (product.category === 'clothing') {
    tagsSet.add('#mode');
    tagsSet.add('#streetwear');
    if (size) tagsSet.add(`#taille${size.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
  } else if (product.category === 'shoes') {
    tagsSet.add('#sneakers');
    tagsSet.add('#shoes');
    tagsSet.add('#kicks');
  } else if (product.category === 'bags') {
    tagsSet.add('#bagaddict');
    tagsSet.add('#luxurybag');
  }

  if (color) {
    tagsSet.add(`#${color.toLowerCase().replace(/\s+/g, '')}`);
  }

  const hashtags = Array.from(tagsSet);

  if (lang === 'fr') {
    const title = `${rawTitle} ${brand ? `- ${brand}` : ''} ${size ? `| Taille ${size}` : ''}`.trim();
    
    const lines = [
      `🌟 ${rawTitle}`,
      ``,
      `🏷️ Marque : ${brand || 'Sans marque / Vintage'}`,
      size ? `📏 Taille : ${size}` : null,
      color ? `🎨 Couleur : ${color}` : null,
      `✨ État : ${conditionObj.fr}`,
      `📦 Catégorie : ${categoryObj.fr}`,
      product.notes ? `💡 Détails / Remarques : ${product.notes}` : null,
      ``,
      `🚚 Envoi rapide et très soigné sous 24h/48h`,
      `💬 N'hésitez pas à m'envoyer un message pour toute question ou photos supplémentaires !`,
      `🛍️ Réduction sur les lots activée dans mon dressing`,
      ``,
      hashtags.slice(0, 8).join(' '),
    ].filter(Boolean);

    const fullText = lines.join('\n');
    return { title, description: lines.slice(1, -1).join('\n'), hashtags, fullText };
  }

  if (lang === 'en') {
    const title = `${rawTitle} ${brand ? `- ${brand}` : ''} ${size ? `| Size ${size}` : ''}`.trim();
    
    const lines = [
      `🌟 ${rawTitle}`,
      ``,
      `🏷️ Brand: ${brand || 'Unbranded / Vintage'}`,
      size ? `📏 Size: ${size}` : null,
      color ? `🎨 Color: ${color}` : null,
      `✨ Condition: ${conditionObj.en}`,
      `📦 Category: ${categoryObj.en}`,
      product.notes ? `💡 Notes: ${product.notes}` : null,
      ``,
      `🚚 Fast & secure dispatch within 24-48 hours`,
      `💬 Feel free to message me with any questions or bundle requests!`,
      `🛍️ Bundle discounts are active on my closet`,
      ``,
      hashtags.slice(0, 8).join(' '),
    ].filter(Boolean);

    const fullText = lines.join('\n');
    return { title, description: lines.slice(1, -1).join('\n'), hashtags, fullText };
  }

  // Arabic
  const title = `${rawTitle} ${brand ? `- ${brand}` : ''} ${size ? `| مقاس ${size}` : ''}`.trim();
  const lines = [
    `🌟 ${rawTitle}`,
    ``,
    `🏷️ الماركة: ${brand || 'أصلي / Vintage'}`,
    size ? `📏 المقاس: ${size}` : null,
    color ? `🎨 اللون: ${color}` : null,
    `✨ الحالة: ${conditionObj.ar}`,
    `📦 القسم: ${categoryObj.ar}`,
    product.notes ? `💡 ملاحظات: ${product.notes}` : null,
    ``,
    `🚚 تغليف محكم وشحن سريع ومضمون`,
    `💬 تواصل معي لأي استفسار أو صور إضافية`,
    `🛍️ خصم خاص متاح عند شراء عدة قطع معاً`,
    ``,
    hashtags.slice(0, 8).join(' '),
  ].filter(Boolean);

  const fullText = lines.join('\n');
  return { title, description: lines.slice(1, -1).join('\n'), hashtags, fullText };
}
