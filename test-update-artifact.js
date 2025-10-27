// Test UPDATE artifact để xem lỗi gì
const API_BASE = 'https://museum-system-api-160202770359.asia-southeast1.run.app';

async function testUpdateArtifact() {
  try {
    console.log('Testing UPDATE artifact...');
    
    // Login first
    const loginResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@museum1.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    
    // Test UPDATE artifact với ID có sẵn
    const artifactId = 'e634f55e-f4aa-470b-96d2-9ad8c4e8bc16';
    console.log('\nTesting PATCH /api/v1/artifacts/' + artifactId + '...');
    const updateResponse = await fetch(`${API_BASE}/api/v1/artifacts/${artifactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Artifact Updated',
        description: 'Updated Description',
        periodTime: 'Modern',
        isOriginal: true,
        weight: 15.0,
        height: 25.0,
        width: 20.0,
        length: 30.0
      })
    });
    
    console.log('Update Status:', updateResponse.status);
    const updateData = await updateResponse.json();
    console.log('Update Response:', JSON.stringify(updateData, null, 2));
    
    if (updateResponse.ok) {
      console.log('✅ UPDATE artifact successful!');
    } else {
      console.log('❌ UPDATE failed:', updateData);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testUpdateArtifact();
