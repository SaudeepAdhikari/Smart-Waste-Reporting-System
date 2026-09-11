import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create Account"
      description="Create your citizen account to report waste and help improve local waste collection."
    >
      <RegisterForm />
    </AuthCard>
  );
}
