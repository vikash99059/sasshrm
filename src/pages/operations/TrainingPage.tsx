import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { TrainingCourse } from '../../types';
import { Card, CardHeader, CardTitle, Badge, Button, Avatar } from '../../components/ui';
import { GraduationCap, Clock, Star, Users, Plus, CheckCircle2, Play } from 'lucide-react';

export const TrainingPage: React.FC = () => {
  const [courses, setCourses] = useState<TrainingCourse[]>([]);

  useEffect(() => {
    const load = async () => {
      const list = await operationsService.getTrainingCourses();
      setCourses(list);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-dark-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learning Management System (LMS) & Training
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upskill employees, assign mandatory compliance modules, and award certifications.
          </p>
        </div>

        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} hoverEffect className="overflow-hidden p-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge variant="primary" size="sm" className="absolute top-3 right-3 shadow-md">
                  {course.category}
                </Badge>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {course.durationHours} Hours
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500" /> {course.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {course.completedCount}/{course.totalEnrolled}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Button variant="primary" size="sm" className="w-full text-xs" leftIcon={<Play className="h-3.5 w-3.5 fill-white" />}>
                Start Training Module
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
