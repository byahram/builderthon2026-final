```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── CategoryCard.tsx
│   ├── CelebrationOverlay.tsx
│   └── StepProgress.tsx
├── constants/           # 변하지 않는 데이터 (카테고리 리스트 등)
│   └── categories.ts
├── types/               # TypeScript 타입 정의
│   └── index.ts
├── App.tsx              # 메인 로직 (기존 OneThing.tsx의 역할)
├── main.tsx             # 진입점
└── index.css            # Tailwind 설정 및 글로벌 스타일
```