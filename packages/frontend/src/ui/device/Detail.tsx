import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Case, If, Switch } from '@hairy/react-utils'
import { Navbar } from './Navbar'
import { TimeSwitch } from './TimeSwitch'
import { TimeSegmented } from './TimeSegmented'
import { HealthConsult } from '@/components'

export interface DetailProps<T> {
  data: T
  title: string
  tip: string
  type: 'fortuneTeller' | 'sleeps' | 'rates' | 'steps' | 'oxygens'
  components: {
    Day: (props: any) => JSX.Element
    Week: (props: any) => JSX.Element
    Month: (props: any) => JSX.Element
  }
}

export function Detail<T>(props: DetailProps<T>) {
  const router = useRouter()

  const [date, setDate] = useState(dayjs().unix())
  const [type, setType] = useState<'d' | 'w' | 'M'>('d')

  const nextStartOf = dayjs.unix(date).add(1, type).startOf(type).valueOf()
  const nextDisabled = nextStartOf > dayjs().valueOf()
  const { Day, Month, Week } = props.components

  return (
    <>
      <Navbar title={props.title} onClickTip={() => router.push(props.tip)} />
      <div className="mx-24px">
        <TimeSwitch value={date} onChange={setDate} type={type} />
        <TimeSegmented value={type} onChange={setType as any} />

        <Switch value={type}>
          <Case cond="d">
            <If cond={nextDisabled}>
              <HealthConsult key="1" type={props.type} date={type} />
            </If>
            <Day
              lasted={nextDisabled}
              date={date}
              data={props.data}
            />
          </Case>
          <Case cond="w">
            <If cond={nextDisabled}>
              <HealthConsult key="2" type={props.type} date={type} />
            </If>
            <Week
              lasted={nextDisabled}
              date={date}
              data={props.data}
            />
          </Case>
          <Case cond="M">
            <If cond={nextDisabled}>
              <HealthConsult key="3" type={props.type} date={type} />
            </If>
            <Month
              lasted={nextDisabled}
              date={date}
              data={props.data}
            />
          </Case>
        </Switch>
      </div>

    </>
  )
}
