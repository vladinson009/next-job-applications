import ProviderBtn from '@/components/auth-form/provider-btn';
import { CardAction } from '../ui/card';
import { Providers } from '@/types/Providers';

type AuthProviders = {
  provider: Providers;
  imgSrc: `/providerIcon/${Providers}.svg`;
  fallback: Capitalize<Providers>;
};

const providers: AuthProviders[] = [
  {
    provider: 'google',
    imgSrc: '/providerIcon/google.svg',
    fallback: 'Google',
  },
  {
    provider: 'github',
    imgSrc: '/providerIcon/github.svg',
    fallback: 'Github',
  },
];

export default function AuthProvidersCardHeader() {
  return (
    <CardAction className="flex gap-1">
      {providers.map(({ provider, imgSrc, fallback }) => (
        <ProviderBtn key={provider} provider={provider} imgSrc={imgSrc}>
          {fallback}
        </ProviderBtn>
      ))}
    </CardAction>
  );
}
