# 경영 에이전트

이음(작명 서비스)과 삼대집의 의사결정을 일관된 원칙과 숫자로 처리하기 위한 에이전트 3개와 공용 문서.

## 구성

| 파일 | 역할 |
|---|---|
| `.claude/agents/seo-ux-designer.md` | SEO·UX 디자인 담당. 검색 유입과 전환 기준으로 화면을 진단 |
| `.claude/agents/growth-marketer.md` | 마케팅 담당. 획득비용, 객단가, 잔존, 가격 |
| `.claude/agents/chief-executive.md` | 경영 총괄. 두 담당의 제안을 원칙으로 심사하고 결정 |
| `.claude/skills/board/SKILL.md` | 경영회의 진행 순서 (`/board`) |
| `biz/principles.md` | 경영 원칙 (P1~P13) |
| `biz/context/ieum.md`, `samdaejip.md` | 사업별 사실, 숫자, 하면 안 되는 것 |
| `biz/decisions.md` | 결정 로그 |
| `biz/experiments.md` | 실험 대장 |

## 쓰는 법

경영회의 (세 에이전트가 모두 참여):

```
/board 이음 출시 전 가격 19,000원이 적정한지 검토
```

한 담당에게만 묻기:

```
seo-ux-designer 에이전트로 이음 결제 화면 진단해줘
growth-marketer 에이전트로 삼대집 재방문율 올릴 방법 정리해줘
```

주간 점검:

```
/board 주간 점검
```

## 품질을 좌우하는 것

`biz/context/`의 `[미정]` 칸이 채워질수록 답이 구체적이 된다. 가장 먼저 채울 것:

1. 이음: 검수 건당 비용 (허용 CAC 상한이 여기서 정해진다)
2. 두 사업 모두: 분석 도구 설치 후 유입, 단계별 이탈, 전환, 재방문 수치
3. 삼대집: 수익 모델

## 다른 저장소로 옮길 때

`.claude/agents/`, `.claude/skills/board/`, `biz/` 세 폴더를 그대로 복사하면 된다.
