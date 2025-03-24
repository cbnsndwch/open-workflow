
import React from 'react';

export const DemoAccounts = () => {
  return (
    <div className="rounded-md bg-primary/5 p-3 text-xs space-y-2 w-full">
      <p className="text-center font-medium text-foreground/80">Demo accounts:</p>
      <div className="grid grid-cols-2 gap-x-2 text-muted-foreground">
        <div className="flex flex-col space-y-1">
          <span>🧑‍💼 Admin:</span>
          <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">admin</code>
          <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">password</code>
        </div>
        <div className="flex flex-col space-y-1">
          <span>👤 User:</span>
          <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">user@example.com</code>
          <code className="rounded bg-muted/30 px-1 py-0.5 text-[10px]">password</code>
        </div>
      </div>
    </div>
  );
};
