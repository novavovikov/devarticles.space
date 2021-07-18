---
cover: cover.webp
date: 2020-12-20
title: Стандарт ES2021
description: В этом посте мы рассмотрим наиболее интересные возможности, которые должны быть включены в ES12 - новую версию стандарта
tags:
  - javascript
---

Ниже я представлю список тех предложение, которые достигли стадии 4 и [комитет TC39](https://tc39.es) включил
в [последний черновик](https://tc39.es/ecma262) спецификации.

Актуальный список предложений можно
посмотреть [в репозитории на GitHub](https://github.com/tc39/proposals/blob/master/finished-proposals.md) комитета TC39

## String.replaceAll

`String.replaceAll()` заменяет все экземпляры подстроки в строке другим строковым значением без использования
глобального регулярного выражения.

До сих пор наиболее распространенный способ сделать это — использовать глобальное регулярное выражение.

Рассмотрим следующий код, в котором мы используем регулярное выражение для замены символа "+" на пробел:

```javascript
const fullname = 'fullname=John+Hannibal+Smith';
const fullnameFormated = fullname.replace(/\+/g, ' ');

console.log(fullnameFormated) // John Hannibal Smith
```

В более сложных случаях составить правильное регулярное выражение непросто и поэтому являются частым источником ошибок.

Есть конечно и другой способ решения данной задачи — это строку разделить при помощи `Array.split` и объединить её
обратно при помощи `Array.join`:

```javascript
const fullname = 'fullname=John+Hannibal+Smith';
const fullnameFormated = fullname.split('+').join(' ');

console.log(fullnameFormated) // John Hannibal Smith
```

Эта процедура позволяет избежать использования регулярных выражений, но требует разделения строки на массив частей и
последующего их склеивания, что накладывает дополнительные накладные расходы.

[Предложение Mathias Bynens](https://github.com/tc39/proposal-string-replaceall) решает эти проблемы и дает простой
способ выполнить глобальную замену подстроки:

```javascript
const fullname = 'fullname=Jhon+Hannibal+Smith';
const fullnameFormated = fullname.replaceAll('+', ' ');

console.log(fullnameFormated) // John Hannibal Smith
```

Этот метод поддерживается в NodeJs, начиная с версии 15.0.0. 
А также большинство браузеров уже [реализовали его](https://caniuse.com/mdn-javascript_builtins_string_replaceall).

📌 Обратите внимание, что для согласованности с ранее существовавшими API на
языке `String.replaceAll(searchValue, newvalue)` ведет себя
как `String.replace(searchValue, newvalue)` с двумя основными особенностями:

- Если `searchValue` является строкой, то `String.replaceAll` заменяет все вхождения, а `String.replace` заменяет только
  первое вхождение подстроки.
- Если `searchValue` - не глобальное регулярное выражение, `String.replace` заменяет только одно совпадение.
  `String.replaceAll`, с другой стороны, вызывает исключение в этом случае, чтобы избежать путаницы между отсутствием
  глобального флага и именем вызываемого метода.

## Promise.any

`Promise.any()` рассчитывается, как только любые Promise выполняются (resolved), или все они отклоняются (rejected).
В случае, когда они все отклонены (rejected) `Promise.any()` отклоняется с ошибкой `AggregateError`.

Рассмотрим следующий пример:

```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("P1"), Math.floor(Math.random() * 100));
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("P2"), Math.floor(Math.random() * 100));
});

(async function() {
  const result = await Promise.any([promise1, promise2]);

  console.log(result); // P1 or P2
})();
```

Результатом будет любой из первых выполненных (resolved) результатов `Promise.any()`.

Многие браузеры уже [реализовали](https://caniuse.com/mdn-javascript_builtins_promise_any) 
поддержку данного метода. В NodeJS он доступен, начиная с версии 15.0.0.

📌 Помните о различиях с `Promise.race()`, где выполняется расчет,
как только выполняется какой-либо из Promise, **независимо** от того, выполнены они или отклонены.

## WeakRefs

[Предложение Dean Tribble, Till Schneidereit, Sathya Gunasekaran](https://github.com/tc39/proposal-weakrefs)

Объект `WeakRef` позволяет удерживать слабую ссылку на другой объект, 
не препятствуя сборке мусора для этого объекта.

**Слабая ссылка на объект** — это ссылка, которая не препятствует удалению объекта сборщиком мусора.
Напротив, обычная (или сильная) ссылка сохраняет объект в памяти.
Когда объект больше не имеет сильных ссылок на него,
сборщик мусора движка JavaScript может уничтожить объект и освободить его память.
Если это произойдет, вы больше не сможете получить объект из слабой ссылки.

Для чего нам могут понадобиться WeakRefs?
Например, мы можем использовать объект Map для реализации кеша со множеством ключей и значений,
которым требуется много памяти. 
В этом случае нам удобно как можно скорее освободить память,
занимаемую парами «ключ-значение», и `WeakRefs` позволяет нам это сделать.

На текущий момент в JavaScript есть WeakMap() и WeakSet(), которые используют WeakRefs.

Рассмотрим следующий пример:
```javascript
const myObj = {...};
```

Функция, использующая предыдущий объект:
```javascript
function useTheObj(obj) {
   doSomethingWith(obj);
}
```

Я хочу отслеживать, сколько раз метод был вызван с конкретным объектом,
и сообщать, если это происходит более 1000 раз:

```javascript
let map = new Map();

function useTheObj(obj){
  doSomethingWith(obj);

  // получить количество вызовов или установить значение 0
  let called = map.get(obj) || 0;

  // инкрементим счётчик
  called++;

  if (called > 1000) {
    console.log("called more than 1000 times");
  };

  map.set(obj, called);
}
```

Это решение работает, но у него есть утечка памяти,
потому что каждый объект, переданный функции, навсегда остается в `map`
и не собирается сборщиком мусора. Решение — использовать WeakMap:

```javascript
let wmap = new WeakMap();

function useTheObj(obj){
  doSomethingWith(obj);
  // получить количество вызовов или установить значение 0
  let called = wmap.get(obj) || 0;


  // инкрементим счётчик
  called++;

  if (called > 1000) {
    console.log("called more than 1000 times");
  };

  wmap.set(obj, called);
}
```

Поддержка WeakRefs в браузерах пока что далеко не [везде](https://caniuse.com/?search=WeakRef),
но NodeJS доступно, начиная с версии 14.6.0.

📌 Поскольку ссылки слабые, ключи WeakMap нельзя перечислить.

📌 `WeakSet` похож на `WeakMap`, но, как и в случае с коллекциями,
каждый объект в `WeakSet` может встречаться только один раз.
Все объекты в коллекции `WeakSet` уникальны.

📌 Согласно [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef#Avoid_where_possible)
использование требует хорошего понимания `WeakRef` и рекомендуется по возможности избегать его использования.

## Оператор логического присваивания (Logical Assignment Operators)

[Предложение оператора логического присваивания](https://github.com/tc39/proposal-logical-assignment)
(Джастина Риджуэлла и Хеманта HM) объединяет логические операторы (`&&,` `||`, `??`) и выражения присваивания.

До сих пор в JavaScript были следующие операторы присваивания:

```javascript
= // присваивание
/= // присваивание с делением
*= // присваивание с умножением
&&= // присваивание с логическим И 
||= // присваивание с логическим ИЛИ 
??= // логическое нулевое присваивание
**= // присваивание с возведением в степень
%= // присваивание по модулю
+= // присваивание со сложением
-= // присваивание с вычитанием
<<= // присваивание с левым сдвигом
>>= // присваивание с правым сдвигом
>>>= // присваивание с беззнаковым сдвигом вправо
&= // присваивание с побитовым AND
^= // присваивание с побитовым XOR
|= // присваивание с побитовым OR

/** Деструктурирующее присваивание: */
[a, b] = [10, 20]
{a, b} = {a: 10, b: 20}
```

И с этим предложением мы объединим логические операторы и выражения присваивания:
```javascript
a ||= b // Эквивалентно: a || (a = b), присваивается, если a - ложное
a &&= b // Эквивалентно: a && (a = b), присваивается, если a - истина
a ??= b // Эквивалентно: a ?? (a = b), присваивается, если a - null или undefined
```

На текущий момент не все [браузеры](https://caniuse.com/?search=Logical%20Assignment%20Operators)
реализовали поддержку данных операторов. В NodeJS доступно, начиная с версии 15.0.0

## Числовые разделители (Numeric separators)

Предложение Christophe Porteneuve [числовых разделителей](https://github.com/tc39/proposal-numeric-separator)
расширяют существующий [NumericLiteral](https://tc39.es/ecma262/#prod-NumericLiteral),
позволяя использовать символ-разделитель между цифрами.

Благодаря этой функции можно легко сделать числовые литералы более удобочитаемыми,
создав визуальное разделение между группами цифр.

Например у нас есть вот такой числовой литерал:

```javascript
const money = 1000000000000;
```

Вышеупомянутый числовой литерал сложно читать,
но мы можем использовать символы подчеркивания в качестве разделителей,
чтобы облегчить чтение:

```javascript
const money = 1_000_000_000_000;
```

Теперь константа `money` стала более читабельной.

Числовые разделители могут использоваться также и для чисел с плавающей точкой:

```javascript
const money = 1_000_000.123_456;
```

**Numeric separators** уже поддерживается в большинстве [браузеров](https://caniuse.com/mdn-javascript_grammar_numeric_separators)
и в NodeJs, начиная с версии 12.5.0.
 

## Заключение

JavaScript постоянно развивается и добавляются новые инструменты.
В этой статье мы рассмотрели некоторые из этих инструментов,
которые, скорее всего, будут включены в JavaScript ES2021 (ES12).

Спасибо, что дочитали до конца. Если же вам интересно, 
что вошло в спецификацию ES2020, то может почитать [вот эту статью](/articles/es-2020).