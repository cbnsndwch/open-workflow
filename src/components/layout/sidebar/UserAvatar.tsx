
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/contexts/auth/types';

interface UserAvatarProps {
  user: User;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  // Generate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={className}>
      <AvatarFallback>{user.name ? getInitials(user.name) : 'U'}</AvatarFallback>
    </Avatar>
  );
}
