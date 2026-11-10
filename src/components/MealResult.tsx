type Meal = { schoolName: string; menu: string; calories: string | null; nutrition: string | null }

type Props = { date: string; meal: Meal | null }

const formatDate = (date: string) => new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', weekday: 'short',
}).format(new Date(`${date}T00:00:00+09:00`))

const splitMenu = (menu: string) => menu.split('\n').map((line) => line.trim()).filter(Boolean)

export function MealResult({ date, meal }: Props) {
  if (!meal) {
    return <section className="result-card empty-state" aria-live="polite"><span aria-hidden="true">🍽️</span><h2>해당 날짜의 급식 정보가 없습니다</h2><p>급식이 없는 날이거나 아직 식단이 등록되지 않았을 수 있어요.</p></section>
  }

  return (
    <section className="result-card" aria-live="polite" aria-labelledby="meal-title">
      <div className="result-heading">
        <div><p className="date-label">{formatDate(date)}</p><h2 id="meal-title">선택한 날짜의 점심</h2></div>
        <span className="meal-chip">중식</span>
      </div>
      <div className="rule" />
      <ul className="menu-list" aria-label="점심 메뉴">
        {splitMenu(meal.menu).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ul>
      {meal.calories && <div className="calorie"><span aria-hidden="true">⚡</span><span>열량</span><strong className="tabular">{meal.calories}</strong></div>}
      <p className="allergy-note"><strong>알레르기 안내</strong> 메뉴명 뒤 숫자는 알레르기 유발 식품 번호입니다.</p>
    </section>
  )
}
