import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Assessment = Database['public']['Tables']['assessments']['Row'];

const OLD_EMOJIS = ['😔', '😩', '😫', '😖', '😣'];
const NEW_EMOJIS = ['😊', '💪', '🎯', '✨', '🚀'];

export function TransformationTimeline() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    async function fetchAssessments() {
      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user!.id);
      if (data) setAssessments(data);
    }
    fetchAssessments();
  }, [user]);

  const oldMe = assessments.find(a => a.assessment_type === 'old_me');
  const newMe = assessments.find(a => a.assessment_type === 'new_me');

  if (!oldMe || !newMe) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Transformation Timeline</h2>
      <div className="flex">
        <div className="flex-1 border-r-2 border-red-300 pr-4">
          <h3 className="font-medium text-red-600 mb-3">Old Me</h3>
          <div className="space-y-3">
            {[
              oldMe.limiting_beliefs,
              oldMe.bad_habits,
              oldMe.time_wasters,
              oldMe.energy_drainers,
              oldMe.growth_blockers,
            ].map((item, index) => (
              <div key={index} className="flex items-center text-red-500">
                <span className="mr-2">{OLD_EMOJIS[index]}</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 pl-4">
          <h3 className="font-medium text-green-600 mb-3">New Me</h3>
          <div className="space-y-3">
            {[
              newMe.new_beliefs,
              newMe.empowering_habits,
              newMe.time_investment,
              newMe.energy_gains,
              newMe.growth_areas,
            ].map((item, index) => (
              <div key={index} className="flex items-center text-green-500">
                <span className="mr-2">{NEW_EMOJIS[index]}</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
