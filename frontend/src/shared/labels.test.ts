import { describe, expect, it } from 'vitest';
import { displayStatus, roleLabels, competencyLabels } from './labels';

describe('displayStatus', () => {
  it('resolves a submission status', () => {
    expect(displayStatus('ACCEPTED')).toBe('Принято');
  });

  it('resolves a case status without colliding with submission statuses', () => {
    expect(displayStatus('MODERATION')).toBe('На модерации');
  });

  it('resolves a track status', () => {
    expect(displayStatus('ARCHIVED')).toBe('В архиве');
  });

  it('falls back to the raw value for an unknown status', () => {
    expect(displayStatus('SOME_UNKNOWN_STATUS')).toBe('SOME_UNKNOWN_STATUS');
  });
});

describe('label maps', () => {
  it('has a Russian label for every role', () => {
    expect(Object.values(roleLabels)).toHaveLength(4);
    expect(roleLabels.STUDENT).toBe('Студент');
  });

  it('has a label for every competency', () => {
    expect(Object.keys(competencyLabels)).toHaveLength(5);
  });
});
