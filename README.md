# @prozorro/prozorro-eds

#### Бібліотека електронного підпису для вебзастосунків Prozorro. Забезпечує:
- ініціалізацію оточення підпису;
- підпис та перевірку об’єктів із ЦБД;
- підпис довільних даних;
- роботу з віджетом (iframe) для накладання підпису користувачем.

## Встановлення

### NPM

```bash
npm i @prozorro/prozorro-eds
```

### YARN

```bash
yarn add @prozorro/prozorro-eds
```

---

## Швидкий старт

```ts
import { ProzorroEds } from "@prozorro/prozorro-eds";

await ProzorroEds.init({ debug: true });
```

### Приклад підпису довільних даних

```ts
import { ProzorroEds } from "@prozorro/prozorro-eds";

await ProzorroEds.init({ debug: true });

const signed = await ProzorroEds.sign("Any data", {
  asBase64String: true,          // опційно: отримати base64
});

console.log(signed);
```

### Приклад перевірки підпису

```ts
import { ProzorroEds } from "@prozorro/prozorro-eds";

await ProzorroEds.init({ debug: true });

const info = await ProzorroEds.verify("BASE64_SIGNED_DATA");

console.log(info.signers); // масив підписантів
```

### Робота з віджетом (iframe)

```ts
import { ProzorroEds } from "@prozorro/prozorro-eds";

await ProzorroEds.init({ debug: true });

const widget = await ProzorroEds.loadWidget();

// Напр., скинути зчитаний ключ
await widget.resetKey();
```

> Для завантаження віджета домен вебзастосунку має бути доданий у список дозволених (інакше користувач побачить “Доступ заборонено”). 
> В тестовому середовищі історично дозволені `localhost` та `sign-widget-test.eu.iit.com.ua`. 
> На сторінці має бути контейнер для iframe, напр.:  
> `<div id="sign-widget-parent" style="width: 580px; height: 420px"></div>`.

---

## API

Нижче — зведена специфікація методів https://www.npmjs.com/package/@prozorro/prozorro-eds?activeTab=code файл
prozorro-eds.d.ts; реальні типи доступні з пакета.

### Ініціалізація

```ts
await ProzorroEds.init(options?: EdsInitializationConfigType): Promise<void>
```

- Має бути викликаний **перед** будь-якими іншими операціями (підпис/перевірка/віджет).  
  Опції:
    - `debug?: boolean` — службові логи в консолі;
    - `callbackAfterAuth?: (certs: CertificateType[]) => void` — викликається після зчитування ключа користувачем;
    - `ignoreFields?: string[]` — ключі полів, які ігноруються при порівнянні об’єктів (під час валідації підпису з ЦБД).

### Віджет підпису

```ts
const widget = await ProzorroEds.loadWidget(): Promise<WidgetUserServiceInterface>
```

- Завантажує iframe-віджет підпису (потрібний для накладання підпису).
- `WidgetUserServiceInterface`:
    - `resetKey(): Promise<void>` — скинути зчитаний ключ.

### Підписання

```ts
// 1) Підпис довільних даних
await ProzorroEds.sign(data: Uint8Array | string, options?: UserSignOptionsType): Promise<Uint8Array | string>

// 2) Підпис об’єктів із ЦБД
await ProzorroEds.signObjects(links: string[], options?: UserSignOptionsType): Promise<SignedObjectType[]>
```

`UserSignOptionsType`:
- `asBase64String?: boolean` — повернути підпис як base64-рядок (інакше `Uint8Array`);
- `previousSign?: Uint8Array | string | null` — додати підпис до наданого (можливо лише якщо попередній підпис **не** містить цього підписувача).

Повернення:
- `sign(...) / signHash(...)` — масив байт або base64 (залежно від `asBase64String`);
- `signObjects(...)` — масив `{ id, sign }`, де:
    - `id: string` — ідентифікатор об’єкта з ЦБД,
    - `sign: Uint8Array | string` — підпис.

### Перевірка

```ts
// 1) Перевірка довільного підпису (base64)
await ProzorroEds.verify(sign: string): Promise<SignType>

// 2) Перевірка об’єктів із ЦБД
await ProzorroEds.verifyObjects(links: string[]): Promise<VerifyObjectResponseType[]>
```

Повернення:
- `verify(...)` — структура підпису `SignType` з масивом підписантів;
- `verifyObjects(...)` — дані про відмінності між підписом і фактичним JSON з ЦБД (через `jsondiffpatch`), список підписантів, та нормалізовані дані з підпису.

---

## Типи

### `EdsInitializationConfigType`
- `ignoreFields?: string[]`
- `callbackAfterAuth?: (CertificateType[]) => void`
- `debug?: boolean`
- `environment?: "production" | "development"`
### `EdsWidgetConfigType`
- `parentId: string;` - Ідентифікатор братківського елементу для відображення iframe, який завантажує сторінку SignWidget
- `frameId: string;` - Ідентифікатор iframe, який завантажує сторінку SignWidget

### `UserSignOptionsType`
- `asBase64String?: boolean`
- `previousSign?: Uint8Array | string | null`

### `SignType`
- `data: string`
- `signers: SignerType[]`

### `SignerType` (витяг)
- `issuer`, `issuerCN`, `serial`, `subject`, `subjectCN`, `subjectOrg`, `subjectOrgUnit`, `subjectTitle`, `subjectState`, `subjectLocality`, `subjectFullName`, `subjectAddress`, `subjectPhone`, `subjectEMail`, `subjectDNS`, `subjectEDRPOUCode`, `subjectDRFOCode`
- `isFilled`, `isTimeAvail`, `isTimeStamp`
- `time: TimeType`

### `TimeType`
- `year`, `month`, `dayOfWeek`, `day`, `hour`, `minute`, `second`, `milliseconds`

### `SignedObjectType`
- `id: string` — ідентифікатор об’єкта з ЦБД
- `sign: Uint8Array | string` — підпис (тип залежить від опцій підпису)

### `VerifyObjectResponseType`
- `difference?: DeltaType` — результат порівняння підпису з JSON-даними ЦБД
- `signers: SignerType[]`
- `data.fromSign: JSON` — дані з підпису
- `data.fromDb: JSON` — дані з ЦБД

### `CertificateType`
- `data: Uint8Array`
- `infoEx: InfoExType` — розширена інформація сертифіката (OCSP/TSP/модуль RSA, строки дії, серійний номер, ключові призначення тощо).

---

## Обробка помилок

Обгортайте виклики бібліотеки у `try..catch`. Користувач отримує читабельний текст помилки; службова інформація виводиться у консоль (за `debug: true`).

---

## Release notes 

- **21.10.2025** 
  - Refactored eusign.js dependency;
- **23.10.2025** 
  - Removed environment dependency from `-beta` library tag;
  - Renamed the `UserOptionsType` type to `EdsInitializationConfigType`;
  - Extended the `EdsInitializationConfigType` type, added `environment` field;
  - Added the `EdsWidgetConfigType` type for `loadWidget`;
  - Renamed `window.eds` to `window.ProzorroEds`;
  - Updated the validation messages;
  - Deleted the Sentry service;

---

### Ліцензія

© Prozorro. Усі права захищені.
