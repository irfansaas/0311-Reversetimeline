#!/usr/bin/env python3

with open('src/components/business-case/CustomerProfile/CustomerProfileForm.jsx', 'r') as f:
    content = f.read()

# 1. Add Use Case Count and App Count fields after User Profile section
old_user_section_end = """            </select>
          </div>
        </div>
      </div>

      {/* Locations Section */"""

new_user_section_end = """            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Use Cases
            </label>
            <input
              type="number"
              value={formData.useCaseCount}
              onChange={(e) => handleInputChange('useCaseCount', parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              min="1"
              placeholder="3"
            />
            <p className="text-xs text-gray-500 mt-1">Typical use cases: General Office, Finance, Engineering, etc.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Applications
            </label>
            <input
              type="number"
              value={formData.appCount}
              onChange={(e) => handleInputChange('appCount', parseInt(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              min="1"
              placeholder="20"
            />
            <p className="text-xs text-gray-500 mt-1">Number of applications to be deployed in AVD</p>
          </div>
        </div>
      </div>

      {/* Locations Section */"""

content = content.replace(old_user_section_end, new_user_section_end)

# 2. Add Planned Start Date field - find the Timeline section (should be after Current Environment)
# First, let's find where Timeline section starts and add Planned Start Date there
old_timeline_section = """      {/* Timeline Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-purple-600" size={24} />
          Timeline & Project Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Go-Live Date
            </label>"""

new_timeline_section = """      {/* Timeline Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-purple-600" size={24} />
          Timeline & Project Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Planned Start Date
            </label>
            <input
              type="date"
              value={formData.plannedStartDate}
              onChange={(e) => handleInputChange('plannedStartDate', e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">When do you plan to start the implementation?</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Go-Live Date
            </label>"""

content = content.replace(old_timeline_section, new_timeline_section)

with open('src/components/business-case/CustomerProfile/CustomerProfileForm.jsx', 'w') as f:
    f.write(content)

print("✓ Added UI fields for useCaseCount, appCount, and plannedStartDate")
