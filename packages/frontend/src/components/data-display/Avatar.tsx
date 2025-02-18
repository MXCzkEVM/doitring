import { Avatar as AAvatar, AvatarProps as AAvatarProps } from 'antd'

export interface AvatarProps extends AAvatarProps {

}
const PINATA_URL = 'https://gateway.pinata.cloud/ipfs'

export function Avatar(props: AvatarProps) {
  return (
    <AAvatar
      {...props}
      src={typeof props.src === 'string'
        ? props.src.startsWith('http') ? props.src : `${PINATA_URL}/${props.src}`
        : props.src}
    />
  )
}
