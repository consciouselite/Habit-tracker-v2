import { Routes, Route, Navigate } from 'react-router-dom';
import Survey from './Survey';
import Goals from './Goals';
import Habits from './Habits';
import OldMe from './OldMe';
import NewMe from './NewMe';

export default function Onboarding() {
  return (
    <Routes>
      <Route path="survey" element={<Survey />} />
      <Route path="goals" element={<Goals />} />
      <Route path="habits" element={<Habits />} />
      <Route path="old-me" element={<OldMe />} />
      <Route path="new-me" element={<NewMe />} />
      <Route path="*" element={<Navigate to="survey" replace />} />
    </Routes>
  );
}
