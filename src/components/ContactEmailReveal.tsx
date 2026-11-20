'use client';

import React, { useState } from 'react';

export default function ContactEmailReveal() {
  const [revealed, setRevealed] = useState(false);
  const address = ['contact', 'safouane-affane.fr'].join('@');
  if (revealed) {
    return <a href={`mailto:${address}`} className="text-primary hover:underline focus-visible:underline">{address}</a>;
  }
  return <button type="button" onClick={() => setRevealed(true)} className="text-primary hover:underline focus-visible:underline">Afficher l’adresse e-mail</button>;
}
