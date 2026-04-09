import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconBrandGithub } from'@tabler/icons-react';

export default function LoginPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-xl'>Welcome back!</CardTitle>
            <CardDescription>Login with your Email or Github account</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Button className='w-full' variant='outline'>
            <IconBrandGithub className='size-4' />
            Sign in with Github
          </Button>

          <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:items-center after:border-t after:border-border'>
            <span className='relative z-10 bg-card px-2 text-muted-foreground'>OR</span>
          </div>

          <div className='grid gap-3'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='you@example.com' />
            </div>
          </div>
          <Button className='w-full mt-4'>Continue with email</Button>
        </CardContent>
    </Card>
  )
}
