import { Injectable } from '@nestjs/common';
import { PrescriptionStatus } from '@prisma/client';

export type ProgressionResult = {
  currentCycle: number;
  currentTrainingOrder: number;
  status: PrescriptionStatus;
};

/** Avança após concluir o treino da ordem `currentTrainingOrder` (1-based). */
export function computeProgressionAfterCompletion(
  trainingCount: number,
  cycleCount: number,
  currentCycle: number,
  currentTrainingOrder: number,
): ProgressionResult {
  let nextOrder = currentTrainingOrder + 1;
  let nextCycle = currentCycle;

  if (nextOrder > trainingCount) {
    nextOrder = 1;
    nextCycle = currentCycle + 1;
  }

  if (nextCycle > cycleCount) {
    return {
      status: PrescriptionStatus.COMPLETED,
      currentCycle: cycleCount,
      currentTrainingOrder: trainingCount,
    };
  }

  return {
    status: PrescriptionStatus.ACTIVE,
    currentCycle: nextCycle,
    currentTrainingOrder: nextOrder,
  };
}

@Injectable()
export class ProgressionService {
  computeAfterCompletion(
    trainingCount: number,
    cycleCount: number,
    currentCycle: number,
    currentTrainingOrder: number,
  ): ProgressionResult {
    return computeProgressionAfterCompletion(
      trainingCount,
      cycleCount,
      currentCycle,
      currentTrainingOrder,
    );
  }
}
