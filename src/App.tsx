import { FormEvent, useEffect, useState } from 'react'
import { MealResult } from './components/MealResult'
import { getMeal, Meal, MealResponse } from './lib/mealApi'
type ResponseData = MealResponse
const getKoreanDate = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  })
  return formatter.format(new Date())
}
export default function App() {
  const [date, setDate] = useState(getKoreanDate)
  const [result, setResult] = useState<ResponseData | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const loadMeal = async (chosenDate = date) => {
    setStatus('loading')
    setError('')
    setResult(null)
    try {
      const data = await getMeal(chosenDate)
      setResult(data)
      setStatus('idle')
    } catch (cause) {
      setStatus('error')
      setError(cause instanceof Error ? cause.message : '급식 정보를 불러오지 못했습니다.')
    }
  }
  useEffect(() => { loadMeal() }, [])
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!date) {
      setStatus('error')
      setError('급식 날짜를 선택해 주세요.')
      return
    }
    loadMeal()
  }
  return (
    <main className="page-shell">
      <section className="app-panel glass" aria-labelledby="app-title">
        <header className="hero">
          <span className="school-mark" aria-hidden="true">🍚</span>
          <div>
            <p className="eyebrow">김포시 운양초등학교</p>
            <h1 id="app-title">오늘의 운양초 급식</h1>
            <p className="subtitle">선택한 날짜의 점심 식단을 확인하세요.</p>
          </div>
        </header>
        <form className="meal-form" onSubmit={handleSubmit}>
          <label htmlFor="meal-date">급식 날짜</label>
          <div className="controls">
            <input id="meal-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
            <button className="press" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? '조회 중…' : '급식 조회'}
            </button>
          </div>
        </form>
        {status === 'loading' && <div className="status-card" role="status"><span className="spinner" />급식 정보를 확인하고 있어요.</div>}
        {status === 'error' && <div className="status-card error" role="alert"><strong>조회에 실패했어요</strong><span>{error}</span><button type="button" onClick={() => loadMeal()}>다시 시도</button></div>}
        {status === 'idle' && result && <MealResult date={date} meal={result.meal} />}
        <footer className="app-footer">급식 정보는 나이스 교육정보 개방 포털의 공개 데이터를 기준으로 표시됩니다.</footer>
      </section>
    </main>
  )
}
