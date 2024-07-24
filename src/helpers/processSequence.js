import * as R from "ramda";
import Api from "../tools/api";

const api = new Api();

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

// математика

const charsLessThen10 = R.lt(R.__, 10);
const charsGrThen2 = R.gt(R.__, 2);
const square = (value) => value ** 2;
const squareThen = R.andThen(square);

// валидация и условия

const lenGrThen2 = R.compose(charsGrThen2, R.length);
const lenLessThen10 = R.compose(charsLessThen10, R.length);
const checkNumberRegEx = R.test(/^[0-9]+\.?[0-9]+$/);
const round = R.compose(Math.round, Number);
const mod = R.compose(String, R.mathMod(R.__, 3));
const modThen = R.andThen(mod);
const getLengthThen = R.andThen(R.length);

const validation = R.allPass([lenGrThen2, lenLessThen10, checkNumberRegEx]);

// API

const NUMBERS = "https://api.tech/numbers/base";
const ANIMALS = "https://animals.tech/";

const fetchResult = R.compose(String, R.prop('result'));
const toBinary = R.assoc("number", R.__, { from: 10, to: 2 });
const getBinaryNum = R.compose(api.get(NUMBERS), toBinary);
const fetchResultThen = R.andThen(fetchResult);
const buildAnimalURL = R.andThen(R.concat(ANIMALS));
const callWithEmptyParams = R.andThen(api.get(R.__, {}));

// proccesSequence

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const handleSuccessThen = R.andThen(handleSuccess);
  const handleErrorThen = R.otherwise(handleError);
  const handleValidationError = R.partial(handleError, ["ValidationError"]);

  const tapWriteLog = R.tap(writeLog);
  const tapLogThen = R.andThen(tapWriteLog);

  const processSequencePipiline = R.compose(
    handleErrorThen,
    handleSuccessThen,
    fetchResultThen,
    callWithEmptyParams,
    buildAnimalURL,
    tapLogThen,
    modThen,
    tapLogThen,
    squareThen,
    tapLogThen,
    getLengthThen,
    tapLogThen,
    fetchResultThen,
    getBinaryNum,
    tapWriteLog,
    round
  );

  const run = R.ifElse(validation, processSequencePipiline, handleValidationError);
  const logRun = R.compose(run, tapWriteLog);
  logRun(value);
};

export default processSequence;