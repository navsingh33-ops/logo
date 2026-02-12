import requests
import sys
from datetime import datetime
import json

class LeadCaptureAPITester:
    def __init__(self, base_url="https://logo-builder-21.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.test_results.append({
                'name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_preview': response.text[:200] if not success else "Success"
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                'name': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'ERROR',
                'success': False,
                'response_preview': str(e)
            })
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "api/",
            200
        )
        return success

    def test_create_lead(self, name, email, phone, suburb, message=""):
        """Test creating a lead"""
        lead_data = {
            "name": name,
            "email": email,
            "phone": phone,
            "suburb": suburb,
            "message": message
        }
        
        success, response = self.run_test(
            "Create Lead",
            "POST",
            "api/leads",
            200,  # Based on the backend code, it should return 200, not 201
            data=lead_data
        )
        return response.get('id') if success else None, response

    def test_get_leads(self):
        """Test retrieving all leads"""
        success, response = self.run_test(
            "Get All Leads",
            "GET",
            "api/leads",
            200
        )
        return success, response

    def test_create_lead_missing_fields(self):
        """Test creating a lead with missing required fields"""
        incomplete_data = {
            "name": "Test User",
            "email": "test@example.com"
            # Missing phone and suburb
        }
        
        success, response = self.run_test(
            "Create Lead - Missing Fields",
            "POST",
            "api/leads",
            422,  # Should return validation error
            data=incomplete_data
        )
        return success

    def test_create_lead_invalid_email(self):
        """Test creating a lead with invalid email"""
        invalid_data = {
            "name": "Test User",
            "email": "invalid-email",
            "phone": "0412345678",
            "suburb": "Sydney"
        }
        
        success, response = self.run_test(
            "Create Lead - Invalid Email",
            "POST",
            "api/leads",
            422,  # Should return validation error
            data=invalid_data
        )
        return success

def main():
    print("🚀 Starting FindMeAgent API Tests...")
    print("=" * 50)
    
    # Setup
    tester = LeadCaptureAPITester()
    timestamp = datetime.now().strftime('%H%M%S')
    
    # Test 1: API Root
    print("\n📋 Testing API Connectivity...")
    if not tester.test_api_root():
        print("❌ API root failed, but continuing with other tests...")

    # Test 2: Create a valid lead
    print("\n📋 Testing Lead Creation...")
    test_lead_data = {
        'name': f'Test User {timestamp}',
        'email': f'test{timestamp}@example.com',
        'phone': '0412 345 678',
        'suburb': 'Sydney',
        'message': 'Buying'
    }
    
    lead_id, lead_response = tester.test_create_lead(**test_lead_data)
    if not lead_id:
        print("❌ Lead creation failed, stopping dependent tests")
    else:
        print(f"✅ Lead created with ID: {lead_id}")

    # Test 3: Get all leads
    print("\n📋 Testing Lead Retrieval...")
    get_success, leads_data = tester.test_get_leads()
    if get_success:
        print(f"✅ Retrieved {len(leads_data)} leads")
        if leads_data and len(leads_data) > 0:
            print(f"   Latest lead: {leads_data[-1].get('name', 'Unknown')} - {leads_data[-1].get('suburb', 'Unknown')}")

    # Test 4: Validation tests
    print("\n📋 Testing Form Validation...")
    tester.test_create_lead_missing_fields()
    tester.test_create_lead_invalid_email()

    # Test 5: Create another lead with different service
    print("\n📋 Testing Different Service Types...")
    test_lead_2 = {
        'name': f'Jane Doe {timestamp}',
        'email': f'jane{timestamp}@example.com',
        'phone': '0423 456 789',
        'suburb': 'Melbourne',
        'message': 'Selling'
    }
    
    lead_id_2, _ = tester.test_create_lead(**test_lead_2)
    if lead_id_2:
        print(f"✅ Second lead created with ID: {lead_id_2}")

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Print failed tests
    failed_tests = [test for test in tester.test_results if not test['success']]
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test['name']}: {test['actual_status']} (expected {test['expected_status']})")
            print(f"     Error: {test['response_preview']}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())