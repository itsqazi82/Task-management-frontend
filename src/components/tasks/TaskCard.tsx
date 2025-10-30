import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete,
  onStatusChange 
}) => {
  const getStatusVariant = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      case 'in-progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
        {onDelete && (
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
