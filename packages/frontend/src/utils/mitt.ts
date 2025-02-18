import mitt, { EventHandlerMap, EventType, Handler, Emitter as _Emitter } from 'mitt'

export interface Emitter<Events extends Record<EventType, unknown>> extends _Emitter<Events> {
  once: <Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) => void
}

export function mittWithOnce<Events extends Record<EventType, unknown>>(all?: EventHandlerMap<Record<EventType, unknown>> | undefined) {
  const inst = mitt(all) as Emitter<Events>
  inst.once = (type, fn) => {
    inst.on(type, fn)
    function remove() {
      inst.off(type, fn)
      inst.off(type, remove)
    }
    inst.on(type, remove)
  }
  return inst
}
