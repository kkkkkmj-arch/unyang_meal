export type Meal = { schoolName: string; menu: string; calories: string | null; nutrition: string | null }
export type MealResponse = { date: string; meal: Meal | null; message?: string }

export async function getMeal(date: string): Promise<MealResponse> {
  const dateKey = date.replaceAll('-', '')
  const response = await fetch(`${import.meta.env.BASE_URL}.netlify/functions/meal?date=${dateKey}`)
  let data: MealResponse

  try {
    data = await response.json() as MealResponse
  } catch {
    throw new Error('급식 조회 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
  }

  if (!response.ok) throw new Error(data.message || '급식 정보를 불러오지 못했습니다.')
  return data
}
