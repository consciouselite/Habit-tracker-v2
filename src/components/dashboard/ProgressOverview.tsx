import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Assessment = Database['public']['Tables']['assessments']['Row'];

export function ProgressOverview() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('user_id', user!.id);

        if (error) throw error;
        setAssessments(data || []);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessments();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse h-48 bg-gray-200 rounded-lg"></div>;
  }

  const oldMe = assessments.find(a => a.assessment_type === 'old_me');
  const newMe = assessments.find(a => a.assessment_type === 'new_me');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Journey</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Where You Started</h3>
          {oldMe && (
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>Limiting Beliefs:</strong> {oldMe.limiting_beliefs}</p>
              <p><strong>Bad Habits:</strong> {oldMe.bad_habits}</p>
              <p><strong>Time Wasters:</strong> {oldMe.time_wasters}</p>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Where You're Going</h3>
          {newMe && (
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong>New Beliefs:</strong> {newMe.new_beliefs}</p>
              <p><strong>Empowering Habits:</strong> {newMe.empowering_habits}</p>
              <p><strong>Growth Areas:</strong> {newMe.growth_areas}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
