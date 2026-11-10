// 운양초등학교 급식 조회: Netlify Functions (최신 Request → Response 방식)
// 실제 NEIS 인증키는 Netlify 환경변수 NEIS_API_KEY에만 보관합니다.
const NEIS_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo'
const OFFICE_CODE = 'J10' // 경기도교육청
const SCHOOL_CODE = '7771040' // 김포 운양초등학교
const MEAL_CODE = '2' // 중식

const json = (payload, status = 200) => Response.json(payload, {
  status,
  headers: { 'Cache-Control': 'no-store' },
})

const cleanMenu = (value = '') => value
  .replace(/<br\s*\/?\s*>/gi, '\n')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\s+$/gm, '')
  .trim()

export default async (request) => {
  if (request.method !== 'GET') {
    return json({ message: 'GET 요청만 지원합니다.' }, 405)
  }

  const date = new URL(request.url).searchParams.get('date')
  if (!/^\d{8}$/.test(date || '')) {
    return json({ message: '조회 날짜는 YYYYMMDD 형식으로 입력하세요.' }, 400)
  }

  const key = process.env.NEIS_API_KEY
  if (!key) {
    return json({ message: 'API 연결 전입니다. Netlify에서 NEIS_API_KEY를 등록하고 다시 배포하세요.' }, 500)
  }

  const params = new URLSearchParams({
    KEY: key,
    Type: 'json',
    pIndex: '1',
    pSize: '5',
    ATPT_OFCDC_SC_CODE: OFFICE_CODE,
    SD_SCHUL_CODE: SCHOOL_CODE,
    MMEAL_SC_CODE: MEAL_CODE,
    MLSV_YMD: date,
  })

  try {
    const response = await fetch(`${NEIS_URL}?${params}`, {
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) {
      return json({ message: '나이스 급식 API 요청이 실패했습니다.' }, 502)
    }

    const data = await response.json()
    if (data.RESULT?.CODE === 'INFO-200') {
      return json({ date, meal: null, message: '해당 날짜의 급식 정보가 없습니다.' })
    }
    if (data.RESULT?.CODE && data.RESULT.CODE !== 'INFO-000') {
      return json({ message: '나이스 API 오류가 발생했습니다. 인증키와 요청 조건을 확인하세요.' }, 502)
    }

    const meal = data.mealServiceDietInfo?.[1]?.row?.[0]
    if (!meal) {
      return json({ message: '급식 API의 응답 형식을 확인할 수 없습니다.' }, 502)
    }

    return json({
      date,
      meal: {
        schoolName: meal.SCHUL_NM || '운양초등학교',
        menu: cleanMenu(meal.DDISH_NM),
        calories: meal.CAL_INFO?.trim() || null,
        nutrition: meal.NTR_INFO?.trim() || null,
      },
    })
  } catch (error) {
    console.error('[meal] API 호출 오류:', error?.message || String(error))
    return json({ message: '급식 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' }, 502)
  }
}
