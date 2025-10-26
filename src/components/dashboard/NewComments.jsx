import DashboardCard from './DashboardCard';
import { ChevronRight } from 'lucide-react';

const dummyComments = [
  { id: 1, name: 'Elon S.', text: 'Find my keynote attached in the...', project: 'Market research 2024', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 2, name: 'Dana R.', text: "I've added some new data. Let's...", project: 'Market research 2024', avatar: 'https://i.pravatar.cc/150?img=1' },
];

const dummyTags = [
  { id: 1, text: 'Research', color: 'bg-purple-100 text-purple-700' },
  { id: 2, text: 'Strategy', color: 'bg-green-100 text-green-700' },
  { id: 3, text: 'Operations', color: 'bg-yellow-100 text-yellow-700' },
];

export default function NewComments() {
  return (
    <DashboardCard title="New comments">
      <div className="space-y-4">
        {dummyComments.map(comment => (
          <a href="#" key={comment.id} className="flex items-start justify-between p-2 -m-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <div className="flex items-start gap-3">
              <img src={comment.avatar} alt={comment.name} className="w-9 h-9 rounded-full mt-1" />
              <div>
                <h5 className="font-semibold text-sm">{comment.name} <span className="text-gray-400 font-normal">in {comment.project}</span></h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{comment.text}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400 mt-1 flex-shrink-0" />
          </a>
        ))}
      </div>
      {/* Tags section from design */}
      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t dark:border-gray-800">
        {dummyTags.map(tag => (
          <a href="#" key={tag.id} className={`text-xs font-semibold px-3 py-1 rounded-lg ${tag.color} flex items-center justify-between`}>
            {tag.text} <ChevronRight size={14} className="ml-1" />
          </a>
        ))}
      </div>
    </DashboardCard>
  );
}