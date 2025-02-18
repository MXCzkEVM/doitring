import { Typography } from 'antd'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

function Page() {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className="mx-24px">
      <div className="py-12px flex items-center justify-between mb-12px">
        <div
          className="i-material-symbols-arrow-back-rounded text-24px"
          onClick={() => router.replace('/device/sleep')}
        />
        <span className="text-18px font-bold">{t('Understanding Sleep')}</span>
        <div className="i-material-symbols-help text-black text-24px" />
      </div>
      <Typography.Title level={3}>
        {t('Sleep duration')}
      </Typography.Title>
      <Typography.Text>
        {t('Sleep duration Text')}
      </Typography.Text>

      <Typography.Title level={3}>
        {t('Sleep structure')}
      </Typography.Title>
      <Typography.Text>
        {t('Sleep structure Text 1')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Sleep structure Text 2')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Sleep structure Text 3')}
      </Typography.Text>

      <Typography.Title level={3}>
        {t('Light sleep')}
      </Typography.Title>
      <Typography.Text>
        {t('Light sleep Text 1')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Light sleep Text 2')}
      </Typography.Text>

      <Typography.Title level={3}>
        {t('Deep sleep')}
      </Typography.Title>
      <Typography.Text>
        {t('Deep sleep Text 1')}
      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Deep sleep Text 2')}
      </Typography.Text>

      <Typography.Title level={3}>
        {t('Rapid eye movement-REM')}
      </Typography.Title>
      <Typography.Text>
        {t('Rapid eye movement-REM Text 1')}

      </Typography.Text>
      <div className="my-8px" />
      <Typography.Text>
        {t('Rapid eye movement-REM Text 2')}
      </Typography.Text>

      <Typography.Title level={3}>
        {t('Recommendations for a healthy sleep structure')}
      </Typography.Title>
      <Typography.Text className="flex-col gap-4px">
        <span>
          1.
          {t('sleep-eval-row-1')}
        </span>
        <span>
          2.
          {t('sleep-eval-row-2')}
        </span>
        <span>
          3.
          {t('sleep-eval-row-3')}
        </span>
        <span>
          4.
          {t('sleep-eval-row-4')}
        </span>
        <span>
          5.
          {t('sleep-eval-row-4_5')}
        </span>
        <span>
          6.
          {t('sleep-eval-row-5')}
        </span>
        <span>
          7.
          {t('sleep-eval-row-6')}
        </span>
        <span>
          8.
          {t('sleep-eval-row-7')}
        </span>
      </Typography.Text>

      <Typography.Title level={3}>
        {t('The necessity of napping')}
      </Typography.Title>
      <Typography.Text>
        {t('The necessity of napping Text')}
      </Typography.Text>
      <Typography.Title level={3}>
        {t('Reference N-A')}
      </Typography.Title>
      <Typography.Text className="flex-col gap-6px">
        <span>1.Berry MD, Richard B. Fundamentals of Sleep Medicine</span>

        <span>2.PG Carvalho. Principles and Practice of Sleep Medicine，4 edition</span>

        <span>3.Patel, A. K., Reddy, V., & Araujo, J. F. (2020, April). Physiology, Sleep Stages. StatPearls Publishing.</span>

        <span>4.Taylor, P. (2020, May 30). Nap Time. Retrieved September 10, 2020, from https://www.pewsocialtrends.org/2009/07/29/nap-time/</span>

        <span>5.Hirshkowitz M, Whiton K, Albert SM, Alessi C, Bruni O, DonCarlos L, Hazen N, Herman J, Katz ES, Kheirandish-Gozal L, Neubauer DN, O'Donnell AE, Ohayon M, Peever J, Rawding R, Sachdeva RC, Setters B, Vitiello MV, Ware JC, Adams Hillard PJ. National Sleep Foundation's sleep time duration recommendations: methodology and results summary. Sleep health, 1(1), 40–43.</span>

        <span>6.Mantua, J., & Spencer, R. M. C. (2017). Exploring the nap paradox: are mid-day sleep bouts a friend or foe?. Sleep medicine, 37, 88–97.</span>

        <span>7.Ohayon M, Wickwire E M, Hirshkowitz M, et al. National Sleep Foundation's sleep quality recommendations: first report. Sleep Health. 2017 Feb;3(1):6-19.</span>

        <span>8.National Institute of Neurological Disorders and Stroke. (n.d.). Brain basics: Understanding sleep. Retrieved June 7, 2017.</span>

        <span>9.Ann Intern Med. Management of Chronic Insomnia Disorder in Adults: A Clinical Practice Guideline From the American College of Physicians. 2016 Jul 19;165(2):125-33.</span>
      </Typography.Text>
    </div>
  )
}

export default Page
