import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CompletedDraftsProvider } from './CompletedDraftsProvider'
import { useCompletedDrafts } from './completedDrafts.model'

function DraftHarness() {
  const drafts = useCompletedDrafts()
  const owner = drafts.getDraft(12)?.basicInfo?.owner ?? 'none'

  return (
    <>
      <p>Buffered owner: {owner}</p>
      <button
        type="button"
        onClick={() =>
          drafts.bufferBasicInfo(12, {
            resourceName: 'Resource',
            owner: 'Ada Lovelace',
            email: 'ada@example.com',
            description: 'Temporary edit',
            priority: 'high',
          })
        }
      >
        Buffer edit
      </button>
    </>
  )
}

describe('CompletedDraftsProvider', () => {
  it('loses buffered edits when the provider is remounted', async () => {
    const user = userEvent.setup()
    const firstRender = render(
      <CompletedDraftsProvider>
        <DraftHarness />
      </CompletedDraftsProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Buffer edit' }))
    expect(screen.getByText('Buffered owner: Ada Lovelace')).toBeVisible()

    firstRender.unmount()
    render(
      <CompletedDraftsProvider>
        <DraftHarness />
      </CompletedDraftsProvider>,
    )

    expect(screen.getByText('Buffered owner: none')).toBeVisible()
  })
})
