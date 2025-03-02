'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/lib/store/user-store';

export default function ProfilePage() {
  const { getUser } = useUserStore();
  const userProfile = getUser();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="text-lg font-medium">
                {userProfile.name || 'Not set'}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Role
              </h3>
              <p className="text-lg font-medium">
                {userProfile.role || 'Not set'}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="text-lg font-medium">
                {userProfile.email || 'Not set'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
