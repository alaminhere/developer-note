import { getCurrentUser } from '@/actions/auth';
import Link from 'next/link';
import Button from '@/components/ui/button';

const AuthButtons = async () => {
  const user = await getCurrentUser();
  return !user ? (
    <div className="mt-5 flex  justify-center items-center gap-3">
      <Link href={'/login'}>
        <Button loading={false} size="lg" variant="blue">
          Login to Account
        </Button>
      </Link>
      <Link href={'/register'}>
        <Button loading={false} size="lg" variant="pink">
          signup for free
        </Button>
      </Link>
    </div>
  ) : (
    <Link href={'/dashboard'}>
      <Button loading={false} size="lg" variant="green" className={'mt-5'}>
        go to dashboard
      </Button>
    </Link>
  );
};
export default AuthButtons;
