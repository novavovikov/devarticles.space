---
cover: cover.jpeg
date: 2021-07-02
title: React 18. Что нового?
description: В недавнем посте команда React объявила о следующей версии React, а также о ее будущих функциях, сроках выпуска и как начать пользоваться общедоступной альфа-версией.
tags:
- react
- javascript
---

8 июня команда React опубликовала [пост в своём блоге](https://ru.reactjs.org/blog/2021/06/08/the-plan-for-react-18.html),
в котором объявила о следующей версии React, а также о ее будущих функциях, сроках выпуска и как начать пользоваться общедоступной альфа-версией.

## Что будет в React 18

Когда выйдет новая версия React, то из коробки будут предоставляться следующие улучшения:

- [автоматическая группировка изменения](/articles/react-18-batching/) состояний для меньшего количества рендеров
- новое API ([createRoot](/articles/react-18-create-root),
  [startTransition](/articles/react-18-start-transition/),
  [useDeferredValue](https://ru.reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue),
  [SuspenseList](https://ru.reactjs.org/docs/concurrent-mode-reference.html#suspenselist))
- [потоковый рендер на сервере](https://github.com/reactwg/react-18/discussions/37)

Эти функции возможны благодаря новому механизму подписки, который будет добавлен в React 18. Он называется «параллельный
рендеринг» и позволяет React готовить несколько версий пользовательского интерфейса одновременно. 

Это изменение в основном под капотом, но оно открывает новые возможности для улучшения как реальной, так и предполагаемой
производительности приложения.

## Переход на React 18

Поскольку параллельный рендеринг в React 18 является добровольным, нет никаких серьезных изменений в поведении
компонентов. Команда React утверждает, основываясь на их опыте перехода нескольких приложений на React 18, что многие
пользователи смогут выполнить обновление в течение одного дня.

## Как попробовать React 18 Alpha сегодня

Новые
альфа-версии [регулярно публикуются в npm с использованием тега @alpha](https://github.com/reactwg/react-18/discussions/9)
.

Рабочая группа уже опубликовала несколько отличных руководств как для [клиента](https://github.com/reactwg/react-18/discussions/6),
так и для [сервера](https://github.com/reactwg/react-18/discussions/22).

Вот краткая выжимка, что необходимо сделать:

#### Установка

```shell
npm install react@alpha react-dom@alpha
```

#### Обновление на клиенте

- Мигрируйте на новый [Root API](https://github.com/reactwg/react-18/discussions/5)
- [Включите строгий режим](https://ru.reactjs.org/docs/strict-mode.html), чтобы увидеть потенциальных проблем в приложении (необязательно)

#### Обновление на клиенте

- Переключитесь с `renderToString` (ограниченная поддержка `Suspense`) и 
  `renderToNodeStream` (устарело) на `pipeToNodeWritable` (новое и рекомендованное)

## Прогнозируемые сроки выпуска React 18

Нет конкретной даты выпуска, но ожидается, что потребуется несколько месяцев обратной связи и итераций, прежде чем React
18 будет готов к релизу. План выпуска версий выглядит так:

- Alpha-версия: доступна уже сегодня
- Публичная beta-версия: минимум через несколько месяцев
- Release Candidate (RC): Через несколько недель после бета-тестирования
- Стабильная версия: Через несколько недель после RC

Более подробная информация о планируемых сроках выпуска доступна
в репозитории [рабочей группы](https://github.com/reactwg/react-18/discussions/9).

## Рабочая группа React 18

В первые при разработке React была использована рабочая группа (WG).
Были приглашена группа экспертов, разработчиков, авторов библиотек и преподавателей из всего сообщества React 
для рабочей группе, чтобы предоставлять отзывы, задавать вопросы и совместно работать над релизом.

Группа предназначена для предоставления обратной связи и подготовки более широкой экосистемы к предстоящему выпуску React. Он ограничен избранными участниками, но, поскольку беседа размещается и становится общедоступной через обсуждения GitHub, вы всегда можете проверить ее!

Цель рабочей группы — подготовить экосистему к плавному, постепенному внедрению React 18 в существующие приложения и библиотеки.
Обсуждения рабочей группы размещены на [GitHub](https://github.com/reactwg/react-18/discussions) и доступна для чтения широкой публике.
Члены рабочей группы могут оставлять отзывы, задавать вопросы и делиться идеями. 
Основная команда также будет использовать репозиторий обсуждений, чтобы поделиться результатами исследований.
По мере приближения стабильной версии любая важная информация также будет размещаться в этом репозитории.

## Заключение

Таким образом, React 18 выглядит отличным релизом. 
В него войдут ряд интересных улучшений, предоставлена возможность плавного перехода на новую версию,
а также дает сообществу больше влияния на процесс разработки благодаря новой Рабочей группе.

