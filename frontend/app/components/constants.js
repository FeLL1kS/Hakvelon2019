// DRAW

/**
 * @constant
 */
export const GRAPH_ORBITAL_ADDON = 6;
/**
 * @constant
 */
export const GRAPH_ORBITAL_DISTANCE = 430;

/**
 * @constant PERSON_RADIUS радиус шарика человека
 */
export const PERSON_RADIUS = 50;
/**
 * @constant PERSON_MAX_NEW_AIM_DISTANCE максимальная дистанция по оси до новой цели
 */
export const PERSON_MAX_NEW_AIM_DISTANCE = 50;

/**
 * @constant INTEREST_RADIUS радиус шарика интереса
 */
export const INTEREST_RADIUS = 35;
/**
 * @constant INTEREST_DISTANCE расстояние от человека до интереса
 */
export const INTEREST_DISTANCE = 120;
/**
 * @constant MATCHED_PERSON_POS фиксированные координаты для заматченных людей
 */
export const MATCHED_PERSON_POS = [
    {
        x : window.innerWidth / 4,
        y : window.innerHeight / 2
    },
    {
        x : window.innerWidth * 3 / 4,
        y : window.innerHeight / 2
    }
];
/**
 * @constant MATCHED_INTEREST_DISTANCE расстояние между шариками интересов в режиме сравнения
 */
export const MATCHED_INTEREST_DISTANCE = 120;

// API

/**
 * @constant APP_ROOT корень приложения, домен
 */
export const APP_ROOT = 'https://hakvelon2019.wbydcloud.com';