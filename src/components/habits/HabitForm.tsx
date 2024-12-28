import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { TextField } from '../forms/TextField';
import { Select } from '../forms/Select';
import { TextArea } from '../forms/TextArea';
import { habitSchema } from '../../lib/validations/onboarding';
import type { Database } from '../../lib/database.types';

type HabitInput = {
  name: string;
  category: Database['public']['Tables']['habits']['Row']['category'];
  description: string;
};

type HabitFormProps = {
  onSubmit: (data: HabitInput) => Promise<void>;
  onClose: () => void;
  initialData?: HabitInput;
};

const CATEGORIES = [
  { label: 'Health', value: 'Health' },
  { label: 'Productivity', value: 'Productivity' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Relationships', value: 'Relationships' },
  { label: 'Learning', value: 'Learning' },
  { label: 'Spiritual/Mental', value: 'Spiritual/Mental' },
];

export function HabitForm({ onSubmit, onClose, initialData }: HabitFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: initialData,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label="Habit Name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Select
            label="Category"
            options={CATEGORIES}
            {...register('category')}
            error={errors.category?.message}
          />

          <TextArea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
