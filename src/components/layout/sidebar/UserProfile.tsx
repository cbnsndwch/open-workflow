import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth';

import { UserAvatar } from './UserAvatar';
import { UserProfileActions } from './UserProfileActions';

export function UserProfile() {
    const { isMobile, setOpenMobile } = useSidebar();
    const { user } = useAuth();

    const handleNavItemClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    if (!user) {
        return (
            <Button
                variant="ghost"
                className="w-full justify-start px-2"
                asChild
            >
                <Link to="/login">
                    <User className="mr-2 h-4 w-4" />
                    <span>Sign in</span>
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                    <div className="flex items-center gap-2 w-full">
                        <UserAvatar user={user} className="h-8 w-8" />
                        <div className="flex flex-col truncate text-left">
                            <span className="truncate text-xs font-medium">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <UserProfileActions handleNavItemClick={handleNavItemClick} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
