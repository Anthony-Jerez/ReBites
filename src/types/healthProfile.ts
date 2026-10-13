export enum DietaryRestriction {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  PESCATARIAN = 'pescatarian',
  KETO = 'keto',
  PALEO = 'paleo',
  GLUTEN_FREE = 'gluten_free',
  DAIRY_FREE = 'dairy_free',
  HALAL = 'halal',
  KOSHER = 'kosher',
}

export enum CuisineType {
  ITALIAN = 'italian',
  MEXICAN = 'mexican',
  CHINESE = 'chinese',
  JAPANESE = 'japanese',
  INDIAN = 'indian',
  THAI = 'thai',
  MEDITERRANEAN = 'mediterranean',
  AMERICAN = 'american',
  FRENCH = 'french',
  KOREAN = 'korean',
  VIETNAMESE = 'vietnamese',
  GREEK = 'greek',
  MIDDLE_EASTERN = 'middle_eastern',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface HealthProfile {
  id: string;
  dietaryRestrictions: DietaryRestriction[];
  allergies: string[];
  preferredCuisines: CuisineType[];
  servings: number;
  skillLevel: SkillLevel;
}

export interface HealthProfileState {
  profile: HealthProfile;
  isOnboarded: boolean;
}
