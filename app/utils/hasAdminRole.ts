export function hasAdminRole(token: string): boolean {
  try {
    const payloadBase64Url = token.split('.')[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(atob(payloadBase64));
    console.log(decodedPayload, 'decodedPayload');
    // Check if the scope contains 'ADMIN'
    return decodedPayload.scope?.split(' ').includes('ADMIN') ?? false;
  } catch (error) {
    console.error('Invalid JWT format or payload:', error);
    return false;
  }
}
