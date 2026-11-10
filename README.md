# 오늘의 운양초 급식 — 4차시 배포 실습

이 파일은 **모두의 AI 실험실**에서 생성한 React/Vite 웹앱을 GitHub + Netlify 수업용으로 정리한 버전입니다.

- 학교: 경기도 김포시 운양초등학교 (교육청 J10 / 학교 7771040)
- API: 나이스 교육정보 개방포털 **급식식단정보 API 한 개**
- 식사: 중식(2) / 날짜는 웹앱에서 선택
- 함수: `netlify/functions/meal.mjs`
- 환경변수 이름: `NEIS_API_KEY`

## 수강생 실습 순서

1. ZIP 압축을 풉니다. **ZIP 파일 하나만 GitHub에 올리지 않습니다.**
2. GitHub에서 새 저장소를 만든 다음, 압축을 푼 폴더 **안의 모든 프로젝트 파일**을 업로드하고 Commit합니다. `.gitignore`, `src`, `netlify`, `package.json` 등이 저장소 최상위에 있어야 합니다.
3. Netlify에서 **Add new project → Import an existing project → GitHub**를 선택하고 해당 저장소를 연결합니다.
4. Netlify 빌드 설정에서 Build command는 `npm run build`, Publish directory는 `dist`인지 확인합니다. Functions directory는 `netlify/functions`입니다.
5. **API 키 없이 먼저 배포**해서 웹앱 화면이 나타나는지 확인합니다. 이 단계에서는 급식 조회 시 `API 연결 전` 안내가 나타나는 것이 정상입니다.
6. [나이스 교육정보 개방포털](https://open.neis.go.kr/portal/mainPage.do)에서 개인별 API 인증키를 발급받습니다.
7. Netlify의 **Project configuration → Environment variables**에 아래와 같이 등록합니다.
   - Key: `NEIS_API_KEY`
   - Value: 본인 인증키 (앞뒤 공백 없이)
   - Scope: **Functions를 포함하는 범위**
8. 환경변수를 저장하고 Netlify에서 **Trigger deploy → Deploy project/site** 등으로 재배포합니다. 설정 변경 뒤에는 새 배포가 필요합니다.
9. 다음 경로를 브라우저에서 확인합니다. `https://나의사이트.netlify.app/.netlify/functions/meal?date=20261105`
10. 웹앱으로 돌아가 날짜를 선택하고 급식 조회 버튼을 누릅니다.

## 오류 확인

- 화면 자체가 안 열림: Netlify **Deploy log**에서 빌드 실패 확인
- 웹앱은 열리는데 `API 연결 전`: 환경변수 이름, Functions 범위, 재배포 여부 확인
- Functions 주소가 404: GitHub 저장소의 `netlify/functions/meal.mjs` 포함 여부와 Netlify Functions 배포 여부 확인
- Functions 주소에 502: 키 유효성, 일시적 나이스 API 오류 또는 응답 형식 확인 → Netlify Functions 로그
- `meal: null`: 해당 날짜에 급식 데이터가 등록되지 않았을 수 있음 (주말·방학 등)

**보안:** API 인증키를 GitHub 소스, 웹앱 화면, 강의 자료에 붙여넣지 마세요. 수강생마다 본인 키를 Netlify 환경변수로 등록합니다.

## 참고

- 로컬 `npm run dev`만으로는 Netlify Functions가 자동 실행되지 않습니다. API 조회는 배포된 Netlify 주소에서 시험하세요.
- 원본에 있던 사용하지 않는 Python `backend/`, `data/`, `requirements.txt`, 이중 ZIP 파일과 빌드 산출물 `dist/`는 수업 배포본에서 제외했습니다.
- 글꼴 파일은 포함하지 않았으며 시스템 기본 글꼴을 사용합니다.
