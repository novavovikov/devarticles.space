---
cover: cover.jpeg
date: 2021-07-06
title: React 18. Пакетная обработка (Автоматическая группировка изменений)
description: React 18 добавляет улучшения производительности, выполняя больше пакетной обработки изменений по умолчанию. В этом посте будет объяснено, что такое пакетирование, как оно работало раньше и что изменилось.
tags:
- react
- javascript
---

## Что такое пакетная обработка?

Пакетная обработка — это когда React **группирует несколько обновлений состояния в один рендеринг** для повышения производительности.

Например, если у вас есть два обновления состояния внутри одного события клика по кнопке, то React всегда объединяет их
в один рендеринг. Если вы запустите следующий код, вы увидите, что каждый раз, когда вы нажимаете, то React выполнит только один рендеринг, хотя вы устанавливаете состояние дважды:

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    setCount(c => c + 1); // Еще не перерисовывает
    setFlag(f => !f); // Еще не перерисовывает
    // React выполнит рендеринг только один раз в конце (это и есть пакетная обработка!)
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```
📃 [Демо: Rect 17 группирует обновления внутри обработчиков событий](https://codesandbox.io/s/spring-water-929i6?file=/src/index.js). (Обратите внимание на один рендер на клик в консоли.)

Это отлично подходит для повышения производительности, поскольку позволяет избежать ненужных повторных рендеров.
Это также предотвращает отрисовку вашего компонента с не полностью обновленным состоянием, что могло бы вызвать ошибки.

Это напоминает работу официанта: Он дожидается, когда вы сделаете полностью весь заказ, а не бежит каждый раз на кухню,
когда вы озвучиваете блюдо.

Однако React не консистентно относился к пакетным обновлениям. Например, если вам нужно получить данные, а затем
обновить состояние в `handleClick`, то React НЕ будет пакетировать обновления и выполнит два независимых обновления.

Это связано с тем, что React раньше группировал обновления только во время события браузера (например, клика), 
но здесь мы обновляем состояние после того, как событие уже было обработано (в обратном вызове fetch):

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 17 и более ранние версии НЕ объединяют их в пакеты, потому что
      // они запускаются после события в callback, а не во время его
      setCount(c => c + 1); // Вызывает повторный рендер
      setFlag(f => !f); // Вызывает повторный рендер
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```
📃 [Демо: React 17 НЕ выполняет пакетную обработку внешних обработчиков событий.](https://codesandbox.io/s/trusting-khayyam-cn5ct?file=/src/index.js) (Обратите внимание на два рендера на клик в консоли.)

До React 18 обновления группировались только внутри обработчиков событий React. Обновления внутри промисов, setTimeout,
нативных обработчиков событий или любого другого события по умолчанию не группировались в React.

### Что такое автоматическая группировка изменений?

Начиная с React 18 с [createRoot](https://github.com/reactwg/react-18/discussions/5), все обновления будут автоматически
группироваться независимо от того, откуда они исходят.

Это означает, что обновления внутри setTimeouts, промисов, нативных обработчиков событий или любого другого события 
будут пакетироваться так же, как обновления внутри событий React. Ожидается, что это приведет к меньшему количеству
обновлений компонента и, следовательно, к повышению производительности в ваших приложениях:

```jsx
function App() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 18 и более поздние версии ДЕЛАЮТ пакетную обработку:
      setCount(c => c + 1);
      setFlag(f => !f);
      // React выполнит рендеринг только один раз в конце (это и есть пакетная обработка!)
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1 style={{ color: flag ? "blue" : "black" }}>{count}</h1>
    </div>
  );
}
```
📃 [Демо: React 18 с автоматической группировкой событий в createRoot даже вне обработчиков событий!](https://codesandbox.io/s/morning-sun-lgz88?file=/src/index.js) (Обратите внимание на один рендер на клик в консоли!)

> **Примечание.** Ожидается, что вы [обновитесь до createRoot](https://github.com/reactwg/react-18/discussions/5). 
> Старое поведение с рендерингом существует только для того, чтобы упростить проведение экспериментов с обеими версиями.

React будет автоматически пакетировать обновления независимо от того, где они происходят, поэтому это:

```jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React выполнит рендеринг только один раз в конце (это и есть пакетная обработка!)
}
```

ведёт себя так же как это:

```jsx
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React выполнит рендеринг только один раз в конце (это и есть пакетная обработка!)
}, 1000);
```

и так же как это:

```jsx
fetch(/*...*/).then(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React выполнит рендеринг только один раз в конце (это и есть пакетная обработка!)
})
```

и как это:

```jsx
elm.addEventListener('click', () => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React выполнит рендеринг только один раз в конце (это и есть пакетная обработка!)
});
```

> **Примечание.** React запускает пакетные обновления только тогда, когда это вообще безопасно.
> Например, React гарантирует, что для каждого инициированного пользователем события,
> такого как клик или нажатие клавиши, DOM полностью обновится перед следующим событием.
> Это гарантирует, например, что форма, которая заблокирована при отправке, не может быть отправлена дважды.


## Что делать, если я не хочу выполнять пакетную обработку?

Обычно пакетирование безопасно, но некоторый код может зависеть от чтения чего-либо из DOM сразу после 
изменения состояния. В этих случаях вы можете использовать `ReactDOM.flushSync()`, чтобы отказаться от пакетной
обработки:

```jsx
import { flushSync } from 'react-dom'; // Note: react-dom, not react

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React уже обновил DOM
  flushSync(() => {
    setFlag(f => !f);
  });
  // React уже обновил DOM
}
```

Ожидается, что это будет использоваться в исключительных случаях.

## Это что-нибудь сломает для хуков?

Если вы используете хуки, то ожидается, что автоматическая группировка будет "просто работать" 
в подавляющем большинстве случаев.

## Это что-нибудь сломает для классов?

Имейте в виду, что обновления во время обработки обработчиков событий React всегда были пакетными, 
поэтому для этих обновлений нет никаких изменений.

В компонентах класса есть крайние случаи, когда это может быть проблемой.

Компоненты класса имели реализации, когда можно было синхронно читать обновления состояния внутри событий.
Это означает, что вы сможете читать `this.state` между вызовами `setState`:

```jsx
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));

    // { count: 1, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

В React 18 это уже не так. Поскольку все обновления даже в setTimeout являются пакетными, React не отображает результат
первого setState синхронно — визуализация происходит во время следующего тика браузера. Итак, рендер еще не произошел:

```jsx
handleClick = () => {
  setTimeout(() => {
    this.setState(({ count }) => ({ count: count + 1 }));

    // { count: 0, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```
📃 [Посмотреть sandbox](https://codesandbox.io/s/interesting-rain-hkjqw?file=/src/App.js).

Если это препятствует обновлению до React 18, вы можете использовать `ReactDOM.flushSync` для принудительного обновления,
но рекомендуется использовать это с осторожностью:

```jsx
handleClick = () => {
  setTimeout(() => {
    ReactDOM.flushSync(() => {
      this.setState(({ count }) => ({ count: count + 1 }));
    });

    // { count: 1, flag: false }
    console.log(this.state);

    this.setState(({ flag }) => ({ flag: !flag }));
  });
};
```

📃 [Посмотреть sandbox.](https://codesandbox.io/s/hopeful-minsky-99m7u?file=/src/App.js)

Эта проблема не влияет на функциональные компоненты с хуками, 
потому что состояние не обновляет существующую переменную из `useState`:

```jsx
function handleClick() {
  setTimeout(() => {
    console.log(count); // 0
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
    console.log(count); // 0
  }, 1000)
}
```

Хотя такое поведение могло показаться неожиданным, когда вы применили хуки, оно открыло путь для автоматизированного пакетирования.

## А что насчет `unstable_batchedUpdates`?

Некоторые библиотеки React используют этот недокументированный API для принудительного пакетирования `setState` вне обработчиков событий:

```jsx
import { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
});
```

Этот API все еще существует, но в нем больше нет необходимости, потому что пакетирование происходит автоматически.
Команда React не планирует удалять его в ближайших релизах, хотя он может быть удален в стабильной версии после того,
как популярные библиотеки перестанут зависеть от его существования.

## Заключение

Без сомнения, автоматическая группировка изменений — основная фича, которая порадует всех.
С помощью всего лишь одного изменения в корне вашего приложения React вы получите большую гибкость
и лучшую производительность. 

Это то, чего я жду больше всего, наряду с новыми API.