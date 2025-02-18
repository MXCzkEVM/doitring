import { Avatar, Divider } from 'antd'
import { Card } from 'antd-mobile'

export function Steps() {
  return (
    <div>
      <div className="h-280px bg-coolgray-6 bg-opacity-30 overflow-hidden relative">
        <div className="px-4 h-40px mb-12px flex items-center justify-between bg-[rgba(0,0,0,0.5)] absolute-lt right-0">
          <div className="flex-center gap-2">
            <div className="text-18px i-fxemoji-fireworksparkler" />
            <div className="font-bold">Congratulations! Yesterday's step count ranked first!</div>
          </div>
          <div className="text-18px i-material-symbols-add-photo-alternate" />
        </div>
        <img
          className="w-full h-full object-fill"
          src="https://pic.quanjing.com/e3/uu/QJ8884753690.jpg@%21794ws"
        />
      </div>
      <div className="flex items-center justify-between py-14px px-17px bg-dark mb-14px">
        <div className="flex-center">
          <span className="mr-4">1</span>
          <Avatar className="mr-2" />
          <span className="text-16px">Hairyf</span>
        </div>
        <div className="flex-center gap-2">
          <span className="text-18px">438</span>
          <div className="flex-col-center">
            <div>2</div>
            <div className="text-18px i-material-symbols-favorite-rounded" />
          </div>
        </div>
      </div>
      <div className="bg-dark">

      </div>
    </div>
  )
}
