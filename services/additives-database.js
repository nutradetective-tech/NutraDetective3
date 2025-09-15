// additives-database.js
// Comprehensive database of food additives (E-numbers) with health information

export const ADDITIVES_DATABASE = {
  // E100-E199: Colors
  'en:e100': {
    code: 'E100',
    name: 'Curcumin',
    category: 'color',
    severity: 'low',
    description: 'Natural yellow color from turmeric root',
    healthImpact: 'Generally safe. May have anti-inflammatory properties. Large amounts may cause stomach upset.'
  },
  'en:e101': {
    code: 'E101',
    name: 'Riboflavin (Vitamin B2)',
    category: 'color',
    severity: 'low',
    description: 'Yellow color, also vitamin B2',
    healthImpact: 'Safe and beneficial. Essential vitamin for body function.'
  },
  'en:e102': {
    code: 'E102',
    name: 'Tartrazine',
    category: 'color',
    severity: 'high',
    description: 'Synthetic yellow azo dye',
    healthImpact: 'May cause hyperactivity in children, asthma, and allergic reactions. Banned in some countries.'
  },
  'en:e104': {
    code: 'E104',
    name: 'Quinoline Yellow',
    category: 'color',
    severity: 'high',
    description: 'Synthetic yellow dye',
    healthImpact: 'Linked to hyperactivity, skin rashes, and respiratory problems. Banned in several countries.'
  },
  'en:e110': {
    code: 'E110',
    name: 'Sunset Yellow FCF',
    category: 'color',
    severity: 'high',
    description: 'Synthetic orange azo dye',
    healthImpact: 'May cause hyperactivity, allergic reactions, and stomach upset. Some studies link to tumors.'
  },
  'en:e120': {
    code: 'E120',
    name: 'Cochineal/Carmine',
    category: 'color',
    severity: 'medium',
    description: 'Red color from crushed insects',
    healthImpact: 'Can cause severe allergic reactions in some people. Not vegetarian/vegan.'
  },
  'en:e122': {
    code: 'E122',
    name: 'Azorubine/Carmoisine',
    category: 'color',
    severity: 'high',
    description: 'Synthetic red azo dye',
    healthImpact: 'Linked to hyperactivity and allergic reactions. Banned in several countries.'
  },
  'en:e123': {
    code: 'E123',
    name: 'Amaranth',
    category: 'color',
    severity: 'high',
    description: 'Synthetic red dye',
    healthImpact: 'Banned in USA due to potential carcinogenic effects. May cause hyperactivity.'
  },
  'en:e124': {
    code: 'E124',
    name: 'Ponceau 4R',
    category: 'color',
    severity: 'high',
    description: 'Synthetic red azo dye',
    healthImpact: 'May trigger asthma and hyperactivity. Banned in USA and Norway.'
  },
  'en:e127': {
    code: 'E127',
    name: 'Erythrosine',
    category: 'color',
    severity: 'high',
    description: 'Synthetic cherry-red dye',
    healthImpact: 'Contains iodine. May affect thyroid function. Linked to hyperactivity.'
  },
  'en:e129': {
    code: 'E129',
    name: 'Allura Red AC',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic red azo dye',
    healthImpact: 'May cause hyperactivity in children. Some allergic reactions reported.'
  },
  'en:e131': {
    code: 'E131',
    name: 'Patent Blue V',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic blue dye',
    healthImpact: 'Can cause allergic reactions, particularly in people with aspirin sensitivity.'
  },
  'en:e132': {
    code: 'E132',
    name: 'Indigo Carmine',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic blue dye',
    healthImpact: 'May cause nausea, vomiting, and high blood pressure. Some allergic reactions.'
  },
  'en:e133': {
    code: 'E133',
    name: 'Brilliant Blue FCF',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic blue dye',
    healthImpact: 'May cause hyperactivity and allergic reactions. Banned in several European countries.'
  },
  'en:e140': {
    code: 'E140',
    name: 'Chlorophylls',
    category: 'color',
    severity: 'low',
    description: 'Natural green color from plants',
    healthImpact: 'Generally safe. Natural plant pigment.'
  },
  'en:e141': {
    code: 'E141',
    name: 'Copper Chlorophylls',
    category: 'color',
    severity: 'low',
    description: 'Green color, chlorophyll with copper',
    healthImpact: 'Generally safe in food amounts. Excess copper can be harmful.'
  },
  'en:e142': {
    code: 'E142',
    name: 'Green S',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic green dye',
    healthImpact: 'May cause hyperactivity and allergic reactions. Banned in several countries.'
  },
  'en:e150a': {
    code: 'E150a',
    name: 'Plain Caramel',
    category: 'color',
    severity: 'low',
    description: 'Caramel color made by heating sugar',
    healthImpact: 'Generally safe. Most natural form of caramel color.'
  },
  'en:e150b': {
    code: 'E150b',
    name: 'Caustic Sulfite Caramel',
    category: 'color',
    severity: 'medium',
    description: 'Caramel color with sulfite compounds',
    healthImpact: 'May cause problems for sulfite-sensitive individuals.'
  },
  'en:e150c': {
    code: 'E150c',
    name: 'Ammonia Caramel',
    category: 'color',
    severity: 'medium',
    description: 'Caramel color made with ammonia',
    healthImpact: 'Generally safe but may contain trace amounts of THI.'
  },
  'en:e150d': {
    code: 'E150d',
    name: 'Sulfite Ammonia Caramel',
    category: 'color',
    severity: 'high',
    description: 'Caramel color containing 4-MEI',
    healthImpact: 'Contains 4-methylimidazole (4-MEI), classified as possibly carcinogenic. California requires warning labels.'
  },
  'en:e151': {
    code: 'E151',
    name: 'Brilliant Black BN',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic black azo dye',
    healthImpact: 'May cause allergic reactions and hyperactivity. Banned in several countries.'
  },
  'en:e153': {
    code: 'E153',
    name: 'Vegetable Carbon',
    category: 'color',
    severity: 'low',
    description: 'Black color from carbonized vegetables',
    healthImpact: 'Generally safe. Natural source.'
  },
  'en:e155': {
    code: 'E155',
    name: 'Brown HT',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic brown azo dye',
    healthImpact: 'May cause hyperactivity and allergic reactions. Banned in several countries.'
  },
  'en:e160a': {
    code: 'E160a',
    name: 'Beta-Carotene',
    category: 'color',
    severity: 'low',
    description: 'Orange color, precursor to vitamin A',
    healthImpact: 'Generally safe and beneficial. High doses may cause skin discoloration.'
  },
  'en:e160b': {
    code: 'E160b',
    name: 'Annatto',
    category: 'color',
    severity: 'low',
    description: 'Natural orange-red color from seeds',
    healthImpact: 'Generally safe but can cause rare allergic reactions.'
  },
  'en:e160c': {
    code: 'E160c',
    name: 'Paprika Extract',
    category: 'color',
    severity: 'low',
    description: 'Natural red color from paprika',
    healthImpact: 'Generally safe. Natural spice extract.'
  },
  'en:e160d': {
    code: 'E160d',
    name: 'Lycopene',
    category: 'color',
    severity: 'low',
    description: 'Red color from tomatoes',
    healthImpact: 'Safe and potentially beneficial. Antioxidant properties.'
  },
  'en:e161b': {
    code: 'E161b',
    name: 'Lutein',
    category: 'color',
    severity: 'low',
    description: 'Yellow color from marigolds',
    healthImpact: 'Safe and beneficial for eye health.'
  },
  'en:e162': {
    code: 'E162',
    name: 'Beetroot Red',
    category: 'color',
    severity: 'low',
    description: 'Natural red color from beets',
    healthImpact: 'Safe and natural. May lower blood pressure.'
  },
  'en:e163': {
    code: 'E163',
    name: 'Anthocyanins',
    category: 'color',
    severity: 'low',
    description: 'Natural colors from fruits/vegetables',
    healthImpact: 'Safe and beneficial. Antioxidant properties.'
  },
  'en:e170': {
    code: 'E170',
    name: 'Calcium Carbonate',
    category: 'color',
    severity: 'low',
    description: 'White color, also calcium supplement',
    healthImpact: 'Safe and beneficial. Source of calcium.'
  },
  'en:e171': {
    code: 'E171',
    name: 'Titanium Dioxide',
    category: 'color',
    severity: 'medium',
    description: 'White pigment',
    healthImpact: 'Concerns about nanoparticles. Banned in EU as of 2022 due to potential DNA damage.'
  },
  'en:e172': {
    code: 'E172',
    name: 'Iron Oxides',
    category: 'color',
    severity: 'low',
    description: 'Red, yellow, black colors from iron',
    healthImpact: 'Generally safe in food amounts.'
  },
  'en:e173': {
    code: 'E173',
    name: 'Aluminium',
    category: 'color',
    severity: 'medium',
    description: 'Metallic silver color',
    healthImpact: 'Concerns about aluminum accumulation in body. Limited use.'
  },
  'en:e174': {
    code: 'E174',
    name: 'Silver',
    category: 'color',
    severity: 'low',
    description: 'Metallic silver color',
    healthImpact: 'Safe in small amounts used for decoration.'
  },
  'en:e175': {
    code: 'E175',
    name: 'Gold',
    category: 'color',
    severity: 'low',
    description: 'Metallic gold color',
    healthImpact: 'Inert and safe. Passes through body unchanged.'
  },
  'en:e180': {
    code: 'E180',
    name: 'Litholrubine BK',
    category: 'color',
    severity: 'medium',
    description: 'Synthetic red dye',
    healthImpact: 'May cause allergic reactions. Limited use.'
  },

  // E200-E299: Preservatives
  'en:e200': {
    code: 'E200',
    name: 'Sorbic Acid',
    category: 'preservative',
    severity: 'low',
    description: 'Natural preservative',
    healthImpact: 'Generally safe. May cause skin irritation in sensitive individuals.'
  },
  'en:e201': {
    code: 'E201',
    name: 'Sodium Sorbate',
    category: 'preservative',
    severity: 'low',
    description: 'Salt of sorbic acid',
    healthImpact: 'Generally safe. Similar to sorbic acid.'
  },
  'en:e202': {
    code: 'E202',
    name: 'Potassium Sorbate',
    category: 'preservative',
    severity: 'low',
    description: 'Common preservative',
    healthImpact: 'Generally safe. Widely used and well-tolerated.'
  },
  'en:e203': {
    code: 'E203',
    name: 'Calcium Sorbate',
    category: 'preservative',
    severity: 'low',
    description: 'Calcium salt of sorbic acid',
    healthImpact: 'Generally safe in food amounts.'
  },
  'en:e210': {
    code: 'E210',
    name: 'Benzoic Acid',
    category: 'preservative',
    severity: 'medium',
    description: 'Common preservative',
    healthImpact: 'Can cause allergies, asthma, and hyperactivity. Forms benzene with vitamin C.'
  },
  'en:e211': {
    code: 'E211',
    name: 'Sodium Benzoate',
    category: 'preservative',
    severity: 'medium',
    description: 'Common preservative in acidic foods',
    healthImpact: 'May cause hyperactivity. Can form benzene (carcinogen) when combined with vitamin C.'
  },
  'en:e212': {
    code: 'E212',
    name: 'Potassium Benzoate',
    category: 'preservative',
    severity: 'medium',
    description: 'Preservative similar to sodium benzoate',
    healthImpact: 'Similar concerns to sodium benzoate. May form benzene with vitamin C.'
  },
  'en:e213': {
    code: 'E213',
    name: 'Calcium Benzoate',
    category: 'preservative',
    severity: 'medium',
    description: 'Calcium salt of benzoic acid',
    healthImpact: 'Similar concerns to other benzoates.'
  },
  'en:e214': {
    code: 'E214',
    name: 'Ethyl p-hydroxybenzoate',
    category: 'preservative',
    severity: 'medium',
    description: 'Paraben preservative',
    healthImpact: 'Potential hormone disruptor. May cause allergic reactions.'
  },
  'en:e215': {
    code: 'E215',
    name: 'Sodium Ethyl p-hydroxybenzoate',
    category: 'preservative',
    severity: 'medium',
    description: 'Sodium salt of E214',
    healthImpact: 'Similar concerns to E214. Potential endocrine disruptor.'
  },
  'en:e218': {
    code: 'E218',
    name: 'Methyl p-hydroxybenzoate',
    category: 'preservative',
    severity: 'medium',
    description: 'Methylparaben preservative',
    healthImpact: 'Potential hormone disruptor. Allergic reactions possible.'
  },
  'en:e219': {
    code: 'E219',
    name: 'Sodium Methyl p-hydroxybenzoate',
    category: 'preservative',
    severity: 'medium',
    description: 'Sodium salt of methylparaben',
    healthImpact: 'Similar concerns to E218.'
  },
  'en:e220': {
    code: 'E220',
    name: 'Sulfur Dioxide',
    category: 'preservative',
    severity: 'high',
    description: 'Preservative and antioxidant',
    healthImpact: 'Can trigger asthma and allergic reactions. Destroys vitamin B1.'
  },
  'en:e221': {
    code: 'E221',
    name: 'Sodium Sulfite',
    category: 'preservative',
    severity: 'high',
    description: 'Sulfite preservative',
    healthImpact: 'Can cause severe allergic reactions, especially in asthmatics.'
  },
  'en:e222': {
    code: 'E222',
    name: 'Sodium Bisulfite',
    category: 'preservative',
    severity: 'high',
    description: 'Sulfite preservative',
    healthImpact: 'Similar to E221. Dangerous for sulfite-sensitive individuals.'
  },
  'en:e223': {
    code: 'E223',
    name: 'Sodium Metabisulfite',
    category: 'preservative',
    severity: 'high',
    description: 'Common sulfite preservative',
    healthImpact: 'Can trigger severe asthma attacks and allergic reactions.'
  },
  'en:e224': {
    code: 'E224',
    name: 'Potassium Metabisulfite',
    category: 'preservative',
    severity: 'high',
    description: 'Sulfite preservative',
    healthImpact: 'Similar risks to other sulfites. Dangerous for asthmatics.'
  },
  'en:e226': {
    code: 'E226',
    name: 'Calcium Sulfite',
    category: 'preservative',
    severity: 'high',
    description: 'Sulfite preservative',
    healthImpact: 'Can cause allergic reactions and asthma.'
  },
  'en:e227': {
    code: 'E227',
    name: 'Calcium Hydrogen Sulfite',
    category: 'preservative',
    severity: 'high',
    description: 'Sulfite preservative',
    healthImpact: 'Similar risks to other sulfites.'
  },
  'en:e228': {
    code: 'E228',
    name: 'Potassium Hydrogen Sulfite',
    category: 'preservative',
    severity: 'high',
    description: 'Sulfite preservative',
    healthImpact: 'Can trigger allergic reactions and asthma.'
  },
  'en:e230': {
    code: 'E230',
    name: 'Biphenyl',
    category: 'preservative',
    severity: 'medium',
    description: 'Fungicide for citrus fruits',
    healthImpact: 'May cause nausea and vomiting. Mostly on peel.'
  },
  'en:e231': {
    code: 'E231',
    name: 'Orthophenyl Phenol',
    category: 'preservative',
    severity: 'medium',
    description: 'Fungicide preservative',
    healthImpact: 'Potential carcinogen. May cause skin irritation.'
  },
  'en:e232': {
    code: 'E232',
    name: 'Sodium Orthophenyl Phenol',
    category: 'preservative',
    severity: 'medium',
    description: 'Sodium salt of E231',
    healthImpact: 'Similar concerns to E231.'
  },
  'en:e234': {
    code: 'E234',
    name: 'Nisin',
    category: 'preservative',
    severity: 'low',
    description: 'Natural antibiotic from bacteria',
    healthImpact: 'Generally safe. Natural preservative.'
  },
  'en:e235': {
    code: 'E235',
    name: 'Natamycin',
    category: 'preservative',
    severity: 'low',
    description: 'Antifungal preservative',
    healthImpact: 'Generally safe when used on cheese rinds.'
  },
  'en:e239': {
    code: 'E239',
    name: 'Hexamethylene Tetramine',
    category: 'preservative',
    severity: 'high',
    description: 'Preservative that releases formaldehyde',
    healthImpact: 'Breaks down to formaldehyde. Potential carcinogen.'
  },
  'en:e242': {
    code: 'E242',
    name: 'Dimethyl Dicarbonate',
    category: 'preservative',
    severity: 'medium',
    description: 'Beverage preservative',
    healthImpact: 'Breaks down quickly. Generally safe in beverages.'
  },
  'en:e249': {
    code: 'E249',
    name: 'Potassium Nitrite',
    category: 'preservative',
    severity: 'high',
    description: 'Curing agent for meats',
    healthImpact: 'Forms nitrosamines (carcinogens) when heated or combined with proteins.'
  },
  'en:e250': {
    code: 'E250',
    name: 'Sodium Nitrite',
    category: 'preservative',
    severity: 'high',
    description: 'Common meat preservative',
    healthImpact: 'Forms carcinogenic nitrosamines. Linked to increased cancer risk.'
  },
  'en:e251': {
    code: 'E251',
    name: 'Sodium Nitrate',
    category: 'preservative',
    severity: 'high',
    description: 'Curing salt for meats',
    healthImpact: 'Converts to nitrite in body. Cancer risk concerns.'
  },
  'en:e252': {
    code: 'E252',
    name: 'Potassium Nitrate',
    category: 'preservative',
    severity: 'high',
    description: 'Saltpeter, meat preservative',
    healthImpact: 'Similar concerns to other nitrates. Potential carcinogen.'
  },
  'en:e260': {
    code: 'E260',
    name: 'Acetic Acid',
    category: 'preservative',
    severity: 'low',
    description: 'Vinegar',
    healthImpact: 'Safe. Natural component of vinegar.'
  },
  'en:e261': {
    code: 'E261',
    name: 'Potassium Acetate',
    category: 'preservative',
    severity: 'low',
    description: 'Salt of acetic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e262': {
    code: 'E262',
    name: 'Sodium Acetate',
    category: 'preservative',
    severity: 'low',
    description: 'Salt of acetic acid',
    healthImpact: 'Generally safe. Used in salt and vinegar chips.'
  },
  'en:e263': {
    code: 'E263',
    name: 'Calcium Acetate',
    category: 'preservative',
    severity: 'low',
    description: 'Calcium salt of acetic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e270': {
    code: 'E270',
    name: 'Lactic Acid',
    category: 'preservative',
    severity: 'low',
    description: 'Natural acid from fermentation',
    healthImpact: 'Safe. Naturally occurs in fermented foods.'
  },
  'en:e280': {
    code: 'E280',
    name: 'Propionic Acid',
    category: 'preservative',
    severity: 'medium',
    description: 'Mold inhibitor in bread',
    healthImpact: 'May cause migraines and digestive issues in sensitive individuals.'
  },
  'en:e281': {
    code: 'E281',
    name: 'Sodium Propionate',
    category: 'preservative',
    severity: 'medium',
    description: 'Common bread preservative',
    healthImpact: 'May cause headaches and behavioral changes in children.'
  },
  'en:e282': {
    code: 'E282',
    name: 'Calcium Propionate',
    category: 'preservative',
    severity: 'medium',
    description: 'Bread mold inhibitor',
    healthImpact: 'Linked to irritability and restlessness in children.'
  },
  'en:e283': {
    code: 'E283',
    name: 'Potassium Propionate',
    category: 'preservative',
    severity: 'medium',
    description: 'Preservative similar to E282',
    healthImpact: 'Similar concerns to other propionates.'
  },
  'en:e284': {
    code: 'E284',
    name: 'Boric Acid',
    category: 'preservative',
    severity: 'high',
    description: 'Preservative (restricted use)',
    healthImpact: 'Toxic. Banned in many countries. Can affect fertility.'
  },
  'en:e285': {
    code: 'E285',
    name: 'Sodium Tetraborate',
    category: 'preservative',
    severity: 'high',
    description: 'Borax (restricted use)',
    healthImpact: 'Toxic. Banned in many countries. Reproductive toxicity.'
  },
  'en:e290': {
    code: 'E290',
    name: 'Carbon Dioxide',
    category: 'preservative',
    severity: 'low',
    description: 'Carbonation gas',
    healthImpact: 'Safe. Used in carbonated beverages.'
  },
  'en:e296': {
    code: 'E296',
    name: 'Malic Acid',
    category: 'preservative',
    severity: 'low',
    description: 'Natural fruit acid',
    healthImpact: 'Safe. Naturally occurs in apples.'
  },
  'en:e297': {
    code: 'E297',
    name: 'Fumaric Acid',
    category: 'preservative',
    severity: 'low',
    description: 'Natural acid',
    healthImpact: 'Generally safe. May cause throat irritation if inhaled.'
  },

  // E300-E399: Antioxidants & Acidity Regulators
  'en:e300': {
    code: 'E300',
    name: 'Ascorbic Acid (Vitamin C)',
    category: 'antioxidant',
    severity: 'low',
    description: 'Vitamin C',
    healthImpact: 'Safe and beneficial. Essential vitamin.'
  },
  'en:e301': {
    code: 'E301',
    name: 'Sodium Ascorbate',
    category: 'antioxidant',
    severity: 'low',
    description: 'Sodium salt of vitamin C',
    healthImpact: 'Safe. Form of vitamin C.'
  },
  'en:e302': {
    code: 'E302',
    name: 'Calcium Ascorbate',
    category: 'antioxidant',
    severity: 'low',
    description: 'Calcium salt of vitamin C',
    healthImpact: 'Safe. Provides vitamin C and calcium.'
  },
  'en:e304': {
    code: 'E304',
    name: 'Ascorbyl Palmitate',
    category: 'antioxidant',
    severity: 'low',
    description: 'Fat-soluble vitamin C',
    healthImpact: 'Generally safe. Fat-soluble form of vitamin C.'
  },
  'en:e306': {
    code: 'E306',
    name: 'Tocopherols (Vitamin E)',
    category: 'antioxidant',
    severity: 'low',
    description: 'Natural vitamin E',
    healthImpact: 'Safe and beneficial. Natural antioxidant.'
  },
  'en:e307': {
    code: 'E307',
    name: 'Alpha-Tocopherol',
    category: 'antioxidant',
    severity: 'low',
    description: 'Synthetic vitamin E',
    healthImpact: 'Safe. Form of vitamin E.'
  },
  'en:e308': {
    code: 'E308',
    name: 'Gamma-Tocopherol',
    category: 'antioxidant',
    severity: 'low',
    description: 'Natural vitamin E variant',
    healthImpact: 'Safe. Natural antioxidant.'
  },
  'en:e309': {
    code: 'E309',
    name: 'Delta-Tocopherol',
    category: 'antioxidant',
    severity: 'low',
    description: 'Natural vitamin E variant',
    healthImpact: 'Safe. Natural antioxidant.'
  },
  'en:e310': {
    code: 'E310',
    name: 'Propyl Gallate',
    category: 'antioxidant',
    severity: 'medium',
    description: 'Synthetic antioxidant',
    healthImpact: 'May cause allergic reactions. Some concerns about hormone disruption.'
  },
  'en:e311': {
    code: 'E311',
    name: 'Octyl Gallate',
    category: 'antioxidant',
    severity: 'medium',
    description: 'Synthetic antioxidant',
    healthImpact: 'Similar concerns to E310. May cause skin irritation.'
  },
  'en:e312': {
    code: 'E312',
    name: 'Dodecyl Gallate',
    category: 'antioxidant',
    severity: 'medium',
    description: 'Synthetic antioxidant',
    healthImpact: 'May cause allergic reactions.'
  },
  'en:e315': {
    code: 'E315',
    name: 'Erythorbic Acid',
    category: 'antioxidant',
    severity: 'low',
    description: 'Synthetic vitamin C isomer',
    healthImpact: 'Generally safe. Similar to vitamin C but no vitamin activity.'
  },
  'en:e316': {
    code: 'E316',
    name: 'Sodium Erythorbate',
    category: 'antioxidant',
    severity: 'low',
    description: 'Sodium salt of erythorbic acid',
    healthImpact: 'Generally safe. Used in processed meats.'
  },
  'en:e319': {
    code: 'E319',
    name: 'TBHQ',
    category: 'antioxidant',
    severity: 'high',
    description: 'Tertiary-butylhydroquinone',
    healthImpact: 'May cause nausea, delirium, tinnitus. Banned in some countries. Potential carcinogen.'
  },
  'en:e320': {
    code: 'E320',
    name: 'BHA',
    category: 'antioxidant',
    severity: 'high',
    description: 'Butylated hydroxyanisole',
    healthImpact: 'Possible carcinogen. May cause hyperactivity. Endocrine disruptor.'
  },
  'en:e321': {
    code: 'E321',
    name: 'BHT',
    category: 'antioxidant',
    severity: 'high',
    description: 'Butylated hydroxytoluene',
    healthImpact: 'Possible carcinogen. May cause hyperactivity and allergic reactions.'
  },
  'en:e322': {
    code: 'E322',
    name: 'Lecithin',
    category: 'emulsifier',
    severity: 'low',
    description: 'Natural emulsifier from soy or sunflower',
    healthImpact: 'Generally safe. May cause allergies if from soy.'
  },
  'en:e325': {
    code: 'E325',
    name: 'Sodium Lactate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Salt of lactic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e326': {
    code: 'E326',
    name: 'Potassium Lactate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Potassium salt of lactic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e327': {
    code: 'E327',
    name: 'Calcium Lactate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Calcium salt of lactic acid',
    healthImpact: 'Safe. Source of calcium.'
  },
  'en:e330': {
    code: 'E330',
    name: 'Citric Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Natural acid from citrus fruits',
    healthImpact: 'Generally safe. Can erode tooth enamel with excessive consumption.'
  },
  'en:e331': {
    code: 'E331',
    name: 'Sodium Citrates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Sodium salts of citric acid',
    healthImpact: 'Generally safe.'
  },
  'en:e332': {
    code: 'E332',
    name: 'Potassium Citrates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Potassium salts of citric acid',
    healthImpact: 'Generally safe.'
  },
  'en:e333': {
    code: 'E333',
    name: 'Calcium Citrates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Calcium salts of citric acid',
    healthImpact: 'Safe. Source of calcium.'
  },
  'en:e334': {
    code: 'E334',
    name: 'Tartaric Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Natural acid from grapes',
    healthImpact: 'Generally safe.'
  },
  'en:e335': {
    code: 'E335',
    name: 'Sodium Tartrates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Sodium salts of tartaric acid',
    healthImpact: 'Generally safe.'
  },
  'en:e336': {
    code: 'E336',
    name: 'Potassium Tartrates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Cream of tartar',
    healthImpact: 'Safe. Common baking ingredient.'
  },
  'en:e337': {
    code: 'E337',
    name: 'Sodium Potassium Tartrate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Rochelle salt',
    healthImpact: 'Generally safe in food amounts.'
  },
  'en:e338': {
    code: 'E338',
    name: 'Phosphoric Acid',
    category: 'acidity_regulator',
    severity: 'medium',
    description: 'Acidifier in cola drinks',
    healthImpact: 'Can interfere with calcium absorption, erode tooth enamel, and may contribute to osteoporosis.'
  },
  'en:e339': {
    code: 'E339',
    name: 'Sodium Phosphates',
    category: 'acidity_regulator',
    severity: 'medium',
    description: 'Sodium salts of phosphoric acid',
    healthImpact: 'High intake linked to kidney and cardiovascular problems.'
  },
  'en:e340': {
    code: 'E340',
    name: 'Potassium Phosphates',
    category: 'acidity_regulator',
    severity: 'medium',
    description: 'Potassium salts of phosphoric acid',
    healthImpact: 'Generally safe but excess can affect mineral balance.'
  },
  'en:e341': {
    code: 'E341',
    name: 'Calcium Phosphates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Calcium salts of phosphoric acid',
    healthImpact: 'Generally safe. Source of calcium.'
  },
  'en:e343': {
    code: 'E343',
    name: 'Magnesium Phosphates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Magnesium salts of phosphoric acid',
    healthImpact: 'Generally safe in food amounts.'
  },
  'en:e350': {
    code: 'E350',
    name: 'Sodium Malates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Sodium salts of malic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e351': {
    code: 'E351',
    name: 'Potassium Malate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Potassium salt of malic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e352': {
    code: 'E352',
    name: 'Calcium Malates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Calcium salts of malic acid',
    healthImpact: 'Safe. Source of calcium.'
  },
  'en:e353': {
    code: 'E353',
    name: 'Metatartaric Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Modified tartaric acid',
    healthImpact: 'Generally safe.'
  },
  'en:e354': {
    code: 'E354',
    name: 'Calcium Tartrate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Calcium salt of tartaric acid',
    healthImpact: 'Generally safe.'
  },
  'en:e355': {
    code: 'E355',
    name: 'Adipic Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Synthetic acid',
    healthImpact: 'Generally safe in food amounts.'
  },
  'en:e356': {
    code: 'E356',
    name: 'Sodium Adipate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Sodium salt of adipic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e357': {
    code: 'E357',
    name: 'Potassium Adipate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Potassium salt of adipic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e363': {
    code: 'E363',
    name: 'Succinic Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Natural acid',
    healthImpact: 'Generally safe.'
  },
  'en:e380': {
    code: 'E380',
    name: 'Triammonium Citrate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Ammonium salt of citric acid',
    healthImpact: 'Generally safe.'
  },
  'en:e385': {
    code: 'E385',
    name: 'EDTA',
    category: 'antioxidant',
    severity: 'medium',
    description: 'Calcium disodium EDTA',
    healthImpact: 'Can bind minerals. May affect mineral absorption.'
  },
  'en:e392': {
    code: 'E392',
    name: 'Rosemary Extract',
    category: 'antioxidant',
    severity: 'low',
    description: 'Natural antioxidant from rosemary',
    healthImpact: 'Generally safe. Natural herb extract.'
  },

  // E400-E499: Thickeners, Stabilizers, Emulsifiers
  'en:e400': {
    code: 'E400',
    name: 'Alginic Acid',
    category: 'thickener',
    severity: 'low',
    description: 'From brown seaweed',
    healthImpact: 'Generally safe. Natural source.'
  },
  'en:e401': {
    code: 'E401',
    name: 'Sodium Alginate',
    category: 'thickener',
    severity: 'low',
    description: 'Sodium salt of alginic acid',
    healthImpact: 'Generally safe. From seaweed.'
  },
  'en:e402': {
    code: 'E402',
    name: 'Potassium Alginate',
    category: 'thickener',
    severity: 'low',
    description: 'Potassium salt of alginic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e403': {
    code: 'E403',
    name: 'Ammonium Alginate',
    category: 'thickener',
    severity: 'low',
    description: 'Ammonium salt of alginic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e404': {
    code: 'E404',
    name: 'Calcium Alginate',
    category: 'thickener',
    severity: 'low',
    description: 'Calcium salt of alginic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e405': {
    code: 'E405',
    name: 'Propylene Glycol Alginate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified alginate',
    healthImpact: 'Generally safe in food amounts.'
  },
  'en:e406': {
    code: 'E406',
    name: 'Agar',
    category: 'thickener',
    severity: 'low',
    description: 'From red seaweed',
    healthImpact: 'Safe. Natural vegetarian gelatin alternative.'
  },
  'en:e407': {
    code: 'E407',
    name: 'Carrageenan',
    category: 'thickener',
    severity: 'medium',
    description: 'From red seaweed',
    healthImpact: 'May cause digestive inflammation. Degraded form is carcinogenic.'
  },
  'en:e407a': {
    code: 'E407a',
    name: 'Processed Eucheuma Seaweed',
    category: 'thickener',
    severity: 'medium',
    description: 'Semi-refined carrageenan',
    healthImpact: 'Similar concerns to carrageenan but less processed.'
  },
  'en:e410': {
    code: 'E410',
    name: 'Locust Bean Gum',
    category: 'thickener',
    severity: 'low',
    description: 'From carob tree seeds',
    healthImpact: 'Generally safe. Natural source.'
  },
  'en:e412': {
    code: 'E412',
    name: 'Guar Gum',
    category: 'thickener',
    severity: 'low',
    description: 'From guar beans',
    healthImpact: 'Generally safe. May cause digestive issues in large amounts.'
  },
  'en:e413': {
    code: 'E413',
    name: 'Tragacanth',
    category: 'thickener',
    severity: 'low',
    description: 'Natural gum from shrubs',
    healthImpact: 'Generally safe but can cause allergies.'
  },
  'en:e414': {
    code: 'E414',
    name: 'Gum Arabic',
    category: 'thickener',
    severity: 'low',
    description: 'From acacia trees',
    healthImpact: 'Generally safe. Natural source.'
  },
  'en:e415': {
    code: 'E415',
    name: 'Xanthan Gum',
    category: 'thickener',
    severity: 'low',
    description: 'From bacterial fermentation',
    healthImpact: 'Generally safe. May cause digestive issues in some.'
  },
  'en:e416': {
    code: 'E416',
    name: 'Karaya Gum',
    category: 'thickener',
    severity: 'low',
    description: 'Natural tree gum',
    healthImpact: 'Generally safe. May cause allergies.'
  },
  'en:e417': {
    code: 'E417',
    name: 'Tara Gum',
    category: 'thickener',
    severity: 'low',
    description: 'From tara tree seeds',
    healthImpact: 'Generally safe.'
  },
  'en:e418': {
    code: 'E418',
    name: 'Gellan Gum',
    category: 'thickener',
    severity: 'low',
    description: 'From bacterial fermentation',
    healthImpact: 'Generally safe.'
  },
  'en:e420': {
    code: 'E420',
    name: 'Sorbitol',
    category: 'sweetener',
    severity: 'medium',
    description: 'Sugar alcohol sweetener',
    healthImpact: 'Can cause diarrhea and digestive issues. Laxative effect.'
  },
  'en:e421': {
    code: 'E421',
    name: 'Mannitol',
    category: 'sweetener',
    severity: 'medium',
    description: 'Sugar alcohol sweetener',
    healthImpact: 'Can cause diarrhea and bloating. Laxative effect.'
  },
  'en:e422': {
    code: 'E422',
    name: 'Glycerol',
    category: 'humectant',
    severity: 'low',
    description: 'Glycerin',
    healthImpact: 'Generally safe. May cause headaches in large amounts.'
  },
  'en:e425': {
    code: 'E425',
    name: 'Konjac',
    category: 'thickener',
    severity: 'low',
    description: 'From konjac plant',
    healthImpact: 'Generally safe. High fiber. Choking hazard if not prepared properly.'
  },
  'en:e426': {
    code: 'E426',
    name: 'Hemicellulose',
    category: 'thickener',
    severity: 'low',
    description: 'Plant fiber',
    healthImpact: 'Generally safe. Natural fiber.'
  },
  'en:e427': {
    code: 'E427',
    name: 'Cassia Gum',
    category: 'thickener',
    severity: 'low',
    description: 'From cassia seeds',
    healthImpact: 'Generally safe.'
  },
  'en:e428': {
    code: 'E428',
    name: 'Gelatin',
    category: 'thickener',
    severity: 'low',
    description: 'From animal collagen',
    healthImpact: 'Generally safe. Not vegetarian/vegan.'
  },
  'en:e430': {
    code: 'E430',
    name: 'Polyoxyethylene Stearate',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Synthetic emulsifier',
    healthImpact: 'May contain harmful contaminants.'
  },
  'en:e431': {
    code: 'E431',
    name: 'Polyoxyethylene Stearate',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Synthetic emulsifier',
    healthImpact: 'Similar to E430.'
  },
  'en:e432': {
    code: 'E432',
    name: 'Polysorbate 20',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Synthetic emulsifier',
    healthImpact: 'May affect gut bacteria. Some concerns about impurities.'
  },
  'en:e433': {
    code: 'E433',
    name: 'Polysorbate 80',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Common emulsifier',
    healthImpact: 'May cause gut inflammation and affect microbiome. Linked to metabolic disorders.'
  },
  'en:e434': {
    code: 'E434',
    name: 'Polysorbate 40',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Synthetic emulsifier',
    healthImpact: 'Similar concerns to other polysorbates.'
  },
  'en:e435': {
    code: 'E435',
    name: 'Polysorbate 60',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Synthetic emulsifier',
    healthImpact: 'May affect gut health like other polysorbates.'
  },
  'en:e436': {
    code: 'E436',
    name: 'Polysorbate 65',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Synthetic emulsifier',
    healthImpact: 'Similar to other polysorbates.'
  },
  'en:e440': {
    code: 'E440',
    name: 'Pectin',
    category: 'thickener',
    severity: 'low',
    description: 'From fruit peels',
    healthImpact: 'Safe and beneficial. Natural fiber.'
  },
  'en:e441': {
    code: 'E441',
    name: 'Gelatin',
    category: 'thickener',
    severity: 'low',
    description: 'Animal-derived protein',
    healthImpact: 'Generally safe. Not suitable for vegetarians.'
  },
  'en:e442': {
    code: 'E442',
    name: 'Ammonium Phosphatides',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified lecithin',
    healthImpact: 'Generally safe.'
  },
  'en:e444': {
    code: 'E444',
    name: 'Sucrose Acetate Isobutyrate',
    category: 'stabilizer',
    severity: 'low',
    description: 'Modified sugar',
    healthImpact: 'Generally safe in beverages.'
  },
  'en:e445': {
    code: 'E445',
    name: 'Glycerol Esters of Wood Rosins',
    category: 'stabilizer',
    severity: 'medium',
    description: 'From pine trees',
    healthImpact: 'Some concerns about purity and processing.'
  },
  'en:e450': {
    code: 'E450',
    name: 'Diphosphates',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Phosphate salts',
    healthImpact: 'High intake linked to cardiovascular issues.'
  },
  'en:e451': {
    code: 'E451',
    name: 'Triphosphates',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Phosphate salts',
    healthImpact: 'Can affect mineral absorption. Kidney concerns.'
  },
  'en:e452': {
    code: 'E452',
    name: 'Polyphosphates',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Chain phosphates',
    healthImpact: 'Linked to kidney and cardiovascular problems with high intake.'
  },
  'en:e459': {
    code: 'E459',
    name: 'Beta-Cyclodextrin',
    category: 'stabilizer',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e460': {
    code: 'E460',
    name: 'Cellulose',
    category: 'bulking_agent',
    severity: 'low',
    description: 'Plant fiber',
    healthImpact: 'Safe. Indigestible fiber.'
  },
  'en:e461': {
    code: 'E461',
    name: 'Methylcellulose',
    category: 'thickener',
    severity: 'low',
    description: 'Modified cellulose',
    healthImpact: 'Generally safe. May cause bloating.'
  },
  'en:e462': {
    code: 'E462',
    name: 'Ethylcellulose',
    category: 'thickener',
    severity: 'low',
    description: 'Modified cellulose',
    healthImpact: 'Generally safe.'
  },
  'en:e463': {
    code: 'E463',
    name: 'Hydroxypropyl Cellulose',
    category: 'thickener',
    severity: 'low',
    description: 'Modified cellulose',
    healthImpact: 'Generally safe.'
  },
  'en:e464': {
    code: 'E464',
    name: 'Hydroxypropyl Methylcellulose',
    category: 'thickener',
    severity: 'low',
    description: 'Modified cellulose',
    healthImpact: 'Generally safe. May cause digestive issues in large amounts.'
  },
  'en:e465': {
    code: 'E465',
    name: 'Methylethylcellulose',
    category: 'thickener',
    severity: 'low',
    description: 'Modified cellulose',
    healthImpact: 'Generally safe.'
  },
  'en:e466': {
    code: 'E466',
    name: 'Carboxymethylcellulose',
    category: 'thickener',
    severity: 'medium',
    description: 'Modified cellulose',
    healthImpact: 'May affect gut bacteria and cause inflammation in some people.'
  },
  'en:e468': {
    code: 'E468',
    name: 'Cross-linked Sodium CMC',
    category: 'thickener',
    severity: 'low',
    description: 'Modified cellulose',
    healthImpact: 'Generally safe.'
  },
  'en:e469': {
    code: 'E469',
    name: 'Enzymatically Hydrolyzed CMC',
    category: 'thickener',
    severity: 'low',
    description: 'Modified cellulose',
    healthImpact: 'Generally safe.'
  },
  'en:e470a': {
    code: 'E470a',
    name: 'Sodium/Potassium/Calcium Salts of Fatty Acids',
    category: 'emulsifier',
    severity: 'low',
    description: 'Soap-like compounds',
    healthImpact: 'Generally safe.'
  },
  'en:e470b': {
    code: 'E470b',
    name: 'Magnesium Salts of Fatty Acids',
    category: 'emulsifier',
    severity: 'low',
    description: 'Magnesium stearate',
    healthImpact: 'Generally safe.'
  },
  'en:e471': {
    code: 'E471',
    name: 'Mono- and Diglycerides',
    category: 'emulsifier',
    severity: 'low',
    description: 'From fats and oils',
    healthImpact: 'Generally safe. May contain trans fats.'
  },
  'en:e472a': {
    code: 'E472a',
    name: 'Acetic Acid Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe.'
  },
  'en:e472b': {
    code: 'E472b',
    name: 'Lactic Acid Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe.'
  },
  'en:e472c': {
    code: 'E472c',
    name: 'Citric Acid Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe.'
  },
  'en:e472d': {
    code: 'E472d',
    name: 'Tartaric Acid Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe.'
  },
  'en:e472e': {
    code: 'E472e',
    name: 'DATEM',
    category: 'emulsifier',
    severity: 'low',
    description: 'Diacetyl tartaric acid esters',
    healthImpact: 'Generally safe. Common in bread.'
  },
  'en:e472f': {
    code: 'E472f',
    name: 'Mixed Tartaric/Acetic Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe.'
  },
  'en:e473': {
    code: 'E473',
    name: 'Sucrose Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Sugar-based emulsifier',
    healthImpact: 'Generally safe.'
  },
  'en:e474': {
    code: 'E474',
    name: 'Sucroglycerides',
    category: 'emulsifier',
    severity: 'low',
    description: 'Sugar-fat compound',
    healthImpact: 'Generally safe.'
  },
  'en:e475': {
    code: 'E475',
    name: 'Polyglycerol Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe.'
  },
  'en:e476': {
    code: 'E476',
    name: 'Polyglycerol Polyricinoleate',
    category: 'emulsifier',
    severity: 'low',
    description: 'From castor oil',
    healthImpact: 'Generally safe. Common in chocolate.'
  },
  'en:e477': {
    code: 'E477',
    name: 'Propylene Glycol Esters',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe.'
  },
  'en:e479b': {
    code: 'E479b',
    name: 'Thermally Oxidized Soya Bean Oil',
    category: 'emulsifier',
    severity: 'medium',
    description: 'Modified soy oil',
    healthImpact: 'Concerns about oxidized oils and health effects.'
  },
  'en:e481': {
    code: 'E481',
    name: 'Sodium Stearoyl Lactylate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fats',
    healthImpact: 'Generally safe. Common in bread.'
  },
  'en:e482': {
    code: 'E482',
    name: 'Calcium Stearoyl Lactylate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Calcium version of E481',
    healthImpact: 'Generally safe.'
  },
  'en:e483': {
    code: 'E483',
    name: 'Stearyl Tartrate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Modified fat',
    healthImpact: 'Generally safe.'
  },
  'en:e491': {
    code: 'E491',
    name: 'Sorbitan Monostearate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Synthetic emulsifier',
    healthImpact: 'Generally safe.'
  },
  'en:e492': {
    code: 'E492',
    name: 'Sorbitan Tristearate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Synthetic emulsifier',
    healthImpact: 'Generally safe.'
  },
  'en:e493': {
    code: 'E493',
    name: 'Sorbitan Monolaurate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Synthetic emulsifier',
    healthImpact: 'Generally safe.'
  },
  'en:e494': {
    code: 'E494',
    name: 'Sorbitan Monooleate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Synthetic emulsifier',
    healthImpact: 'Generally safe.'
  },
  'en:e495': {
    code: 'E495',
    name: 'Sorbitan Monopalmitate',
    category: 'emulsifier',
    severity: 'low',
    description: 'Synthetic emulsifier',
    healthImpact: 'Generally safe.'
  },

  // E500-E599: Acidity Regulators & Anti-caking Agents
  'en:e500': {
    code: 'E500',
    name: 'Sodium Carbonates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Baking soda',
    healthImpact: 'Safe. Common household ingredient.'
  },
  'en:e501': {
    code: 'E501',
    name: 'Potassium Carbonates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Potassium version of baking soda',
    healthImpact: 'Generally safe.'
  },
  'en:e503': {
    code: 'E503',
    name: 'Ammonium Carbonates',
    category: 'raising_agent',
    severity: 'low',
    description: 'Baking ammonia',
    healthImpact: 'Safe. Ammonia evaporates during baking.'
  },
  'en:e504': {
    code: 'E504',
    name: 'Magnesium Carbonates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Magnesium salts',
    healthImpact: 'Generally safe. Source of magnesium.'
  },
  'en:e507': {
    code: 'E507',
    name: 'Hydrochloric Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Stomach acid',
    healthImpact: 'Safe in food processing. Naturally in stomach.'
  },
  'en:e508': {
    code: 'E508',
    name: 'Potassium Chloride',
    category: 'flavor_enhancer',
    severity: 'low',
    description: 'Salt substitute',
    healthImpact: 'Generally safe. Can affect heart rhythm in large amounts.'
  },
  'en:e509': {
    code: 'E509',
    name: 'Calcium Chloride',
    category: 'firming_agent',
    severity: 'low',
    description: 'Calcium salt',
    healthImpact: 'Generally safe. Source of calcium.'
  },
  'en:e510': {
    code: 'E510',
    name: 'Ammonium Chloride',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Salty liquorice flavoring',
    healthImpact: 'Can affect blood pressure. Limited use.'
  },
  'en:e511': {
    code: 'E511',
    name: 'Magnesium Chloride',
    category: 'firming_agent',
    severity: 'low',
    description: 'Magnesium salt',
    healthImpact: 'Generally safe. Source of magnesium.'
  },
  'en:e512': {
    code: 'E512',
    name: 'Stannous Chloride',
    category: 'antioxidant',
    severity: 'medium',
    description: 'Tin compound',
    healthImpact: 'Some concerns about tin accumulation.'
  },
  'en:e513': {
    code: 'E513',
    name: 'Sulfuric Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Processing aid',
    healthImpact: 'Safe when neutralized in processing.'
  },
  'en:e514': {
    code: 'E514',
    name: 'Sodium Sulfates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Sodium salts',
    healthImpact: 'Generally safe. Laxative in large amounts.'
  },
  'en:e515': {
    code: 'E515',
    name: 'Potassium Sulfates',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Potassium salts',
    healthImpact: 'Generally safe.'
  },
  'en:e516': {
    code: 'E516',
    name: 'Calcium Sulfate',
    category: 'firming_agent',
    severity: 'low',
    description: 'Gypsum, plaster of Paris',
    healthImpact: 'Generally safe. Source of calcium.'
  },
  'en:e517': {
    code: 'E517',
    name: 'Ammonium Sulfate',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Yeast nutrient',
    healthImpact: 'Generally safe in food amounts.'
  },
  'en:e520': {
    code: 'E520',
    name: 'Aluminium Sulfate',
    category: 'firming_agent',
    severity: 'medium',
    description: 'Aluminum compound',
    healthImpact: 'Concerns about aluminum accumulation.'
  },
  'en:e521': {
    code: 'E521',
    name: 'Aluminium Sodium Sulfate',
    category: 'firming_agent',
    severity: 'medium',
    description: 'Aluminum compound',
    healthImpact: 'Concerns about aluminum intake.'
  },
  'en:e522': {
    code: 'E522',
    name: 'Aluminium Potassium Sulfate',
    category: 'acidity_regulator',
    severity: 'medium',
    description: 'Alum',
    healthImpact: 'Aluminum concerns. Limited use.'
  },
  'en:e523': {
    code: 'E523',
    name: 'Aluminium Ammonium Sulfate',
    category: 'firming_agent',
    severity: 'medium',
    description: 'Aluminum compound',
    healthImpact: 'Concerns about aluminum.'
  },
  'en:e524': {
    code: 'E524',
    name: 'Sodium Hydroxide',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Lye, caustic soda',
    healthImpact: 'Safe when neutralized in processing.'
  },
  'en:e525': {
    code: 'E525',
    name: 'Potassium Hydroxide',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Caustic potash',
    healthImpact: 'Safe when neutralized.'
  },
  'en:e526': {
    code: 'E526',
    name: 'Calcium Hydroxide',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Slaked lime',
    healthImpact: 'Generally safe in food processing.'
  },
  'en:e527': {
    code: 'E527',
    name: 'Ammonium Hydroxide',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Ammonia water',
    healthImpact: 'Safe when used properly. Evaporates.'
  },
  'en:e528': {
    code: 'E528',
    name: 'Magnesium Hydroxide',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Milk of magnesia',
    healthImpact: 'Safe. Used as antacid.'
  },
  'en:e529': {
    code: 'E529',
    name: 'Calcium Oxide',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'Quicklime',
    healthImpact: 'Safe when processed properly.'
  },
  'en:e530': {
    code: 'E530',
    name: 'Magnesium Oxide',
    category: 'anti_caking',
    severity: 'low',
    description: 'Magnesia',
    healthImpact: 'Generally safe.'
  },
  'en:e535': {
    code: 'E535',
    name: 'Sodium Ferrocyanide',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Anti-caking in salt',
    healthImpact: 'Contains cyanide but tightly bound. Some concerns.'
  },
  'en:e536': {
    code: 'E536',
    name: 'Potassium Ferrocyanide',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Yellow prussiate of potash',
    healthImpact: 'Similar to E535. Cyanide concerns.'
  },
  'en:e538': {
    code: 'E538',
    name: 'Calcium Ferrocyanide',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Anti-caking agent',
    healthImpact: 'Similar cyanide concerns.'
  },
  'en:e541': {
    code: 'E541',
    name: 'Sodium Aluminium Phosphate',
    category: 'raising_agent',
    severity: 'medium',
    description: 'Acidic baking powder',
    healthImpact: 'Aluminum accumulation concerns.'
  },
  'en:e551': {
    code: 'E551',
    name: 'Silicon Dioxide',
    category: 'anti_caking',
    severity: 'low',
    description: 'Silica, sand',
    healthImpact: 'Generally safe. Concerns about nanoparticles.'
  },
  'en:e552': {
    code: 'E552',
    name: 'Calcium Silicate',
    category: 'anti_caking',
    severity: 'low',
    description: 'Anti-caking agent',
    healthImpact: 'Generally safe.'
  },
  'en:e553a': {
    code: 'E553a',
    name: 'Magnesium Silicate',
    category: 'anti_caking',
    severity: 'low',
    description: 'Talc',
    healthImpact: 'Food grade considered safe. Avoid inhalation.'
  },
  'en:e553b': {
    code: 'E553b',
    name: 'Talc',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Mineral powder',
    healthImpact: 'Concerns about asbestos contamination in some sources.'
  },
  'en:e554': {
    code: 'E554',
    name: 'Sodium Aluminium Silicate',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Anti-caking agent',
    healthImpact: 'Aluminum concerns.'
  },
  'en:e555': {
    code: 'E555',
    name: 'Potassium Aluminium Silicate',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Mica',
    healthImpact: 'Aluminum accumulation concerns.'
  },
  'en:e556': {
    code: 'E556',
    name: 'Calcium Aluminium Silicate',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Anti-caking agent',
    healthImpact: 'Aluminum concerns.'
  },
  'en:e558': {
    code: 'E558',
    name: 'Bentonite',
    category: 'anti_caking',
    severity: 'low',
    description: 'Clay',
    healthImpact: 'Generally safe. Natural clay.'
  },
  'en:e559': {
    code: 'E559',
    name: 'Aluminium Silicate',
    category: 'anti_caking',
    severity: 'medium',
    description: 'Kaolin, china clay',
    healthImpact: 'Aluminum accumulation concerns.'
  },
  'en:e570': {
    code: 'E570',
    name: 'Fatty Acids',
    category: 'anti_caking',
    severity: 'low',
    description: 'Stearic acid',
    healthImpact: 'Generally safe. Natural fats.'
  },
  'en:e574': {
    code: 'E574',
    name: 'Gluconic Acid',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'From glucose',
    healthImpact: 'Generally safe.'
  },
  'en:e575': {
    code: 'E575',
    name: 'Glucono Delta-Lactone',
    category: 'acidity_regulator',
    severity: 'low',
    description: 'GDL, from glucose',
    healthImpact: 'Generally safe.'
  },
  'en:e576': {
    code: 'E576',
    name: 'Sodium Gluconate',
    category: 'sequestrant',
    severity: 'low',
    description: 'Sodium salt of gluconic acid',
    healthImpact: 'Generally safe.'
  },
  'en:e577': {
    code: 'E577',
    name: 'Potassium Gluconate',
    category: 'sequestrant',
    severity: 'low',
    description: 'Potassium supplement',
    healthImpact: 'Generally safe.'
  },
  'en:e578': {
    code: 'E578',
    name: 'Calcium Gluconate',
    category: 'firming_agent',
    severity: 'low',
    description: 'Calcium supplement',
    healthImpact: 'Safe. Source of calcium.'
  },
  'en:e579': {
    code: 'E579',
    name: 'Ferrous Gluconate',
    category: 'color',
    severity: 'low',
    description: 'Iron supplement',
    healthImpact: 'Safe. Source of iron.'
  },
  'en:e585': {
    code: 'E585',
    name: 'Ferrous Lactate',
    category: 'color',
    severity: 'low',
    description: 'Iron supplement',
    healthImpact: 'Safe. Source of iron.'
  },
  'en:e586': {
    code: 'E586',
    name: '4-Hexylresorcinol',
    category: 'antioxidant',
    severity: 'medium',
    description: 'Prevents browning in shrimp',
    healthImpact: 'May cause allergic reactions.'
  },

  // E600-E699: Flavor Enhancers
  'en:e620': {
    code: 'E620',
    name: 'Glutamic Acid',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Amino acid flavor enhancer',
    healthImpact: 'May cause headaches and flushing in sensitive individuals.'
  },
  'en:e621': {
    code: 'E621',
    name: 'MSG (Monosodium Glutamate)',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Common flavor enhancer',
    healthImpact: 'Can cause "Chinese Restaurant Syndrome" - headaches, sweating, chest pain in sensitive people.'
  },
  'en:e622': {
    code: 'E622',
    name: 'Monopotassium Glutamate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Potassium version of MSG',
    healthImpact: 'Similar effects to MSG.'
  },
  'en:e623': {
    code: 'E623',
    name: 'Calcium Diglutamate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Calcium salt of glutamic acid',
    healthImpact: 'Similar concerns to MSG.'
  },
  'en:e624': {
    code: 'E624',
    name: 'Monoammonium Glutamate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Ammonium salt of glutamic acid',
    healthImpact: 'Similar to MSG effects.'
  },
  'en:e625': {
    code: 'E625',
    name: 'Magnesium Diglutamate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Magnesium salt of glutamic acid',
    healthImpact: 'Similar to MSG.'
  },
  'en:e626': {
    code: 'E626',
    name: 'Guanylic Acid',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Nucleotide flavor enhancer',
    healthImpact: 'May trigger gout. Often used with MSG.'
  },
  'en:e627': {
    code: 'E627',
    name: 'Disodium Guanylate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Flavor enhancer from yeast',
    healthImpact: 'May trigger gout. Often combined with MSG.'
  },
  'en:e628': {
    code: 'E628',
    name: 'Dipotassium Guanylate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Potassium version of E627',
    healthImpact: 'Similar to E627.'
  },
  'en:e629': {
    code: 'E629',
    name: 'Calcium Guanylate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Calcium salt flavor enhancer',
    healthImpact: 'May affect those with gout.'
  },
  'en:e630': {
    code: 'E630',
    name: 'Inosinic Acid',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Nucleotide from meat/fish',
    healthImpact: 'May trigger gout. Often with MSG.'
  },
  'en:e631': {
    code: 'E631',
    name: 'Disodium Inosinate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Common flavor enhancer',
    healthImpact: 'May trigger gout and asthma. Often used with MSG.'
  },
  'en:e632': {
    code: 'E632',
    name: 'Dipotassium Inosinate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Potassium version of E631',
    healthImpact: 'Similar to E631.'
  },
  'en:e633': {
    code: 'E633',
    name: 'Calcium Inosinate',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Calcium salt flavor enhancer',
    healthImpact: 'May affect those with gout.'
  },
  'en:e634': {
    code: 'E634',
    name: 'Calcium Ribonucleotides',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Mix of E627 and E631',
    healthImpact: 'Combined effects of both.'
  },
  'en:e635': {
    code: 'E635',
    name: 'Disodium Ribonucleotides',
    category: 'flavor_enhancer',
    severity: 'medium',
    description: 'Mixture of E627 and E631',
    healthImpact: 'May trigger gout and asthma. Enhances MSG effects.'
  },
  'en:e640': {
    code: 'E640',
    name: 'Glycine',
    category: 'flavor_enhancer',
    severity: 'low',
    description: 'Amino acid sweetener',
    healthImpact: 'Generally safe.'
  },
  'en:e641': {
    code: 'E641',
    name: 'L-Leucine',
    category: 'flavor_enhancer',
    severity: 'low',
    description: 'Amino acid',
    healthImpact: 'Generally safe.'
  },
  'en:e642': {
    code: 'E642',
    name: 'Lysine Hydrochloride',
    category: 'flavor_enhancer',
    severity: 'low',
    description: 'Amino acid supplement',
    healthImpact: 'Generally safe.'
  },
  'en:e650': {
    code: 'E650',
    name: 'Zinc Acetate',
    category: 'flavor_enhancer',
    severity: 'low',
    description: 'Zinc supplement',
    healthImpact: 'Safe in food amounts.'
  },

  // E900-E999: Glazing Agents, Sweeteners, and Others
  'en:e900': {
    code: 'E900',
    name: 'Dimethylpolysiloxane',
    category: 'anti_foaming',
    severity: 'low',
    description: 'Silicone anti-foaming agent',
    healthImpact: 'Generally safe. Used in frying oils.'
  },
  'en:e901': {
    code: 'E901',
    name: 'Beeswax',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Natural wax from bees',
    healthImpact: 'Safe. Natural product.'
  },
  'en:e902': {
    code: 'E902',
    name: 'Candelilla Wax',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Plant wax',
    healthImpact: 'Generally safe.'
  },
  'en:e903': {
    code: 'E903',
    name: 'Carnauba Wax',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Palm tree wax',
    healthImpact: 'Safe. Natural plant wax.'
  },
  'en:e904': {
    code: 'E904',
    name: 'Shellac',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Resin from lac insects',
    healthImpact: 'Generally safe. Not vegan.'
  },
  'en:e905': {
    code: 'E905',
    name: 'Microcrystalline Wax',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Petroleum wax',
    healthImpact: 'Generally safe in food use.'
  },
  'en:e907': {
    code: 'E907',
    name: 'Hydrogenated Poly-1-decene',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Synthetic wax',
    healthImpact: 'Generally safe.'
  },
  'en:e912': {
    code: 'E912',
    name: 'Montan Acid Esters',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Wax from lignite',
    healthImpact: 'Generally safe.'
  },
  'en:e914': {
    code: 'E914',
    name: 'Oxidized Polyethylene Wax',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Synthetic wax',
    healthImpact: 'Generally safe for fruit coating.'
  },
  'en:e920': {
    code: 'E920',
    name: 'L-Cysteine',
    category: 'flour_treatment',
    severity: 'low',
    description: 'Amino acid dough conditioner',
    healthImpact: 'Safe. May be from human hair or feathers.'
  },
  'en:e921': {
    code: 'E921',
    name: 'L-Cystine',
    category: 'flour_treatment',
    severity: 'low',
    description: 'Amino acid',
    healthImpact: 'Generally safe.'
  },
  'en:e924': {
    code: 'E924',
    name: 'Potassium Bromate',
    category: 'flour_treatment',
    severity: 'high',
    description: 'Bread improver',
    healthImpact: 'Carcinogen. Banned in EU, Canada, Brazil. Still used in USA.'
  },
  'en:e925': {
    code: 'E925',
    name: 'Chlorine',
    category: 'flour_treatment',
    severity: 'medium',
    description: 'Flour bleaching agent',
    healthImpact: 'May form harmful compounds. Limited use.'
  },
  'en:e926': {
    code: 'E926',
    name: 'Chlorine Dioxide',
    category: 'flour_treatment',
    severity: 'medium',
    description: 'Flour bleaching',
    healthImpact: 'Destroys vitamin E. Some concerns.'
  },
  'en:e927a': {
    code: 'E927a',
    name: 'Azodicarbonamide',
    category: 'flour_treatment',
    severity: 'high',
    description: 'Dough conditioner',
    healthImpact: 'Banned in EU and Australia. May cause asthma. Forms carcinogenic byproducts.'
  },
  'en:e927b': {
    code: 'E927b',
    name: 'Carbamide',
    category: 'flour_treatment',
    severity: 'low',
    description: 'Urea',
    healthImpact: 'Generally safe in food processing.'
  },
  'en:e928': {
    code: 'E928',
    name: 'Benzoyl Peroxide',
    category: 'flour_treatment',
    severity: 'medium',
    description: 'Flour bleaching agent',
    healthImpact: 'Destroys nutrients. May cause allergies.'
  },
  'en:e930': {
    code: 'E930',
    name: 'Calcium Peroxide',
    category: 'flour_treatment',
    severity: 'low',
    description: 'Dough conditioner',
    healthImpact: 'Generally safe.'
  },
  'en:e938': {
    code: 'E938',
    name: 'Argon',
    category: 'packaging_gas',
    severity: 'low',
    description: 'Inert gas',
    healthImpact: 'Completely safe. Noble gas.'
  },
  'en:e939': {
    code: 'E939',
    name: 'Helium',
    category: 'packaging_gas',
    severity: 'low',
    description: 'Inert gas',
    healthImpact: 'Completely safe.'
  },
  'en:e940': {
    code: 'E940',
    name: 'Dichlorodifluoromethane',
    category: 'propellant',
    severity: 'medium',
    description: 'Refrigerant gas',
    healthImpact: 'Environmental concerns. Limited use.'
  },
  'en:e941': {
    code: 'E941',
    name: 'Nitrogen',
    category: 'packaging_gas',
    severity: 'low',
    description: 'Inert gas',
    healthImpact: 'Completely safe. Makes up 78% of air.'
  },
  'en:e942': {
    code: 'E942',
    name: 'Nitrous Oxide',
    category: 'propellant',
    severity: 'low',
    description: 'Laughing gas, whipping cream propellant',
    healthImpact: 'Safe in food use.'
  },
  'en:e943a': {
    code: 'E943a',
    name: 'Butane',
    category: 'propellant',
    severity: 'low',
    description: 'Aerosol propellant',
    healthImpact: 'Safe when used properly.'
  },
  'en:e943b': {
    code: 'E943b',
    name: 'Isobutane',
    category: 'propellant',
    severity: 'low',
    description: 'Aerosol propellant',
    healthImpact: 'Safe in food applications.'
  },
  'en:e944': {
    code: 'E944',
    name: 'Propane',
    category: 'propellant',
    severity: 'low',
    description: 'Aerosol propellant',
    healthImpact: 'Safe when used properly.'
  },
  'en:e948': {
    code: 'E948',
    name: 'Oxygen',
    category: 'packaging_gas',
    severity: 'low',
    description: 'Essential gas',
    healthImpact: 'Completely safe.'
  },
  'en:e949': {
    code: 'E949',
    name: 'Hydrogen',
    category: 'packaging_gas',
    severity: 'low',
    description: 'Lightest element',
    healthImpact: 'Safe in food packaging.'
  },
  'en:e950': {
    code: 'E950',
    name: 'Acesulfame K',
    category: 'sweetener',
    severity: 'medium',
    description: 'Artificial sweetener 200x sweeter than sugar',
    healthImpact: 'Some studies suggest possible carcinogenic effects. May affect gut bacteria.'
  },
  'en:e951': {
    code: 'E951',
    name: 'Aspartame',
    category: 'sweetener',
    severity: 'high',
    description: 'Artificial sweetener',
    healthImpact: 'WHO classified as "possibly carcinogenic" in 2023. May cause headaches, dizziness. Contains phenylalanine.'
  },
  'en:e952': {
    code: 'E952',
    name: 'Cyclamate',
    category: 'sweetener',
    severity: 'high',
    description: 'Artificial sweetener',
    healthImpact: 'Banned in USA since 1969 due to cancer concerns. Still used in EU.'
  },
  'en:e953': {
    code: 'E953',
    name: 'Isomalt',
    category: 'sweetener',
    severity: 'low',
    description: 'Sugar alcohol',
    healthImpact: 'Can cause digestive issues and diarrhea.'
  },
  'en:e954': {
    code: 'E954',
    name: 'Saccharin',
    category: 'sweetener',
    severity: 'medium',
    description: 'Oldest artificial sweetener',
    healthImpact: 'Previously linked to bladder cancer in rats. Generally considered safe for humans.'
  },
  'en:e955': {
    code: 'E955',
    name: 'Sucralose',
    category: 'sweetener',
    severity: 'medium',
    description: 'Artificial sweetener from sugar',
    healthImpact: 'May affect gut bacteria and glucose metabolism. Heat creates harmful compounds.'
  },
  'en:e956': {
    code: 'E956',
    name: 'Alitame',
    category: 'sweetener',
    severity: 'medium',
    description: 'Artificial sweetener',
    healthImpact: 'Similar to aspartame. Limited data.'
  },
  'en:e957': {
    code: 'E957',
    name: 'Thaumatin',
    category: 'sweetener',
    severity: 'low',
    description: 'Natural protein sweetener',
    healthImpact: 'Generally safe. From African fruit.'
  },
  'en:e958': {
    code: 'E958',
    name: 'Glycyrrhizin',
    category: 'sweetener',
    severity: 'medium',
    description: 'From licorice root',
    healthImpact: 'Can raise blood pressure. Not for pregnant women.'
  },
  'en:e959': {
    code: 'E959',
    name: 'Neohesperidin DC',
    category: 'sweetener',
    severity: 'low',
    description: 'From citrus',
    healthImpact: 'Generally safe.'
  },
  'en:e960': {
    code: 'E960',
    name: 'Steviol Glycosides',
    category: 'sweetener',
    severity: 'low',
    description: 'Stevia, natural sweetener',
    healthImpact: 'Generally safe. Natural plant extract.'
  },
  'en:e961': {
    code: 'E961',
    name: 'Neotame',
    category: 'sweetener',
    severity: 'medium',
    description: 'Artificial sweetener similar to aspartame',
    healthImpact: 'Similar concerns to aspartame but more stable.'
  },
  'en:e962': {
    code: 'E962',
    name: 'Salt of Aspartame-acesulfame',
    category: 'sweetener',
    severity: 'medium',
    description: 'Combination sweetener',
    healthImpact: 'Combined concerns of both sweeteners.'
  },
  'en:e963': {
    code: 'E963',
    name: 'Tagatose',
    category: 'sweetener',
    severity: 'low',
    description: 'Low-calorie sugar',
    healthImpact: 'Generally safe. May cause digestive issues.'
  },
  'en:e964': {
    code: 'E964',
    name: 'Polyglycitol Syrup',
    category: 'sweetener',
    severity: 'low',
    description: 'Sugar alcohol blend',
    healthImpact: 'Laxative effect in large amounts.'
  },
  'en:e965': {
    code: 'E965',
    name: 'Maltitol',
    category: 'sweetener',
    severity: 'medium',
    description: 'Sugar alcohol',
    healthImpact: 'Strong laxative effect. Can cause severe digestive distress.'
  },
  'en:e966': {
    code: 'E966',
    name: 'Lactitol',
    category: 'sweetener',
    severity: 'medium',
    description: 'Sugar alcohol from lactose',
    healthImpact: 'Laxative effect. Not for lactose intolerant.'
  },
  'en:e967': {
    code: 'E967',
    name: 'Xylitol',
    category: 'sweetener',
    severity: 'low',
    description: 'Sugar alcohol from birch',
    healthImpact: 'Generally safe for humans. TOXIC TO DOGS. May cause digestive issues.'
  },
  'en:e968': {
    code: 'E968',
    name: 'Erythritol',
    category: 'sweetener',
    severity: 'low',
    description: 'Sugar alcohol',
    healthImpact: 'Generally well tolerated. Less digestive issues than other sugar alcohols.'
  },
  'en:e969': {
    code: 'E969',
    name: 'Advantame',
    category: 'sweetener',
    severity: 'medium',
    description: 'Artificial sweetener from aspartame',
    healthImpact: 'Similar to aspartame but more potent.'
  },
  'en:e999': {
    code: 'E999',
    name: 'Quillaia Extract',
    category: 'foaming_agent',
    severity: 'low',
    description: 'From soap bark tree',
    healthImpact: 'Generally safe in small amounts.'
  },

  // E1000-E1599: Additional Chemicals
  'en:e1001': {
    code: 'E1001',
    name: 'Choline Salts',
    category: 'emulsifier',
    severity: 'low',
    description: 'Essential nutrient',
    healthImpact: 'Generally safe and beneficial.'
  },
  'en:e1100': {
    code: 'E1100',
    name: 'Amylases',
    category: 'enzyme',
    severity: 'low',
    description: 'Enzymes that break down starch',
    healthImpact: 'Generally safe. Natural enzymes.'
  },
  'en:e1101': {
    code: 'E1101',
    name: 'Proteases',
    category: 'enzyme',
    severity: 'low',
    description: 'Protein-digesting enzymes',
    healthImpact: 'Generally safe.'
  },
  'en:e1102': {
    code: 'E1102',
    name: 'Glucose Oxidase',
    category: 'enzyme',
    severity: 'low',
    description: 'Enzyme from fungi',
    healthImpact: 'Generally safe.'
  },
  'en:e1103': {
    code: 'E1103',
    name: 'Invertases',
    category: 'enzyme',
    severity: 'low',
    description: 'Breaks down sucrose',
    healthImpact: 'Generally safe.'
  },
  'en:e1104': {
    code: 'E1104',
    name: 'Lipases',
    category: 'enzyme',
    severity: 'low',
    description: 'Fat-digesting enzymes',
    healthImpact: 'Generally safe.'
  },
  'en:e1105': {
    code: 'E1105',
    name: 'Lysozyme',
    category: 'preservative',
    severity: 'low',
    description: 'Natural enzyme from eggs',
    healthImpact: 'Safe unless egg allergic.'
  },
  'en:e1200': {
    code: 'E1200',
    name: 'Polydextrose',
    category: 'bulking_agent',
    severity: 'low',
    description: 'Synthetic fiber',
    healthImpact: 'May cause digestive issues in large amounts.'
  },
  'en:e1201': {
    code: 'E1201',
    name: 'Polyvinylpyrrolidone',
    category: 'stabilizer',
    severity: 'medium',
    description: 'Synthetic polymer',
    healthImpact: 'Some concerns about accumulation.'
  },
  'en:e1202': {
    code: 'E1202',
    name: 'Polyvinylpolypyrrolidone',
    category: 'stabilizer',
    severity: 'medium',
    description: 'Insoluble polymer',
    healthImpact: 'Not absorbed by body.'
  },
  'en:e1203': {
    code: 'E1203',
    name: 'Polyvinyl Alcohol',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Synthetic polymer',
    healthImpact: 'Generally safe in food use.'
  },
  'en:e1204': {
    code: 'E1204',
    name: 'Pullulan',
    category: 'glazing_agent',
    severity: 'low',
    description: 'Polysaccharide from fungus',
    healthImpact: 'Generally safe.'
  },
  'en:e1400': {
    code: 'E1400',
    name: 'Dextrin',
    category: 'thickener',
    severity: 'low',
    description: 'From starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1401': {
    code: 'E1401',
    name: 'Modified Starch',
    category: 'thickener',
    severity: 'low',
    description: 'Acid-treated starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1402': {
    code: 'E1402',
    name: 'Alkaline Modified Starch',
    category: 'thickener',
    severity: 'low',
    description: 'Alkali-treated starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1403': {
    code: 'E1403',
    name: 'Bleached Starch',
    category: 'thickener',
    severity: 'low',
    description: 'Whitened starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1404': {
    code: 'E1404',
    name: 'Oxidized Starch',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1405': {
    code: 'E1405',
    name: 'Starches Treated with Enzymes',
    category: 'thickener',
    severity: 'low',
    description: 'Enzyme-modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1410': {
    code: 'E1410',
    name: 'Monostarch Phosphate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1412': {
    code: 'E1412',
    name: 'Distarch Phosphate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1413': {
    code: 'E1413',
    name: 'Phosphated Distarch Phosphate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1414': {
    code: 'E1414',
    name: 'Acetylated Distarch Phosphate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1420': {
    code: 'E1420',
    name: 'Acetylated Starch',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1422': {
    code: 'E1422',
    name: 'Acetylated Distarch Adipate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1440': {
    code: 'E1440',
    name: 'Hydroxypropyl Starch',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1442': {
    code: 'E1442',
    name: 'Hydroxypropyl Distarch Phosphate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1450': {
    code: 'E1450',
    name: 'Starch Sodium Octenyl Succinate',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1451': {
    code: 'E1451',
    name: 'Acetylated Oxidized Starch',
    category: 'thickener',
    severity: 'low',
    description: 'Modified starch',
    healthImpact: 'Generally safe.'
  },
  'en:e1452': {
    code: 'E1452',
    name: 'Starch Aluminium Octenyl Succinate',
    category: 'thickener',
    severity: 'medium',
    description: 'Modified starch with aluminum',
    healthImpact: 'Aluminum accumulation concerns.'
  },
  'en:e1505': {
    code: 'E1505',
    name: 'Triethyl Citrate',
    category: 'foam_stabilizer',
    severity: 'low',
    description: 'Citric acid ester',
    healthImpact: 'Generally safe.'
  },
  'en:e1510': {
    code: 'E1510',
    name: 'Ethanol',
    category: 'solvent',
    severity: 'low',
    description: 'Alcohol',
    healthImpact: 'Safe in food amounts. Avoid if alcohol-sensitive.'
  },
  'en:e1517': {
    code: 'E1517',
    name: 'Glyceryl Diacetate',
    category: 'solvent',
    severity: 'low',
    description: 'Glycerin derivative',
    healthImpact: 'Generally safe.'
  },
  'en:e1518': {
    code: 'E1518',
    name: 'Glyceryl Triacetate',
    category: 'humectant',
    severity: 'low',
    description: 'Triacetin',
    healthImpact: 'Generally safe.'
  },
  'en:e1519': {
    code: 'E1519',
    name: 'Benzyl Alcohol',
    category: 'solvent',
    severity: 'medium',
    description: 'Aromatic alcohol',
    healthImpact: 'May cause allergic reactions.'
  },
  'en:e1520': {
    code: 'E1520',
    name: 'Propylene Glycol',
    category: 'humectant',
    severity: 'low',
    description: 'Common in foods and cosmetics',
    healthImpact: 'Generally safe. Large amounts may cause issues.'
  },
  'en:e1521': {
    code: 'E1521',
    name: 'Polyethylene Glycol',
    category: 'anti_foaming',
    severity: 'medium',
    description: 'PEG',
    healthImpact: 'Some concerns about impurities and processing.'
  }
};

// Helper function to get additive info by various formats
export function getAdditiveInfo(additiveCode) {
  // Handle different input formats
  let searchKey = additiveCode.toLowerCase().trim();
  
  // Try direct lookup first
  if (ADDITIVES_DATABASE[searchKey]) {
    return ADDITIVES_DATABASE[searchKey];
  }
  
  // Try with 'en:' prefix
  if (!searchKey.startsWith('en:')) {
    searchKey = 'en:' + searchKey;
    if (ADDITIVES_DATABASE[searchKey]) {
      return ADDITIVES_DATABASE[searchKey];
    }
  }
  
  // Try without 'en:' prefix
  if (searchKey.startsWith('en:')) {
    const withoutPrefix = searchKey.substring(3);
    // Try to find by code number
    for (const key in ADDITIVES_DATABASE) {
      if (ADDITIVES_DATABASE[key].code.toLowerCase() === withoutPrefix) {
        return ADDITIVES_DATABASE[key];
      }
    }
  }
  
  // Return unknown additive info
  return {
    code: additiveCode.toUpperCase(),
    name: `Unknown Additive (${additiveCode})`,
    category: 'unknown',
    severity: 'medium',
    description: 'Information not available for this additive',
    healthImpact: 'Effects unknown - proceed with caution'
  };
}

// Get all additives by severity
export function getAdditivesBySeverity(severity) {
  return Object.values(ADDITIVES_DATABASE).filter(additive => additive.severity === severity);
}

// Get all additives by category
export function getAdditivesByCategory(category) {
  return Object.values(ADDITIVES_DATABASE).filter(additive => additive.category === category);
}