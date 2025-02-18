import { showOpenImagePicker } from '@hairy/browser-utils'
import { If } from '@hairy/react-utils'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface AvatarProps {
  defaultValue?: string
  value?: File
  onChange?: (value: File) => void
}

export function Avatar(props: AvatarProps) {
  const [avatar, setAvatar] = useState(props.defaultValue)
  const [_, setAvatarFile] = useState<File>()
  const { t } = useTranslation()

  async function onChangeAvatarByLocal() {
    const [file] = await showOpenImagePicker({ multiple: false })
    setAvatar(URL.createObjectURL(file))
    setAvatarFile(file)
    props.onChange?.(file)
  }

  return (
    <div className="relative">
      <div className="border-dashed py-2 h-150px border-1px bg-[#141414] border-[#424242] rounded-6px flex-center" onClick={onChangeAvatarByLocal}>
        <If
          cond={avatar}
          then={(
            <div className="w-full h-full flex-center relative">
              <img className="h-full object-cover" src={avatar} />
            </div>
          )}
          else={(
            <div className="w-full h-full flex-col-center">
              <div className="text-48px i-material-symbols-add-photo-alternate-rounded" />
              <div>{t('Click on the area to upload')}</div>
              <span className="text-white text-op-50 text-12px">{t('300x300recommended')}</span>
            </div>
          )}
        />
      </div>
    </div>

  )
}
