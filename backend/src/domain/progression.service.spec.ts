import { PrescriptionStatus } from '@prisma/client';
import { computeProgressionAfterCompletion } from './progression.service';

describe('computeProgressionAfterCompletion', () => {
  it('incrementa ordem dentro do mesmo ciclo', () => {
    const r = computeProgressionAfterCompletion(5, 3, 1, 1);
    expect(r.currentTrainingOrder).toBe(2);
    expect(r.currentCycle).toBe(1);
    expect(r.status).toBe(PrescriptionStatus.ACTIVE);
  });

  it('avança ciclo ao terminar último treino do ciclo', () => {
    const r = computeProgressionAfterCompletion(5, 3, 1, 5);
    expect(r.currentTrainingOrder).toBe(1);
    expect(r.currentCycle).toBe(2);
    expect(r.status).toBe(PrescriptionStatus.ACTIVE);
  });

  it('conclui prescrição ao terminar último treino do último ciclo', () => {
    const r = computeProgressionAfterCompletion(5, 3, 3, 5);
    expect(r.status).toBe(PrescriptionStatus.COMPLETED);
    expect(r.currentCycle).toBe(3);
    expect(r.currentTrainingOrder).toBe(5);
  });
});
