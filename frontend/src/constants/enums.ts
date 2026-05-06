/** Valores alinhados ao Prisma / backend */

export const TRAINING_TYPES = [
  'INTERVALADO',
  'HIIT',
  'CORRIDA_RESISTIDA',
  'AGILIDADE',
  'MOBILIDADE_CORE',
  'HIIT_MUSCULAR',
  'VELOCIDADE',
  'OUTRO',
] as const;

export const TRAINING_TYPE_LABEL: Record<string, string> = {
  INTERVALADO: 'Intervalado',
  HIIT: 'HIIT',
  CORRIDA_RESISTIDA: 'Corrida resistida',
  AGILIDADE: 'Agilidade',
  MOBILIDADE_CORE: 'Mobilidade / Core',
  HIIT_MUSCULAR: 'HIIT muscular',
  VELOCIDADE: 'Velocidade',
  OUTRO: 'Outro',
};

export const EXECUTION_TYPES = [
  'SERIES_REPS',
  'TIME_BASED',
  'DISTANCE_BASED',
  'CIRCUIT',
  'INTERVAL',
  'FREE_INSTRUCTIONS',
] as const;

export const EXECUTION_TYPE_LABEL: Record<string, string> = {
  SERIES_REPS: 'Séries × reps',
  TIME_BASED: 'Por tempo',
  DISTANCE_BASED: 'Distância',
  CIRCUIT: 'Circuito',
  INTERVAL: 'Intervalado',
  FREE_INSTRUCTIONS: 'Instruções livres',
};
