export const ROUTES = {
  home: '/',
  auth: '/auth',
  profile: '/profile',
  board: (ownerUsername: string, slug: string) => `/${ownerUsername}/${slug}`,
}
