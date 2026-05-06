import { Navigate, Route, Routes } from 'react-router-dom';
import { AthleteDetail } from './pages/AthleteDetail';
import { AthleteHistory } from './pages/AthleteHistory';
import { AthleteHome } from './pages/AthleteHome';
import { AthleteLogin } from './pages/AthleteLogin';
import { AthleteNew } from './pages/AthleteNew';
import { AthletesList } from './pages/AthletesList';
import { Dashboard } from './pages/Dashboard';
import { ExerciseEdit } from './pages/ExerciseEdit';
import { ExerciseNew } from './pages/ExerciseNew';
import { ExercisesList } from './pages/ExercisesList';
import { PersonalLogin } from './pages/PersonalLogin';
import { PrescriptionNew } from './pages/PrescriptionNew';
import { ProtocolEdit } from './pages/ProtocolEdit';
import { ProtocolNew } from './pages/ProtocolNew';
import { ProtocolsList } from './pages/ProtocolsList';
import { TrainingExecution } from './pages/TrainingExecution';
import { Welcome } from './pages/Welcome';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<PersonalLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/athletes" element={<AthletesList />} />
      <Route path="/athletes/new" element={<AthleteNew />} />
      <Route path="/athletes/:id" element={<AthleteDetail />} />
      <Route path="/protocols" element={<ProtocolsList />} />
      <Route path="/protocols/new" element={<ProtocolNew />} />
      <Route path="/protocols/:id/edit" element={<ProtocolEdit />} />
      <Route path="/exercises" element={<ExercisesList />} />
      <Route path="/exercises/new" element={<ExerciseNew />} />
      <Route path="/exercises/:id/edit" element={<ExerciseEdit />} />
      <Route path="/prescriptions/new" element={<PrescriptionNew />} />
      <Route path="/athlete/login" element={<AthleteLogin />} />
      <Route path="/athlete/home" element={<AthleteHome />} />
      <Route path="/athlete/history" element={<AthleteHistory />} />
      <Route
        path="/athlete/training/execution/:id"
        element={<TrainingExecution />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
