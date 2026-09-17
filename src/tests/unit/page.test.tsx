import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import Home from '../../app/page'

test('renders the getting started heading', () => {
  render(<Home />)

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'To get started, edit the page.tsx file.',
  )
})
