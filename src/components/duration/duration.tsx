import React from 'react'
import cn from 'classnames'
import s from './duration.module.css'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  date: string
  timeToRead: number
}

export default function Duration({
  className,
  date,
  timeToRead,
  ...restProps
}: Props) {
  return (
    <div className={cn(s.Duration, className)} {...restProps}>
      <span>
        🗓️{' '}
        {new Date(date).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </span>
      <span>☕ {timeToRead} мин. чтения</span>
    </div>
  )
}
