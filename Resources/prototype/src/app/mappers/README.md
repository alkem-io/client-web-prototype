# Mappers

The prototype's equivalent of client-web's `src/main/crdPages/**/…DataMapper.ts`.

CRD components are purely presentational: data goes in as a plain TypeScript
type that **the component itself exports**. A mapper takes the prototype's mock
data and returns that exported type — it never re-derives the prop shape.

```ts
import type { SpaceGridCardData } from '@/crd/components/user/SpaceGridCard';
export function toSpaceGridCard(s: MockSpace): SpaceGridCardData { … }
```

Rules, matching the client:

- **Import the type from the CRD component.** If the component changes its
  shape, this file fails to compile — which is the point.
- **Never hand-write a prop object.** No `{ title, description, imageUrl }`
  scattered at call sites.
- Behaviour goes in as callbacks, and anything CRD delegates goes in through
  its `*Slot` props (`reactionsSlot`, `commentsSlot`, `settingsSlot`, …).
