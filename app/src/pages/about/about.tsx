import React from 'react'
import Page from '../../ui/page'
import AgeMap from '../../components/age-map'

export default function NotFoundPage() {
  return (
    <Page>
      <h4>🗾 Тут информация о человеке, чьё имя нельзя называть!</h4>

      <AgeMap />
    </Page>
  )
}
