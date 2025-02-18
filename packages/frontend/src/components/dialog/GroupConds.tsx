import { useExtendOverlay } from '@overlastic/react'
import { Modal } from 'antd'
import { ContentForGroupCreate } from '../features'
import { noop } from '@/utils'

export function GroupCondsDialog() {
  const { resolve, visible } = useExtendOverlay({
    duration: 300,
  })
  return (
    <Modal
      title={noop as any}
      centered
      open={visible}
      onCancel={resolve}
      footer={noop}
    >
      <ContentForGroupCreate onConfirm={() => resolve()} />
    </Modal>
  )
}
