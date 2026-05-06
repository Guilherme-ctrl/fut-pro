import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import {
  PrismaClient,
  UserRole,
  TrainingType,
  ExecutionType,
  PrescriptionStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo123', 10);

  const personal = await prisma.user.upsert({
    where: { email: 'personal@demo.com' },
    update: {
      passwordHash,
      name: 'Treinador Demo',
      role: UserRole.PERSONAL,
    },
    create: {
      email: 'personal@demo.com',
      passwordHash,
      name: 'Treinador Demo',
      role: UserRole.PERSONAL,
    },
  });

  const athleteUser = await prisma.user.upsert({
    where: { email: 'atleta@demo.com' },
    update: {
      passwordHash,
      name: 'João Atleta',
      role: UserRole.ATHLETE,
    },
    create: {
      email: 'atleta@demo.com',
      passwordHash,
      name: 'João Atleta',
      role: UserRole.ATHLETE,
    },
  });

  await prisma.athlete.upsert({
    where: {
      personalId_email: { personalId: personal.id, email: 'atleta@demo.com' },
    },
    update: { userId: athleteUser.id, name: 'João Atleta' },
    create: {
      personalId: personal.id,
      userId: athleteUser.id,
      name: 'João Atleta',
      email: 'atleta@demo.com',
      position: 'Meio-campo',
      objective: 'Pré-temporada',
    },
  });

  const exerciseDefs = [
    {
      name: 'Corrida intervalada em campo',
      description: 'Acelerar 30s / trote leve 60s',
      videoUrl: 'https://www.youtube.com/watch?v=example-interval',
      category: 'Condicionamento',
      executionType: ExecutionType.INTERVAL,
    },
    {
      name: 'Agachamento com salto',
      description: 'Explosão bilateral',
      videoUrl: 'https://www.youtube.com/watch?v=example-jump',
      category: 'Força',
      executionType: ExecutionType.SERIES_REPS,
    },
    {
      name: 'Prancha frontal',
      description: 'Manter alinhamento ombro-quadril',
      videoUrl: 'https://www.youtube.com/watch?v=example-plank',
      category: 'Core',
      executionType: ExecutionType.TIME_BASED,
    },
    {
      name: 'Tiros de 400m',
      description: 'Ritmo moderado contínuo',
      videoUrl: 'https://www.youtube.com/watch?v=example-run',
      category: 'Resistência',
      executionType: ExecutionType.DISTANCE_BASED,
    },
    {
      name: 'Circuito agilidade com cones',
      description: 'Slalom + parada seca',
      videoUrl: 'https://www.youtube.com/watch?v=example-agility',
      category: 'Agilidade',
      executionType: ExecutionType.CIRCUIT,
    },
    {
      name: 'Mobilidade de quadril em solo',
      description: 'Seguir instruções livres do vídeo',
      videoUrl: 'https://www.youtube.com/watch?v=example-mobility',
      category: 'Mobilidade',
      executionType: ExecutionType.FREE_INSTRUCTIONS,
    },
  ];

  const exercises: { id: string; executionType: ExecutionType }[] = [];
  for (let i = 0; i < exerciseDefs.length; i++) {
    const def = exerciseDefs[i];
    const seedId = `seed-ex-${i}`;
    const ex = await prisma.exercise.upsert({
      where: { id: seedId },
      update: {
        name: def.name,
        description: def.description,
        videoUrl: def.videoUrl,
        category: def.category,
        personalId: personal.id,
      },
      create: {
        id: seedId,
        personalId: personal.id,
        name: def.name,
        description: def.description,
        videoUrl: def.videoUrl,
        category: def.category,
      },
    });
    exercises.push({ id: ex.id, executionType: def.executionType });
  }

  const protocolName = 'Pré-Temporada Futebol — Exemplo';
  let protocol = await prisma.protocol.findFirst({
    where: { personalId: personal.id, name: protocolName },
  });

  if (!protocol) {
    protocol = await prisma.protocol.create({
      data: {
        personalId: personal.id,
        name: protocolName,
        description: 'Protocolo seed para validação do MVP',
        objective: 'Condicionamento e preparação física',
        trainingCount: 5,
        cycleCount: 3,
        isActive: true,
      },
    });

    const sessions: Array<{
      order: number;
      name: string;
      type: TrainingType;
      instructions: string;
      duration: number;
      exerciseIndexes: number[];
    }> = [
      {
        order: 1,
        name: 'Treino 1 — Intervalado',
        type: TrainingType.INTERVALADO,
        instructions: 'Respeitar descanso entre estímulos. Hidratar a cada bloco.',
        duration: 45,
        exerciseIndexes: [0, 2],
      },
      {
        order: 2,
        name: 'Treino 2 — HIIT',
        type: TrainingType.HIIT,
        instructions: 'Máxima qualidade de movimento; pare se sentir tontura.',
        duration: 40,
        exerciseIndexes: [1, 2],
      },
      {
        order: 3,
        name: 'Treino 3 — Corrida Resistida',
        type: TrainingType.CORRIDA_RESISTIDA,
        instructions: 'Ritmo constante conversável.',
        duration: 50,
        exerciseIndexes: [3],
      },
      {
        order: 4,
        name: 'Treino 4 — Agilidade',
        type: TrainingType.AGILIDADE,
        instructions: 'Atenção nas freadas e troca de direção.',
        duration: 35,
        exerciseIndexes: [4, 1],
      },
      {
        order: 5,
        name: 'Treino 5 — Mobilidade e Core',
        type: TrainingType.MOBILIDADE_CORE,
        instructions: 'Respiração controlada; amplitude sem dor.',
        duration: 30,
        exerciseIndexes: [5, 2],
      },
    ];

    for (const s of sessions) {
      const session = await prisma.trainingSession.create({
        data: {
          protocolId: protocol.id,
          order: s.order,
          name: s.name,
          type: s.type,
          generalInstructions: s.instructions,
          estimatedDurationMinutes: s.duration,
        },
      });

      let order = 1;
      for (const exIdx of s.exerciseIndexes) {
        const ex = exercises[exIdx];
        const base = {
          trainingSessionId: session.id,
          exerciseId: ex.id,
          order: order++,
          executionType: ex.executionType,
        };

        if (ex.executionType === ExecutionType.SERIES_REPS) {
          await prisma.trainingExercise.create({
            data: { ...base, sets: 4, repetitions: 8, restSeconds: 60 },
          });
        } else if (ex.executionType === ExecutionType.TIME_BASED) {
          await prisma.trainingExercise.create({
            data: { ...base, sets: 3, durationSeconds: 45, restSeconds: 30 },
          });
        } else if (ex.executionType === ExecutionType.DISTANCE_BASED) {
          await prisma.trainingExercise.create({
            data: {
              ...base,
              sets: 4,
              distanceMeters: 400,
              restSeconds: 120,
            },
          });
        } else if (ex.executionType === ExecutionType.CIRCUIT) {
          await prisma.trainingExercise.create({
            data: { ...base, rounds: 3, restSeconds: 90, notes: '3 voltas' },
          });
        } else if (ex.executionType === ExecutionType.INTERVAL) {
          await prisma.trainingExercise.create({
            data: {
              ...base,
              sets: 8,
              durationSeconds: 30,
              restSeconds: 60,
              notes: '30s forte / 60s leve',
            },
          });
        } else {
          await prisma.trainingExercise.create({
            data: {
              ...base,
              notes: 'Seguir vídeo; registrar sensação ao final',
            },
          });
        }
      }
    }
  }

  const athleteRecord = await prisma.athlete.findFirst({
    where: { personalId: personal.id, email: 'atleta@demo.com' },
  });
  const protocolRecord = await prisma.protocol.findFirst({
    where: { personalId: personal.id, name: protocolName },
  });
  if (athleteRecord && protocolRecord) {
    const hasActive = await prisma.prescription.findFirst({
      where: {
        athleteId: athleteRecord.id,
        status: PrescriptionStatus.ACTIVE,
      },
    });
    if (!hasActive) {
      await prisma.prescription.create({
        data: {
          athleteId: athleteRecord.id,
          protocolId: protocolRecord.id,
          startDate: new Date('2026-05-01T00:00:00.000Z'),
          weeklyFrequency: 4,
          currentCycle: 1,
          currentTrainingOrder: 1,
          status: PrescriptionStatus.ACTIVE,
        },
      });
    }
  }

  // eslint-disable-next-line no-console
  console.log('Seed concluído: personal@demo.com / demo123, atleta@demo.com / demo123');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
