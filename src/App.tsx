/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { IntroQuestion } from './components/IntroQuestion';
import { ValentineExperience } from './components/ValentineExperience';

export default function App() {
  const [hasAccepted, setHasAccepted] = useState(false);

  return (
    <main id="valentine-app-root" className="w-full min-h-screen bg-[#0d0408]">
      {!hasAccepted ? (
        <IntroQuestion onAccept={() => setHasAccepted(true)} />
      ) : (
        <ValentineExperience />
      )}
    </main>
  );
}
