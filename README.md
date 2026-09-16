# BNi&C Whitepaper Deck

16:9 가로 슬라이드 덱. 한/영 동시 수록, 18장.

- 라이브: https://bninc.connectx402.io (= https://bnic-whitepaper.vercel.app)
  - **이전 예정: `roadmap.bnaif.com`** – Cloudflare `bnaif.com` 존에 `roadmap` CNAME → `cname.vercel-dns.com`,
    Vercel Domains 에 도메인 추가. 소스에 자기 도메인을 참조하는 곳이 없으므로 코드 수정은 필요 없다.
- Vercel 프로젝트: `bnic-whitepaper` / 팀 `wellbianlabs` (`prj_9VvPbpzboz9t1a5NBT4nLYXW82FB`)

## 구성

```
index.html          18개 <section class="slide"> + 상/하단 컨트롤
assets/deck.css     디자인 토큰, 슬라이드 레이아웃, 인쇄(PDF) 규칙
assets/deck.js      스케일 맞춤, 좌우 이동, 언어/테마 전환
_archive/           개편 전 세로 스크롤 판본 (2026-08-25)
```

## 로컬 미리보기

```bash
python -m http.server 3505 --directory D:/Program/bnic-whitepaper
```

`D:\Program\.claude\launch.json` 에 `bnic-whitepaper` 항목으로 등록돼 있다.

## 슬라이드 구성

| # | 내용 |
|---|---|
| 01 | 표지 |
| 02 | 목차 |
| 03 | 01 비전 및 미션 |
| 04-05 | 02 하드웨어 (컴퓨트 / 인프라·플랫폼) |
| 06-07 | 03 파트너십 (기술·금융 / 미디어·데이터센터) |
| 08 | 04 마스터 로드맵 개요 |
| 09-13 | 04 Phase 1a·1b·2·3·4 |
| 14 | **05 국내 로드맵 (8단계)** |
| 15-16 | 06 사이드 로드맵 A·B / C |
| 17 | 07 NASDAQ 여정 |
| 18 | 맺음 |

## 조작

- 좌우 방향키 / Space / PageUp·PageDown / Home·End
- 화면 하단 ‹ › 버튼(46px), 상단 섹션 점프
- 터치 스와이프, Shift+휠
- `#14` 같은 해시로 특정 장 바로 열기

## 인쇄 / PDF

하단 바 오른쪽 **인쇄 · PDF** 버튼 또는 Ctrl+P. 18장이 각각 1280x720 한 페이지로 떨어진다.

**바탕은 무조건 흰색, 잉크 최적화.**

- 화면 테마(라이트/다크/시스템)와 **무관하게 항상 흰 종이**다. `@media print` 에서 토큰을
  `!important` 로 재지정한다. **다크 슬라이드(표지·목차·NASDAQ·맺음)도 흰 바탕**으로 뒤집힌다.
- 넓은 면을 채우던 요소는 전부 윤곽선/헤어라인으로 대체했다:
  다크 슬라이드 그라데이션 → 흰색 / 초록 채움 Key Milestone 알약 → 흰 바탕 + 초록 테두리 /
  tint 칩(`.tag`, `.kind`)·노트(`.kr-note`, `.strategy`)·표 머리글 → 흰 바탕 + 테두리 /
  그라데이션 막대(`.bar`, `.step-bar`) → 2px 회색 선.
- 초록 강조는 남기되 **`#76B900` → `#3F6A00` 으로 어둡게** 한다. 원래 값은 흰 바탕에서 읽히지 않는다.
- 남은 색은 점·화살표·헤어라인 같은 작은 마크뿐이고 이들은 `background` 로 그려지므로
  `print-color-adjust:exact` 를 유지한다. 덕분에 **"배경 그래픽" 체크를 켜지 않아도** 제대로 나온다.
- 용지는 `@page{size:1280px 720px}` 가 지정한다. 여백은 "없음"이면 가장 깔끔하다.
- 인쇄 규칙은 `.frame` 의 `position:absolute` 와 `transform` 을 되돌려야 한다.
  화면 레이아웃을 바꾸면 `@media print` 블록의 리셋도 같이 확인할 것.
- 검증 방법: 스타일시트의 `@media print` 블록을 꺼내 미디어 쿼리 없는 `<style>` 로 주입하면
  화면에서 인쇄 결과를 그대로 볼 수 있다. 문서 높이가 `18 × 720 = 12960px` 이면 페이지 분할이 정확한 것.

## 배포

GitHub: https://github.com/wellbianlabs/bnic-whitepaper (기본 브랜치 `main`)

**Vercel 프로젝트에 Git 이 연결돼 있으면** `git push origin main` 으로 배포된다. 그게 정상 경로다.

연결이 아직 안 돼 있다면: Vercel → `bnic-whitepaper` → Settings → Git → Connect Git Repository
→ `wellbianlabs/bnic-whitepaper` → Production Branch `main`.

### 폴백: MCP 인라인 배포

Git 이 연결되기 전에는 Vercel MCP `deploy_to_vercel` 로 파일 내용을 인라인 전달하는 수밖에 없었다.
(이 PC에 Vercel CLI 도 API 토큰도 없다.) 이 경로를 쓸 일이 생기면:

- `name: "bnic-whitepaper"`, `target: "production"`, `teamId: "team_1CxBKfKNMGIn7MdOC1aRWAg0"`
- **세 파일(`index.html`, `assets/deck.css`, `assets/deck.js`)을 한 번의 호출에 모두 담을 것.**
  Vercel 배포는 전체 스냅샷이라, 일부만 보내면 나머지가 사라진다. 실제로 이걸로 두 번 깨뜨렸다.

## 공유 카드 (OG)

- 이미지: `assets/img/og-cover.jpg` (1200x630, 약 45KB). 생성기는 `scripts/make-og.py`.
  덱 표지의 디자인 언어(딥 그린블랙 + 초록 글로우 + Pretendard)를 그대로 쓴다.
  **헤드라인이나 마일스톤 문구를 바꾸면 스크립트를 다시 돌릴 것**: `python scripts/make-og.py`
  Pretendard OTF 는 `.fonts/` 에 자동으로 받아둔다(커밋하지 않는다).
- 메타는 `index.html` `<head>` 에 있고 **절대 URL 4곳 + canonical** 이 `https://roadmap.bnaif.com` 기준이다.
  도메인을 또 옮기면 이 5곳을 같이 고칠 것.
- **속성값의 `&` 는 반드시 `&amp;` 로 이스케이프한다**(`BNi&amp;C`). HTML5 파서는 봐주지만
  크롤러 파서는 `&C` 를 개체 참조로 오독할 수 있다.
- **카카오톡은 OG 를 강하게 캐시한다.** 내용을 고친 뒤에는
  https://developers.kakao.com/tool/debugger/sharing 에서 캐시 초기화를 해야 새 카드가 뜬다.
- og:image 는 절대 URL이라 **해당 도메인이 살아 있어야** 미리보기가 뜬다.

## 편집 시 주의

- 슬라이드 내용 영역은 **1280x720 에서 세로 668px**(= 720 - 하단 패딩 52)이 한계다.
  넘으면 잘린다. 한 장에 담기지 않으면 `(1/2)` 처럼 장을 나눌 것.
- 한국어보다 **영어 본문이 길어지는 경우**가 많다. 양쪽 언어 모두 확인할 것.
- `data-title-ko` / `data-title-en` 은 하단 바에 뜨는 장 제목이다. 새 장을 넣으면 같이 채울 것.
- 장을 추가·삭제하면 **상단 점프 버튼의 `data-go`, 목차 슬라이드의 `data-goto`와 `p.NN`**
  (모두 0-베이스 인덱스 / 1-베이스 페이지 번호)을 같이 고칠 것.
- 표기는 em dash 대신 하이픈(-)을 쓴다.
- **바 높이는 `deck.css` 한 곳에만 있다.** `.stage` 가 `top:44px; bottom:72px` 로 상·하단 바 사이를 차지하고,
  `deck.js` 의 `fit()` 은 `stage.clientWidth/clientHeight` 를 읽는다. 바 높이를 바꾸면 `.stage` 의 top/bottom만 고치면 된다.
- **프레임 중앙 정렬에 grid/flex 의 `place-items:center` 를 쓰지 말 것.** 1280px 짜리 항목이 더 좁은 컨테이너에
  놓이면 시작 모서리로 clamp 되어 오른쪽이 잘린다. 지금은 `left:50%/top:50%` + `scale() translate(-50%,-50%)` 방식이다
  (순서 중요 - `translate` 가 먼저 오면 축소돼도 이동량이 그대로라 어긋난다).
