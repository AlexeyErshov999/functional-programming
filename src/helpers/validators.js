import _, { identity, values } from "lodash";
import * as R from "ramda";
import { SHAPES, COLORS } from "../constants";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const { STAR, TRIANGLE, SQUARE, CIRCLE } = SHAPES;
const { BLUE, RED, WHITE, ORANGE, GREEN } = COLORS;

// математические операции

const GrOrEq2 = R.gte(R.__, 2);
const GrOrEq3 = R.gte(R.__, 3);
const anyGrOrEq3 = R.any(GrOrEq3);
const anyValGrOrEq3 = R.compose(anyGrOrEq3, values);

// функции распознавания цветов в нужном количестве

const twoGreenShapes = R.propEq(GREEN, 2);
const withotWhite = R.dissoc(WHITE);
const oneRedShape = R.propEq(RED, 1);

// цвета

const allColors = R.compose(R.countBy(identity), values);
const withoutWhiteColor = R.compose(withotWhite, allColors);

// функции получения фигур

const isTriangleShape = R.prop(TRIANGLE);
const isStarShape = R.prop(STAR);
const isSquareShape = R.prop(SQUARE);
const isCircleShape = R.prop(CIRCLE);

// функции распознавания цветов

const colorIsRed = R.equals(RED);
const colorIsGreen = R.equals(GREEN);
const colorIsBlue = R.equals(BLUE);
const colorIsWhite = R.equals(WHITE);
const colorIsOrange = R.equals(ORANGE);
const getGreen = R.prop(GREEN);

// функциии сравнения фигуры и ее цвета

const starIsRed = R.compose(colorIsRed, isStarShape);
const starIsWhite = R.compose(colorIsWhite, isStarShape);
const noStarIsRed = R.complement(starIsRed);
const noStarIsWhite = R.complement(starIsWhite);
const squareIsGreen = R.compose(colorIsGreen, isSquareShape);
const circleIsWhite = R.compose(colorIsWhite, isCircleShape);
const circleIsBlue = R.compose(colorIsBlue, isCircleShape);
const triangleIsWhite = R.compose(colorIsWhite, isTriangleShape);
const noTriangleIsWhite = R.complement(triangleIsWhite);
const squareIsWhite = R.compose(colorIsWhite, isSquareShape);
const noSquareIsWhite = R.complement(squareIsWhite);
const squareIsOrange = R.compose(colorIsOrange, isSquareShape);
const triangleIsGreen = R.compose(colorIsGreen, isTriangleShape);

// специфичные функции

const greenColorsNumber = R.compose(getGreen, allColors);
const redEqBlue = ({ red, blue }) => red === blue;
const oneRedColor = R.compose(oneRedShape, allColors);
const twoGreenColors = R.compose(twoGreenShapes, allColors);
const allShapesHaveThisColor = (color) =>
  R.compose(R.propEq(color, 4), allColors);
const squareAndTriangleWithSameColor = ({ square, triangle }) =>
  square === triangle;

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
  starIsRed,
  squareIsGreen,
  circleIsWhite,
  triangleIsWhite,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.compose(GrOrEq2, greenColorsNumber);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.compose(redEqBlue, allColors);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
  circleIsBlue,
  starIsRed,
  squareIsOrange,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.compose(anyValGrOrEq3, withoutWhiteColor);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = R.allPass([
  triangleIsGreen,
  twoGreenColors,
  oneRedColor,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allShapesHaveThisColor(ORANGE);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.allPass([noStarIsRed, noStarIsWhite]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allShapesHaveThisColor(GREEN);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
  noTriangleIsWhite,
  noSquareIsWhite,
  squareAndTriangleWithSameColor,
]);
