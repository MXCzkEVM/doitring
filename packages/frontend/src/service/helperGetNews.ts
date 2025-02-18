import { i18n } from '@/plugins'

const GITHUB_PRODUCT_URL = 'https://raw.githubusercontent.com/MXCzkEVM/doitring-news/main'

export interface New {
  title: string
  content: string
  excerpt: string
}

export async function helperGetNews(lang = 'en') {
  const response = await fetch(`${GITHUB_PRODUCT_URL}/${process.env.NEXT_PUBLIC_DEFAULT_CHAIN}.json`)
  const data = await response.json() as Record<string, New[]>
  lang = i18n.language || lang
  lang = lang.replace('-CN', '-hans')

  return data[lang] || data.en
}
