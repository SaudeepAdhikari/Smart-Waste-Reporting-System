/* eslint-disable */
const base = 'http://localhost:5000/api/v1';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

let token = null;
let reportId = null;

async function show(label, res) {
  const body = await res.clone().json().catch(() => null);
  console.log(`\n=== ${label} === [${res.status}]`);
  console.log(JSON.stringify(body, null, 2));
  return body;
}

async function main() {
  console.log('E2E test start');

  // 1. register
  let r = await fetch(`${base}/auth/register`, {
    method: 'POST',
    headers: headers(null),
    body: JSON.stringify({
      fullName: 'Citizen User',
      email: 'citizen@example.com',
      phone: '9801234567',
      password: 'Password123',
      confirmPassword: 'Password123',
    }),
  });
  let body = await show('REGISTER', r);
  token = body?.data?.token;
  if (!token) throw new Error('no token from register');

  // 2. login
  r = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: headers(null),
    body: JSON.stringify({ email: 'citizen@example.com', password: 'Password123' }),
  });
  body = await show('LOGIN', r);
  if (!body?.data?.token) throw new Error('login failed');
  token = body.data.token;
  const userId = body.data.user.id;

  // 3. me
  r = await fetch(`${base}/auth/me`, { headers: headers(token) });
  await show('ME', r);

  // 4. create report (valid)
  r = await fetch(`${base}/reports`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      wasteType: 'PLASTIC',
      description: 'Big pile of plastic bottles blocking the drain near the market.',
      estimatedQuantity: 5,
      quantityUnit: 'BAGS',
      severity: 'HIGH',
      address: 'Market Road, Kathmandu',
      location: { type: 'Point', coordinates: [85.3125, 27.7125] },
      imageCount: 2,
    }),
  });
  body = await show('CREATE REPORT', r);
  reportId = body?.data?.id;
  if (!reportId) throw new Error('no report id');

  // 5. create report with invalid location (should fail 400)
  r = await fetch(`${base}/reports`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      wasteType: 'PLASTIC',
      description: 'Bad location test',
      estimatedQuantity: 5,
      quantityUnit: 'BAGS',
      severity: 'HIGH',
      address: '',
      location: { type: 'Point', coordinates: [999, 85] },
    }),
  });
  await show('CREATE REPORT INVALID LOCATION (expect 400)', r);

  // 6. get my reports (paginated)
  r = await fetch(`${base}/reports/my`, { headers: headers(token) });
  body = await show('MY REPORTS', r);
  const found = body?.data?.items?.find((it) => it.id === reportId);
  console.log('Created report present in my list:', !!found);

  // 7. get report by id
  r = await fetch(`${base}/reports/${reportId}`, { headers: headers(token) });
  await show('REPORT BY ID', r);

  // 8. get summary
  r = await fetch(`${base}/reports/my/summary`, { headers: headers(token) });
  await show('MY SUMMARY', r);

  // 9. cancel report
  r = await fetch(`${base}/reports/${reportId}/cancel`, {
    method: 'PATCH',
    headers: headers(token),
  });
  await show('CANCEL REPORT', r);

  // 10. cancel again (should be 409)
  r = await fetch(`${base}/reports/${reportId}/cancel`, {
    method: 'PATCH',
    headers: headers(token),
  });
  await show('CANCEL AGAIN (expect 409)', r);

  // 11. unauthenticated
  r = await fetch(`${base}/reports/my`, { headers: headers(null) });
  await show('UNAUTHENTICATED (expect 401)', r);

  // 12. non-existent report (expect 404)
  r = await fetch(`${base}/reports/${'0'.repeat(24)}`, { headers: headers(token) });
  await show('NOT FOUND REPORT (expect 404)', r);

  console.log('\nE2E test complete.');
}

main().catch((e) => {
  console.error('E2E FAILED:', e.message);
  process.exit(1);
});
