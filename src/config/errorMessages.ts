import type { ErrorMessageType } from "@/types/ErrorMessageType";

export const errorMessages: Record<string, ErrorMessageType> = {
  libraryInit: {
    message: "Бібліотека не була ініціалізована",
    code: "001",
  },
  widgetInit: {
    message: "Віджет підпису не був ініціалізований",
    code: "002",
  },
  apiSignRequest: {
    message: "Помилка під час спроби отримати відповідь від сервера розшифровки даних",
    code: "003",
  },
  apiSignError: {
    message: "Виникла помилка на сервері розшифровки даних",
    code: "004",
  },
  apiSignInvalidObject: {
    message: "З сервера росшифровки отримано невалідний об'єкт",
    code: "005",
  },
  objectAccess: {
    message: "Виникла помилка при отриманні об'єкту із ЦБД",
    code: "006",
  },
  objectNoSign: {
    message: "Об'єкт не містить в собі жодного документу з підписом",
    code: "007",
  },
  objectEmpty: {
    message: "Неможливо обробити порожній об'єкт",
    code: "008",
  },
  objectParse: {
    message: "Виникла помилка при спробі декодування об'єкту",
    code: "009",
  },
  verifyLinks: {
    message: "Невалідне одне, чи декільки посилань на об'єкти",
    code: "010",
  },
  keyRead: {
    message: "Виникла помилка при зчитуванні ос. ключа",
    code: "011",
  },
  incorrectInputFormat: {
    message: "Не вірний формат вхідних даних",
    code: "012",
  },

  incorrectWidgetParentIdParam: {
    message:
      "Не вірний ідентифікатор батківського елементу для відображення iframe, який завантажує сторінку SignWidget",
    code: "013",
  },

  incorrectWidgetIdParam: {
    message: "Не вірний ідентифікатор iframe, який завантажує сторінку SignWidget",
    code: "014",
  },
} as const;
