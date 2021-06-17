import { PageProps } from 'gatsby'
import React from 'react'
import Page from '../../ui/page'
import { EventType } from '../../typings/event'
import Event from '../../components/event/event'
import Map from '../../components/map'
import { Coordinates } from '../../components/map/map'
import { getDateObject } from '../../utils/date'
import SubscribeForm from '../../components/subscribe-form'
import FormPopup from '../../components/form-popup/form-popup'
import * as s from './events.module.css'
import { filterByDates } from '../../utils/filter'

interface PageContext {
  name: String
  events: EventType[]
}

export default function Events(props: PageProps<{}, PageContext>) {
  const [isOpen, setOpenStatus] = React.useState<boolean>(false)
  const { name, events: eventList } = props.pageContext

  const events = filterByDates(eventList)

  const coordinates = events.reduce<Coordinates[]>((acc, { locationData }) => {
    return locationData.geometry
      ? [...acc, [locationData.geometry.lat, locationData.geometry.lng]]
      : acc
  }, [])

  const onOpenPopup = React.useCallback(() => {
    setOpenStatus(true)
  }, [])

  const onClosePopup = React.useCallback(() => {
    setOpenStatus(false)
  }, [])

  return (
    <Page
      title={`Предстоящие ${name} события:`}
      containerProps={{
        className: s.Events
      }}>
      <div className={s.Events__content}>
        <div className={s.Events__list}>
          {events.length === 0 && (
            <div>К сожалению, мы не нашли предстоящих событий 😔</div>
          )}

          <FormPopup
            requestUrl="/feedback"
            open={isOpen}
            onClose={onClosePopup}>
            <SubscribeForm />
          </FormPopup>

          {events.map((event, ndx) => (
            <Event
              key={ndx}
              {...event}
              flag={event.locationData.flag}
              startDate={
                getDateObject(event.startDate, event.locationData.timezone)!
              }
              endDate={getDateObject(
                event.endDate,
                event.locationData.timezone
              )}
            />
          ))}
        </div>

        {events.length > 0 && (
          <div className={s.Events__map}>
            <Map coordinates={coordinates} />
          </div>
        )}
      </div>
    </Page>
  )
}
